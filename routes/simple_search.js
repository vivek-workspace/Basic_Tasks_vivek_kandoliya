
//--------------- Importing Node Modules
const express = require('express');

//------------------Configs
const router = express.Router();
const path = require('path');
const varifyUser = require('../middlewares/varifyUser');
const controller = require('../controllers/simple_search/ss_controller');


//----------------End Points (Login Required)

router.get('/',varifyUser, controller.home_page);






module.exports = router;