

//--------------- Importing Node Modules

const express = require('express');
const path = require('path');
require('dotenv').config();


//--------------- Importing local modules

const home = require('./Routes/home');
const on_events = require('./Routes/on_events');
const dynamic_table = require('./Routes/dynamic_table');
const kuku_cube = require('./Routes/kuku_cube');
const tic_tac_toe = require('./Routes/tic_tac_toe');
const job_app_ajax = require('./Routes/job_app_ajax');
// const job_app_simple = require('./Routes')
require('./db');

//-------------------Configs and Middlewares

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname + '/views')));

app.set('view engine','ejs');


//----------------Listening Server

const port = process.env.port;

app.listen(port, (err) => {
    if(err) throw err;
    console.log('Server is Listening on Port: '+ port);
})


//--------------- Distributing Routes

app.use('/', home);
app.use('/tasks/on_events', on_events);
app.use('/tasks/dynamic_table', dynamic_table);
app.use('/tasks/kuku_cube', kuku_cube);
app.use('/tasks/tic_tac_toe', tic_tac_toe);
app.use('/tasks/job_app_ajax', job_app_ajax);
// app.use('/tasks/job_app_simple', job_app_simple);



