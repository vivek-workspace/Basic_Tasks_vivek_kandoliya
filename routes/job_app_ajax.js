/*
Program: job application ajax router
Description: controls all requests belongs to job application ajax task
Called-by: server.js
@uther: Vivek Kandoliya
*/

// =====  Importing Node Modules =====
const express = require('express');

// =====  Importing Local Modules  =====
const router = express.Router();
const varifyUser = require('../middlewares/varifyUser');
const controller = require('../controllers/job_app_ajax/jaa_controller');


// ========== Endpoint Section (Login Required in All) (/tasks/job_app_ajax/) ==========

// End-point 1 : /tasks/job_app_ajax/ (login required)
//Desc: returns application list for job app ajax
router.get('/', varifyUser, controller.list);

// End-point 2 : /tasks/job_app_ajax/form (login required)
//Desc: returns form for job app ajax
router.get('/form', varifyUser, controller.form_page)

// End-point 3 : /tasks/job_app_ajax/submit (login required)
//Desc: handles submit of job app form ajax
router.post('/submit', varifyUser, controller.submit)

// End-point 4 : /tasks/job_app_ajax/getuser (login required)
//Desc: returns data of the perticuler user
router.get('/getusr', varifyUser, controller.get_user);

// End-point 5 : /tasks/job_app_ajax/update (login required)
//Desc: handles submit of update  form
router.post('/update', varifyUser, controller.update_user);

module.exports = router;