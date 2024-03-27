

//--------------- Importing Node Modules

const express = require('express');
const path = require('path');
require('dotenv').config();


//--------------- Importing local modules

const router = require('./Routes/home');
const dbconnection = require('./db');

//-------------------Configs and Middlewares

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname + '/views')));

app.set('view engine','ejs');


//----------------Listening Server

const port = process.env.port;
let con;
app.listen(port, (err) => {
    if(err) throw err;
    con = dbconnection();
    console.log('Server is Listening on Port: '+ port);
})


//--------------- Distributing Routes

app.use('/', router);



