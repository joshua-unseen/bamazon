const mysql = require("mysql");
const inquirer = require("inquirer");

var dbConnection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Gilgamesh",
    database: "bamazon_db"
});

dbConnection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    mainPrompt();
    dbConnection.end();
});

function mainPrompt() {
    dbConnection.query("select product_name from products", function (err, results) {})
    inquirer.prompt([
        {
            message: "What do you want to buy today?",
            type: "list",

        }
    ])
}