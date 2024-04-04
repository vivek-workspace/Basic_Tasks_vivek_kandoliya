/*
Program: Dynamic Output router
Description: controls all requests belongs to Dynamic Output task
Called-by: server.js
@uther: Vivek Kandoliya
*/


// =====  Importing Node Modules =====
const express = require('express');
const { LocalStorage } = require("node-localstorage");
const { CLIENT_RENEG_LIMIT } = require('tls');

// =====  Importing Local Modules  =====
const varifyUser = require('../middlewares/varifyUser');
const controller = require('../controllers/dynamic_output/do_controller');

// ===== Setting Variables  =====
let localstorage = new LocalStorage('./abc');
const router = express.Router();


// ========== Endpoint Section (Login Required in All) (/tasks/dynamic_output/) ==========

// End-point 1 : /tasks/dynamic_output/ (login required)
//Desc: returns fresh home page.
router.get('/',varifyUser, controller.fresh_home);

// End-point 2 - post : /tasks/dynamic_output/query (login required)
//Desc: home page with first page of listing
router.post('/query', varifyUser, controller.post_query);

// End-point 3 - get: /tasks/dynamic_output/query (login required)
//Desc: home page with others page of listing
router.get('/query', varifyUser, controller.get_query)

////////////////////////////////////////////////////
module.exports = router;