/*
Program: form server
Description: this module main controller  for this task (includes request endpoints)
Called-by: server.js
@uther: Vivek Kandoliya
*/




// =====  Importing Node Modules =====
const express = require('express');
const path = require('path');
const { validationResult, body } = require('express-validator');
const fs = require('fs');

// =====  Importing Local Modules  =====
const varifyUser = require('../../middlewares/varifyUser');
const create = require('./createusr');
const read_list = require('./readlist');
const persondetails = require('./persondetails');

// ===== Setting Variables  =====
const router = express.Router();

// ========== Endpoint Section (Login Required in All) (/tasks/student_registration_file) ==========

// End-point 1 : /tasks/student_registration_file/ (login required)
//Desc: student registration form
router.get('/', varifyUser, (req, res) => {
    res.render('create_read_on_file/pages/form');
})

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
    , (req, res) => {
        try {
            const result = validationResult(req); //returns array of errors
            if (result.isEmpty()) {
                const form_data = req.body;
                const ans = create(form_data); //calling function create from createuser.js
                if (ans)
                    res.render('create_read_on_file/pages/submitted');
                else
                    res.render('create_read_on_file/pages/form');
            }
            else {
                res.render('create_read_on_file/pages/errorpage', { errors: result.array() })
            }
        }
        catch (error) {
            console.log('touched : Routes/create_read_on_file/form_server -> routes.post("/form")')
            console.log(error);
        }
    })


// End-point 3 : /tasks/student_registration_file/list (login required)
//Desc: returns list of total students
router.get('/list', varifyUser, (req, res) => {

    //calling read_list from readlist.js and sending response in callback;
    try{
        const ans = read_list((result) => {
            if (result.people)
                res.render('create_read_on_file/pages/peoplelist', { list: result })
            else res.render('create_read_on_file/pages/nodata');
        });
    }
    catch(error){
        console.log('touched : Routes/create_read_on_file/form_server -> router.get("/list")');
        console.log(error);
    }
})

// End-point 4 : /tasks/student_registration_file/person-details (login required)
//Desc: returns details of the id (person)
router.get('/person-details', varifyUser, (req, res) => {
    const pid = req.query.id;

    try{
        //calling function from persondetails.js
        persondetails(pid, (result) => {
            res.render('create_read_on_file/pages/persondetails', { person: result });
        });
    }
    catch(error){
        console.log('touched : Routes/create_read_on_file/form_server -> router.get("/person-details")');
        console.log(error);
    }

})

module.exports = router;