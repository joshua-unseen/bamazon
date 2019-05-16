require("dotenv").config();
const keys = require("./keys.js");
const mysql = require("mysql");
const inquirer = require("inquirer");

// create the DB connection
const dbConnection = mysql.createConnection({
    host: "localhost",
    user: keys.sql.user,
    password: keys.sql.password,
    database: "bamazon_db"
});

console.clear();

//Connect to the DB
dbConnection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + dbConnection.threadId + "\n");
    readDB();
    // dbConnection.end();
});

// Get the basic product information for the interactive prompt
function readDB() {
    var resultsArr = [];
    dbConnection.query("select item_id, product_name, price from products", function (err, results) {
        if (err) {
            console.log(err);
        }
        results.forEach(bam => {
            // resultsArr.push(bam.item_id + " " + bam.product_name + " $" + bam.price);
            resultsArr.push([bam.item_id, bam.product_name, "$" + bam.price]);
            // resultsArr.push({"value": bam.item_id, "name": bam.product_name, "price": bam.price,});
        });
        mainPrompt(resultsArr);
    });
}

// The main prompt.  Shows items for sale, and an exit option
function mainPrompt(resultsArr) {
    inquirer.prompt([
        {
            message: "What do you want to buy today?",
            type: "list",
            // choices: resultsArr,
            choices: function (ans) {
                // console.log(ans);
                var theArray = [];
                resultsArr.forEach(item => {
                    theArray.push(item.join(" "));
                });
                theArray.push("Exit");
                return theArray;
            },
            name: "item"
        }
    ]).then(answer => {
        // console.log(resultsArr);
        // console.log(answer.item);
        // console.log(answer.item.split(" ")[0]);
        if (answer.item === "Exit") {
            dbConnection.end();
            return;
        }
        var itemNum = parseInt(answer.item.split(" ")[0]);
        var theItem = []
        // Search on item number, 'cuz the array will not track with item_num if products are deleted from the DB
        resultsArr.forEach(el => {
            // console.log(el);
            if (el[0] === itemNum) {
                // console.log(el);
                theItem = el;
            }
        });
        // console.log(theItem);
        // Get the quantity desired.
        inquirer.prompt([
            {
                message: "How many " + theItem[1] + " items would you like?",
                type: "number",
                name: "quantity",
                validate: function (input) {
                    if (input) {
                        return true;
                    }
                    return false;
                }
            }
        ]).then(answer => {
            // console.log(answer.quantity);
            stockUpdate(itemNum, answer.quantity);
        }).catch(errorHandler);
    }).catch(errorHandler);
}

// Handle stock quantity verification and updating the DB
function stockUpdate(key, quantity) {
    dbConnection.query(
        "select item_id, stock_quantity, price from products where ?",
        {
            "item_id": key
        },
        function (err, results) {
            if (err) {
                console.log(err);
            }
            var inStock = results[0].stock_quantity;
            var itemPrice = results[0].price;
            // console.log(inStock);
            // console.log(itemPrice);
            if (inStock < quantity) {
                console.log("Sorry, insufficient stock on hand.\n");
                readDB();
            }
            else {
                var yourCost = itemPrice * quantity;
                console.log("We can fulfill that order.  Your cost is $" + yourCost.toFixed(2) + "\n");
                dbConnection.query(
                    "update products set stock_quantity = ? where ?",
                    [
                        inStock - quantity,
                        {
                            "item_id": results[0].item_id
                        }
                    ],
                    function(err, results,fields) {
                        if (err) {
                            console.log(err);
                        }
                        // console.log(results);
                        // console.log(fields);
                        readDB();
                    }
                );
            }
        });
}

function errorHandler(err) {
    console.log(err);
}