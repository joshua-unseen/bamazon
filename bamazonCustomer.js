require("dotenv").config();
const keys = require("./keys.js");
const mysql = require("mysql");
const inquirer = require("inquirer");


const dbConnection = mysql.createConnection({
    host: "localhost",
    user: keys.sql.user,
    password: keys.sql.password,
    database: "bamazon_db"
});

dbConnection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + dbConnection.threadId + "\n");
    readDB();
    dbConnection.end();
});

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
                return theArray;
            },
            name: "item"
        }
    ]).then(answer => {
        console.log(resultsArr);
        console.log(answer.item.split(" ")[0]);
        var itemNum = parseInt(answer.item.split(" ")[0]);
        var theItem = []
        resultsArr.forEach(el => {
            // console.log(el);
            if (el[0] === itemNum) {
                // console.log(el);
                theItem = el;
            }
        });
        console.log(theItem);
        inquirer.prompt([
            {
                message: "How many " + theItem[1] + "s would you like?",
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
            console.log(answer.quantity);
            stockUpdate(itemNum, answer.quantity);
        }).catch(errorHandler);
    }).catch(errorHandler);
}

function stockUpdate(key, quantity) {
    
}

function errorHandler(err) {
    console.log(err);
}