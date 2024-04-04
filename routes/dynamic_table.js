/*
Program: fetching dynamic_table router
Description: controls all requests belongs to fdynamic_table task
Called-by: server.js
@uther: Vivek Kandoliya
*/

// =====  Importing Node Modules =====
const express = require('express');
const path = require('path');

// =====  Importing Local Modules  =====
const varifyUser = require('../middlewares/varifyUser');

// ===== Setting Variables  =====
const router = express.Router();

// ========== Endpoint Section (Login Required in All) (/tasks/attendence_result/) ==========

// End-point 1 : /tasks/dynamic_table/ (login required)
//Desc: returns html file of the dynamic table task
router.get('/', varifyUser, (req,res) => { 
    try{
        res.sendFile(path.join(__dirname, '../views/Dynamic_Table_JS_T2.html'));
    }
    catch(error){
        console.log('touched : Routes/dynamic_table -> router.get("/")')
        console.log(error);
        res.render('error_page');
    }
})

module.exports = router