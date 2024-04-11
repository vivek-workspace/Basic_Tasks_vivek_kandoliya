/*
Program: kuku cube router
Description: route file for kuku cube
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

// ========== Endpoint Section (Login Required in All) (/tasks/kuku_cube) ==========

// End-point 1 : /tasks/kuku_cube/ (login required)
//Desc: sending html file
router.get('/', varifyUser, (req,res) => { 
    try{
        res.render('Color_Game_Js_T3');
    }catch(error){
        console.log('touched : routes/kukucube -> router.get(/)')
        console.log(error);
        res.render('error_page');
    }
})

module.exports = router;