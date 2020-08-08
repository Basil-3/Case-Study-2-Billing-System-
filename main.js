const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");

var app = express();

// Defining port number
const port = process.env.PORT || 8080;

app.use(bodyParser.json());

//Creating MySQL connection
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Admin123",
    database: "learners",
    multipleStatements: true
});

// Checking status of connection
con.connect((err) => {
    if (err){
        console.log("Connection failed !" + JSON.stringify(err, undefined, 2));
    }
    console.log("Connected ...");
});

// Endpoint to receive list of products
app.get('/products', (req, res) => {
    sql = "Select * From products;";
    con.query(sql, (err, rows, fields) => {
        if (err){
            console.log(err);
        }
        res.send(rows);
    });
});

// Endpoint to retrieve product based on product code
app.get('/products/:id', (req, res) => {
    sql = "select * from products where code = ?;";
    con.query(sql, [req.params.id], (err, row, fields) => {
        if(err){
            console.log(err);
        }
        res.send(row);
    });
});

// Endpoint to register a product in table
app.post('/products', (req, res) => {
    let product = req.body;
    // console.log('req is',req.body); //for debugging
    var sql = "Set @code = ?; Set @name = ?; Set @category = ?; Set @description = ?; Set @price = ?; Set @quantity = ?; Call productAddOrUpdate(@code, @name, @category, @description, @price, @quantity);";
    con.query(sql, [product.code, product.name, product.category, product.description, product.price, product.quantity], (err, rows, fields) => {
        if(err){
            console.log(err);
        }
        rows.forEach(element => {
            if(element.constructor == Array){
                res.send("New product code: " + element[0].code);
            }
        });
    });
});

// Endpoint to create bill against product number provided
app.put('/products', (req, res) => {
    let product = req.body;
    var sql = "Set @code = ?; Set @name = ?; Set @category = ?; Set @description = ?; Set @price = ?; Set @quantity = ?; Call productAddOrUpdate(@code, @name, @category, @description, @price, @quantity);";
    con.query(sql, [product.code, product.name, product.category, product.description, product.price, product.quantity], (err, rows, fields) => {
        if (err){
            console.log(err)
        }
        con.query("Select * from products Where code = ?", [product.code], (err1, row1, fields1) => {
            res.status(200).json({
                name: product.name,
                category: product.category,
                description: product.description,
                price: product.price,
                quantity: product.quantity,
                amount: product.price * product.quantity
            });
        });
    });
});

// Endpoint to delete a product
app.delete('/products/:id', (req, res) => {
    var sql = "Delete From products Where code = ?;";
    con.query(sql, [req.params.id], (err, row, fields) => {
        if(err){
            console.log(err);
        }
        res.send("Product removed successfully...");
    });
});

// Starting session on port
app.listen(port, () => console.log(`Listening on port ${port} ...`));