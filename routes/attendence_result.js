/*
Program: Attendence Result router
Description: controls all requests belongs to attendene_result task
Called-by: server.js
@uther: Vivek Kandoliya
*/


// =====  Importing Node Modules =====
const express = require('express');

// =====  Importing Local Modules  =====
const varifyUser = require('../middlewares/varifyUser');
const controller = require('../controllers/attendence_result/ar_controller')

// ===== Setting Variables  =====
const router = express.Router();


// ========== Endpoint Section (Login Required in All) (/tasks/attendence_result/) ==========

// End-point 1 : /tasks/attendence_result/ (login required)
//Desc: student registration form
router.get('/', varifyUser, controller.attendence);


//==========================   Exam =============================================//
// End-point 2 : /tasks/attendence_result/exam (login required)
//Desc: student registration form
router.get('/exam', varifyUser, controller.exam);

// //==========================   Exam =============================================//

// // End-point 3 : /tasks/attendence_result/result (login required)
// //Desc: student full result
router.get('/result', varifyUser, controller.result);


module.exports = router;
