/*
Program: create read on file
Description: route file for above task
Called-by: server.js
@uther: Vivek Kandoliya
*/




// =====  Importing Node Modules =====
const express = require('express');
const { validationResult, body } = require('express-validator');

// =====  Importing Local Modules  =====
const varifyUser = require('../middlewares/varifyUser');
const controller = require('../controllers/create_read_on_file/cr_controller');

// ===== Setting Variables  =====
const router = express.Router();

// ========== Endpoint Section (Login Required in All) (/tasks/student_registration_file) ==========

// End-point 1 : /tasks/student_registration_file/ (login required)
//Desc: student registration form
router.get('/', varifyUser, controller.form);

// End-point 2 : /tasks/student_registration_file/form (login required)
//Desc: called when user submit form
router.post('/form', varifyUser,
    body('first_name').notEmpty(), //validating data using express-validator
    body('last_name').notEmpty(),
    body('age').notEmpty(),
    body('number').isLength({ min: 10, max: 10 }),
    body('email').isEmail(),
    body('gender').notEmpty(),
    body('hobbies').notEmpty(),
    body('address').notEmpty()
    , controller.submit);


// End-point 3 : /tasks/student_registration_file/list (login required)
//Desc: returns list of total students
router.get('/list', varifyUser, controller.list)

// // End-point 4 : /tasks/student_registration_file/person-details (login required)
// //Desc: returns details of the id (person)
router.get('/person-details', varifyUser, controller.person_details)

module.exports = router;