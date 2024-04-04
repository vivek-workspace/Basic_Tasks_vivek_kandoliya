/*
Program: job application simple router
Description: controls all requests belongs to job application simple task
Called-by: server.js
@uther: Vivek Kandoliya
*/

// =====  Importing Lcoal Modules =====
const express = require('express');

// =====  Importing Local Modules  =====
const varifyUser = require('../middlewares/varifyUser');
const controller = require('../controllers/job_app_simple/jas_controller');;

// ===== Setting Variables  =====
const router = express.Router();

// ========== Endpoint Section (Login Required in All) (/tasks/job_app_simple/) ==========

// End-point 1 : /tasks/job_app_simple/ (login required)
//Desc: returns application list for job app simple
router.get('/', varifyUser, controller.list)

// End-point 2 : /tasks/job_app_simple/form (login required)
//Desc: returns form for job app simple
router.get('/form',varifyUser, controller.form_page)

// End-point 3 : /tasks/job_app_simple/submit (login required)
//Desc: handles submit of job app form simple
router.post('/submit',varifyUser, controller.submit)

// End-point 4 : /tasks/job_app_simple/getuser (login required)
//Desc: returns data of the perticuler user
router.post('/update',varifyUser, controller.update_user)

module.exports = router;