/*
Program: City State router
Description: controls all requests belongs to city state task
Called-by: server.js
@uther: Vivek Kandoliya
*/


// =====  Importing Node Modules =====
const express = require('express');


// =====  Importing Local Modules  =====
const varifyUser = require('../middlewares/varifyUser');
const controller = require('../controllers/city_state/cs_controller');

// ===== Setting Variables  =====
const router = express.Router();

// ========== Endpoint Section (Login Required in All) (/tasks/city_state/) ==========

// End-point 1 : /tasks/city_state/ (login required)
//Desc: returns home page
router.get('/',varifyUser, controller.home_page)

// End-point 2 : /tasks/city_state/cities (login required)
//Desc: returns object of cities in json format
router.post('/cities',varifyUser, controller.cities) 

module.exports = router;
