const express = require('express');
const mySql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');
const httpStatus = require('http-status-codes');
const app = express();
const port = process.env.PORT || 4000;
const db = mySql.createConnection({
    host: 'db4free.net',
    user: 'demowebcart',
    password: '7d3b6655',
    database: 'demowecart',
});

db.connect();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
/* Promise Query Database */
function queryDatabasePromise(query, queryValues) {
    return new Promise((resolve, reject) => {
        db.query(query, queryValues, (error, results) => {
            if (error) {
                reject(error, httpStatus.INTERNAL_SERVER_ERROR);

            } else {
                resolve(results)
            }
        })
    })
}
// call my item in your cart 
app.get('/',(req,res)=>{
    res.send('Welcome to web services');
})

app.get('/Cart/:id',(req,res)=>{
    let id = req.params.id;
    let queryCart = 'SELECT * FROM cart where id =?';
    queryDatabasePromise(queryCart,id).then(results=>{
        if(results.length == 0){
            res.send(httpStatus.NOT_FOUND)
        }else{
            res.json(results)
        }
    })
})
app.get('/Cart',(req,res)=>{
    let queryCart = 'SELECT * FROM cart ORDER BY ID DESC LIMIT 1'
    queryDatabasePromise(queryCart).then(results=>{
        if(results.length == 0){
            res.send(httpStatus.NOT_FOUND)
        }else{
            res.json(results)
        }
    })
})

app.post('/Cart', (req, res) => {
    let postData = req.body;    
    let insertDataInTodos = 'INSERT INTO cart SET ?';
    if (postData === undefined) {
        res.send(httpStatus.BAD_REQUEST);
    } else {
        queryDatabasePromise(insertDataInTodos, postData).then((results) => {
            res.json(results);
        })
    }
})

app.listen(port, () => {
    console.log(`app listening in your port ${port}`);
})