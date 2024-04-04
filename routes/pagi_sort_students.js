/*
Program: pagination sorting router
Description: controls all requests belongs to pagination sortingtask
Called-by: server.js
@uther: Vivek Kandoliya
*/


// =====  Importing Lcoal Modules =====
const express = require('express');

// =====  Importing Local Modules  =====
const varifyUser = require('../middlewares/varifyUser');
const controller = require('../controllers/pagi_sort_students/pss_controller');

// ===== Setting Variables  =====
const router = express.Router();

// ========== Endpoint Section (Login Required in All) (/tasks/pagi_sort_students) ==========

// End-point 1 : /tasks/pagi_sort_students/ (login required)
//Desc: renders page of the task
router.get('/',varifyUser, controller.home_page)

module.exports = router;

