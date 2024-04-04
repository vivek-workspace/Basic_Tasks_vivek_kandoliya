/*
Program: Dynamic Output router
Description: controls all requests belongs to Dynamic Output task
Called-by: server.js
@uther: Vivek Kandoliya
*/


//--------------- Importing Node Modules
const express = require('express');
const { LocalStorage } = require("node-localstorage");
const { CLIENT_RENEG_LIMIT } = require('tls');

//------------------Configs
const router = express.Router();
const varifyUser = require('../middlewares/varifyUser');
const controller = require('../controllers/dynamic_output/do_controller');
let localstorage = new LocalStorage('./abc');




////////////////////////////////////////////////////


router.get('/',varifyUser, controller.fresh_home);

router.post('/query', varifyUser, controller.post_query);

router.get('/query', varifyUser, controller.get_query)

////////////////////////////////////////////////////
module.exports = router;