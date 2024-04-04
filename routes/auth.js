/*
Program: authentication router
Description: controls all requests belongs authentication
Called-by: server.js
@uther: Vivek Kandoliya
*/

// =====  Importing Node Modules =====
const express = require('express');

// =====  Importing Local Modules  =====
const controller = require('../controllers/auth/auth_controller');

// ===== Setting Variables  =====
const router = express.Router();

// ========== Endpoint Section (Login Not Required in All) (/) ==========

// End-point 1 : / (login not required)
//Desc: login page
router.get('/', controller.login_page)

// End-point 2 : /register (login not required)
//Desc: login page
router.get('/register', controller.register_page)

// End-point 3 : /registeruser (login not required)
//Desc: creates new user
router.post('/registeruser', controller.registeruser);

// End-point 4 : /activate (login not required)
//Desc: activates user account
router.get('/activate', controller.activate);

// End-point 4 : /fgtpwd (login not required)
//Desc: handles forget password submit
router.get('/fgtpwd', controller.forget_password);

// End-point 5 : /setpwd (login not required)
//Desc: renders page for setting new password
router.get('/setpwd', controller.setpwd_page);

// End-point 6 : /changepwd (login not required)
//Desc: handles submit for set password and changes users pwd
router.post('/changepwd', controller.change_password);

// End-point 7 : /signin (login not required)
//Desc: handles submit of the login page
router.post('/signin', controller.authenticate);

module.exports = router;