

//--------------- Importing Node Modules

const express = require('express');
const path = require('path');
require('dotenv').config();


//--------------- Importing local modules

const auth = require('./routes/auth');
const home = require('./routes/home');
const on_events = require('./routes/on_events');
const dynamic_table = require('./routes/dynamic_table');
const kuku_cube = require('./routes/kuku_cube');
const tic_tac_toe = require('./routes/tic_tac_toe');
const job_app_ajax = require('./routes/job_app_ajax');
const job_app_simple = require('./routes/job_app_simple');
const component_generator = require('./routes/component_generator');
const delimited_search = require('./routes/delimited');
const dynamic_output = require('./routes/dynamic_output');
const fetch_json_placeholder = require('./routes/fetch_json_placeholder');
const student_registration_file = require('./routes/create_read_on_file');
const pagi_sort_students = require('./routes/pagi_sort_students');
const attendence_result = require('./routes/attendence_result');
const simple_search = require('./routes/simple_search');
const city_state  = require('./routes/city_state');
const world_clock = require('./routes/world_clock');
const invalidURL = require('./routes/invalid_url');
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

app.use('/', auth);
app.use('/dashboard', home);
app.use('/tasks/on_events', on_events);
app.use('/tasks/dynamic_table', dynamic_table);
app.use('/tasks/kuku_cube', kuku_cube);
app.use('/tasks/tic_tac_toe', tic_tac_toe);
app.use('/tasks/job_app_ajax', job_app_ajax);
app.use('/tasks/job_app_simple', job_app_simple);
app.use('/tasks/component_generator', component_generator);
app.use('/tasks/simple_search',simple_search);
app.use('/tasks/delimited_search', delimited_search);
app.use('/tasks/dynamic_output', dynamic_output);
app.use('/tasks/fetch_json_placeholder', fetch_json_placeholder);
app.use('/tasks/student_registration_file', student_registration_file);
app.use('/tasks/pagi_sort_students', pagi_sort_students);
app.use('/tasks/attendence_result',attendence_result);
app.use('/tasks/city_state',city_state);
app.use('/tasks/world_clock',world_clock);
app.use('*',invalidURL);




