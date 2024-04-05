/*
Program: simple search router
Description: controls all requests belongs to simple search task
Called-by: server.js
@uther: Vivek Kandoliya
*/
// =====  Importing Node Modules =====
const express = require('express');
const path = require('path');

// =====  Importing Node Modules =====
const varifyUser = require('../middlewares/varifyUser');
const controller = require('../controllers/simple_search/ss_controller');

// =====  Setting Variables =====
const router = express.Router();

// ========== Endpoint Section (Login Required in All) (/tasks/simple_search) ==========

// End-point 1 : /tasks/simple_search/ (login required)
//Desc: renders page of the task

router.get('/',varifyUser, controller.home_page);

module.exports = router;