/*
Program: on events router
Description: route file for on events
Called-by: server.js
@uther: Vivek Kandoliya
*/

// =====  Importing Node Modules =====
const express = require('express');

// =====  Importing Local Modules  =====
const varifyUser = require('../middlewares/varifyUser');

// ===== Setting Variables  =====
const router = express.Router();
const path = require('path');

// ========== Endpoint Section (Login Required in All) (/tasks/on_events) ==========

// End-point 1 : /tasks/on_events/ (login required)
//Desc: sending file for on events
router.get('/', varifyUser, (req,res) => { 
   
    try{
        res.sendFile(path.join(__dirname, '../views/on_events_JS_T1.html'));
    }catch(error){
        console.log('touched : routes/on_events -> router.get(/)')
        console.log(error);
        res.render('error_page');
    }
})

module.exports = router;