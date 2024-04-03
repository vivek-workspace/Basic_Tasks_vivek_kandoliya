/*
Program: create read main controller
Description: this module main controller for task: create read on file (includes request endpoints)
Called-by: create_read_file.js
@uther: Vivek Kandoliya
*/


// =====  Importing Node Modules =====
const fs = require('fs');
const { validationResult, body } = require('express-validator');

// =====  Importing Local Modules  =====
const create = require('./createusr');
const read_list = require('./readlist');
const persondetails = require('./persondetails');

// ====  Functions  =====

//Function form : renders people form
const form = (req, res) => {
    res.render('create_read_on_file/pages/form');
}
//Function submit : handles submit of the function
const submit = (req, res) => {
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
        console.log('touched : controllers/create_read_on_file/cr_controller -> submit')
        console.log(error);
        res.render('error_page');
    }
}


//Function list : renders list
const list = (req, res) => {

    //calling read_list from readlist.js and sending response in callback;
    try{
        const ans = read_list((result) => {
            if (result.people)
                res.render('create_read_on_file/pages/peoplelist', { list: result })
            else res.render('create_read_on_file/pages/nodata');
        });
    }
    catch(error){
        console.log('touched : controllers/create_read_on_file/cr_controller -> list');
        console.log(error);
        res.render('error_page');
    }
}

//Function person_details : returns details of the specific person
const person_details = (req, res) => {
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
        res.render('error_page');
    }

}

module.exports = {form, submit, list, person_details}