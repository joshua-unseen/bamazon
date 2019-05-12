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

dbConnection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + dbConnection.threadId + "\n");
    mainPrompt();
    dbConnection.end();
});

function mainPrompt() {
    dbConnection.query("select item_id, product_name, price from products", function (err, results) {
        if (err) {
            console.log(err);
        }
        results.forEach(el => {
            console.log(el.item_id + " " + el.product_name + " $" + el.price);
        });
    });
    // inquirer.prompt([
    //     {
    //         message: "What do you want to buy today?",
    //         type: "list",

    //     }
    // ]);
}