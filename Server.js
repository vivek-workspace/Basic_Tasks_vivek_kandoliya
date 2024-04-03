

//--------------- Importing Node Modules

const express = require('express');
const path = require('path');
require('dotenv').config();


//--------------- Importing local modules

const home = require('./controllers/home');
const on_events = require('./controllers/on_events');
const dynamic_table = require('./controllers/dynamic_table');
const kuku_cube = require('./controllers/kuku_cube');
const tic_tac_toe = require('./controllers/tic_tac_toe');
const job_app_ajax = require('./controllers/job_app_ajax');
const job_app_simple = require('./controllers/job_app_simple');
const component_generator = require('./controllers/component_generator');
const delimited_search = require('./controllers/delimited');
const dynamic_output = require('./controllers/dynamic_output');
const fetch_json_placeholder = require('./controllers/fetch_json_placeholder');
const student_registration_file = require('./controllers/create_read_on_file/form_server');
const pagi_sort_students = require('./controllers/pagi_sort_students');
const attendence_result = require('./controllers/attendence_result');
const simple_search = require('./controllers/simple_search');
const city_state  = require('./controllers/city_state');
const world_clock = require('./controllers/world_clock');
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
app.use('/tasks/simple_search',simple_search);
app.use('/tasks/delimited_search', delimited_search);
app.use('/tasks/dynamic_output', dynamic_output);
app.use('/tasks/fetch_json_placeholder', fetch_json_placeholder);
app.use('/tasks/student_registration_file', student_registration_file);
app.use('/tasks/pagi_sort_students', pagi_sort_students);
app.use('/tasks/attendence_result',attendence_result);
app.use('/tasks/city_state',city_state);
app.use('/tasks/world_clock',world_clock);




