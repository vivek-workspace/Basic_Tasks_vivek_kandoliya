

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
const job_app_simple = require('./Routes/job_app_simple');
const component_generator = require('./Routes/component_generator');
const delimited_search = require('./Routes/delimited');
const dynamic_output = require('./Routes/dynamic_output');
const fetch_json_placeholder = require('./Routes/fetch_json_placeholder');
const student_registration_file = require('./Routes/create_read_on_file/form_server');
const pagi_sort_students = require('./Routes/pagi_sort_students');
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
app.use('/tasks/job_app_simple', job_app_simple);
app.use('/tasks/component_generator', component_generator);
app.use('/tasks/delimited_search', delimited_search);
app.use('/tasks/dynamic_output', dynamic_output);
app.use('/tasks/fetch_json_placeholder', fetch_json_placeholder);
app.use('/tasks/student_registration_file', student_registration_file);
app.use('/tasks/pagi_sort_students', pagi_sort_students);



