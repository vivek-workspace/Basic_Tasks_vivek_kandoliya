/*
Program: Home page router
Description: controls dashboard request
Called-by: server.js
@uther: Vivek Kandoliya
*/

// =====  Importing Node Modules =====
const express = require('express');
const path = require('path');
require('dotenv').config();

// =====  Importing Local Modules  =====
const con = require('../db');
const varifyUser = require('../middlewares/varifyUser');
const controller = require('../controllers/auth/auth_controller');

// ===== Setting Variables  =====
const router = express.Router();
const jwt_secreat = process.env.jwt_secreat;


// ========== Endpoint Section (Login Required in All) (/dashboard) ==========

// End-point 1 : / (login required)
//Desc: dashboard of the all tasks
router.get('/', varifyUser, (req, res) => {
    res.render('dashboard');
})


module.exports = router

// ===== Unoptimized code  ======

// router.get('/fetchuser',varifyUser,async (req, res) => {

//    const email = req.user;
//    const UserData = await getUser(email);

//    res.status(200).json({UserData});
// })

// router.get('/success', (req, res) => {

//     res.render('login/pages/success');
// })