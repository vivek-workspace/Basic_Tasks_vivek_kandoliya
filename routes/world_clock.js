/*
Program: world clock router
Description: catchs request for this task and handles it
Called-by: server.js
@uther: Vivek Kandoliya
*/


// =====  Importing Node Modules =====
const express = require('express');
const path = require('path');
const { chownSync } = require('fs');
    
// =====  Importing Lcoal Modules =====
const varifyUser = require('../middlewares/varifyUser');
const controller = require('../controllers/world_clock/wc_controller')
const con = require('../db');

// =====  Setting Variables =====)
const router = express.Router();

// ========== Endpoint Section (Login Required in All) (/tasks/world_clock) ==========

// End-point 1 : /tasks/world_clock/ (login required)
//Desc: renders home page and data of the task
router.get('/',varifyUser,controller.home_page )

module.exports = router;


