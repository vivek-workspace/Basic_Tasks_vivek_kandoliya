/*
Program: component generator router
Description: controls all requests belongs to component_generator task
Called-by: server.js
@uther: Vivek Kandoliya
*/

//=====  Importing Node Modules  =====
const express = require('express');

//=====  Importing Local Modules  =====
const varifyUser = require('../middlewares/varifyUser');
const controller = require('../controllers/component_generator/cg_controller');

//=====  Setting Variables  =====
const router = express.Router();

// ========== Endpoint Section (Login Required in All) (/tasks/component_generator/) ==========

// End-point 1 : /tasks/component_generator/ (login required)
//Desc: returns home page
router.get('/',varifyUser, controller.home_page)

// End-point 2 : /tasks/component_generator/generate (login required)
//Desc: returns data of the component
router.get('/generate',varifyUser, controller.generate)


module.exports = router;