/*
Program: tic tac toe router
Description: catchs request for this task and sends a file
Called-by: server.js
@uther: Vivek Kandoliya
*/

// =====  Importing Node Modules =====
const express = require('express');
const path = require('path');

// =====  Importing Lcoal Modules =====
const varifyUser = require('../middlewares/varifyUser');

// =====  Setting Variables =====
const router = express.Router();

// ========== Endpoint Section (Login Required in All) (/tasks/tic_tac_toe) ==========

// End-point 1 : /tasks/tic_tac_toe/ (login required)
//Desc: renders page of the task
router.get('/', varifyUser, (req,res) => { 
    try{
        res.sendFile(path.join(__dirname, '../views/TicTacToe_JS_T4.html'));
    }
    catch(error){
        console.log('touched : routers/tic_tac_toe -> router.get(/')
        console.log(error);
        res.render('error_page');
    }
})

module.exports = router;