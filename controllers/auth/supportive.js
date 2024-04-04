/*
Program: supportive functions
Description: contains functions which used in auth controleller repeatively
Called-by: auth_controller.js
@uther: Vivek Kandoliya
*/

// =====  Importing Node Modules =====
const util = require("util");
const crypto = require('crypto');

// =====  Importing Local Modules  =====
const con = require('../../db');

// ===== Setting Variables  =====
require('dotenv').config();


//Function createNewUser : creates new user into db.
async function createNewUser(data) {

  try {

    const promisedQuery = util.promisify(con.query).bind(con);

    const { email, salt, first_name, last_name, city, encrypted_pwd, activation_token } = data;


    const sqlquery = `insert into users (email, pwd, salt, first_name, last_name, city, account_status, activation_token) values (?,?,?,?,?,?,?,?);`
    const result = await promisedQuery(sqlquery, [email, encrypted_pwd, salt, first_name, last_name, city, false, activation_token]);
    if (result.affectedRows == 1)
      return true;
    else
      return false;
  }
  catch (error) {
    console.log('touched : controllers/auth/supportive -> createNewUser')
    console.log(error);
    res.render('error_page');
  }
}

//Function generateSalt : generates string
function generateSalt() {
  try {
    return crypto.randomBytes(2).toString('hex');
  }
  catch (error) {
    console.log('touched : controllers/auth/supportive -> generateSalt')
    console.log(error);
    res.render('error_page');
  }
}

//Function generateToken : generates string
function generateToken() {
  try {
    return crypto.randomBytes(8).toString('hex');
  }
  catch (error) {
    console.log('touched : controllers/auth/supportive -> generateToken')
    console.log(error);
    res.render('error_page');
  }
}

//Function getUser : returns user of perticuler email
async function getUser(email) {

  try {
    const promisedQuery = util.promisify(con.query).bind(con);
    const sqlquery = `select * from users where email = ?;`
    const result = await promisedQuery(sqlquery, [email]);
    return result;
  }
  catch (error) {
    console.log('touched : controllers/auth/supportive -> getUser')
    console.log(error);
    return res.render('error_page');
  }
}

//Function checkExistance : checks if user exists or not
async function checkExistance(email) {

  try {
    const promisedQuery = util.promisify(con.query).bind(con);
    const sqlquery = `select count(email) as count from users where email = ?; `
    let flag = true;

    const result = await promisedQuery(sqlquery, [email]);

    if (result[0].count == 0) {
      flag = false;

    }

    return flag;
  }
  catch (error) {
    console.log('touched : controllers/auth/supportive -> checkExistance')
    console.log(error);
    return res.render('error_page');
  }

}

// Function validateToken : validates activation token of the user
function validateToken(user, token) {

  try{
    const regTime = user.regi_time;
    const usrToken = user.activation_token;
    const currentTime = new Date();
    const validTimeDiff = 2000;
    const timeDiff = (currentTime.getTime() - regTime.getTime()) / 1000;
    if (timeDiff > validTimeDiff && token == usrToken) {
  
      return 0;
    }
    else if (timeDiff <= validTimeDiff && token == usrToken) {
  
      return 1;
    }
    else {
  
      return -1;
    }
  
  }
  catch(error){
    console.log('touched : controllers/auth/supportive -> validateToken')
    console.log(error);
    return res.render('error_page');
  }
  
}


module.exports = { createNewUser, generateSalt, generateToken, getUser, checkExistance, validateToken }