/*
Program: auth controller
Description: main controller of authentication
Called-by: auth.js
@uther: Vivek Kandoliya
*/

// =====  Importing Node Modules =====
const util = require("util");
const md5 = require('md5');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// =====  Importing Lcoal Modules =====
const con = require('../../db');
const {createNewUser, generateSalt, generateToken, getUser, checkExistance, validateToken} = require('./supportive');
const jwt_secreat = process.env.jwt_secreat;


//Function login_page : renders login page of the project
const login_page = (req, res) => {
  try{
    res.render('login/pages/login', {fresh: true});
  }
  catch(error){
    console.log('touched : controllers/auth -> login_page')
    console.log(error);
    res.render('error_page');
  }
}

//Function register_page : renders register page of the project
const register_page = async (req, res) => {
  try{
    res.render('login/pages/register', { fresh: true });
  }
  catch(error){
    console.log('touched : controllers/auth -> register_page')
    console.log(error);
    res.render('error_page');
  }
  
}

//Function registeruser : handles submit of register page
const registeruser = async (req, res) => {

  try{
    const { email, first_name, last_name, city, pwd } = req.body;
    const checkIfUserExist = await checkExistance(email);
  
    const salt = generateSalt();
    const activation_token = generateToken();
    const encrypted_pwd = md5(pwd + salt);
  
    let result;
    if (!checkIfUserExist) {
        result = await createNewUser({ email, salt, first_name, last_name, city, encrypted_pwd, activation_token });
        if (result) {
  
            // const res_obj = {
            //     status: true,
            //     token: activation_token
            // }async 
            // return res.json({res_obj});
            res.render('login/pages/activation', { status: true, email, token: activation_token });
        }
    }
    else {
        // const res_obj = {
        //     status: false,
        //     message: 'User Already Exist'
        // }
        res.render('login/pages/register', { fresh: false });
    }
  }
  catch(error){
    console.log('touched : controllers/auth -> registeruser')
    console.log(error);
    res.render('error_page');
  }
}

//Function activate : activates user account
const activate = async (req, res) => {
  try{
    const mail = req.query.id;
    const token = req.query.token;
  
    const promisedQuery = util.promisify(con.query).bind(con);
  
    const user = await getUser(mail);
    const validatedToken = await validateToken(user[0], token)
    if (validatedToken == 1) {
  
        const sqlquery = `update users set account_status = true where email = '${mail}'`
        const result = await promisedQuery(sqlquery);
        // res.json({
        //     userFound: true,
        //     account_status: true
        // })
     
        res.render('login/pages/success', { status: 'Your Account is Activated' });
    }else if(validatedToken == 0){
       
        res.render('login/pages/success', { status: 'Your Token is Expired' });
    }
    else if (validatedToken == -1){
      
        res.render('login/pages/success', { status: 'invalid token' });
    }
  }
  catch(error){
    console.log('touched : controllers/auth -> activate')
    console.log(error);
    res.render('error_page');
  }

 

}

//Function forget_password : handles forget password submit
const forget_password = async (req, res) => {

  try{
    const email = req.query.id;
    const activation_token = generateToken();
  
    const checkIfUserExist = await checkExistance(email);
    if(checkIfUserExist){
        const activation_token = generateToken();
        const promisedQuery = util.promisify(con.query).bind(con);
        const current_time = new Date();
       
        const sqlquery = `update users set activation_token = '${activation_token}', regi_time = CURRENT_TIMESTAMP()  where email = '${email}'`;
        const result = await promisedQuery(sqlquery);
        res.render('login/pages/fogpwd', { status: true, email, token: activation_token });
    }
    else{
        res.render('login/pages/login',{ fresh: false, message: 'User does Not exist.'});
    }
  }
  catch(error){
    console.log('touched : controllers/auth -> forget_password')
    console.log(error);
    res.render('error_page');
  }

}

//Function setpwd_page : renders page for setting new password
const setpwd_page = (req,res) => {

  try{
    const token = req.query.token;
    const email = req.query.id;
  
    res.render('login/pages/setpwd', {token, email});
  }
  catch(error){
    console.log('touched : controllers/auth -> setpwd_page')
    console.log(error);
    res.render('error_page');
  }
}


//Function change_password : handles submit of the set password page
const change_password = async (req, res) => {
  const email = req.body.email;
  const token = req.body.token;
  const pwd = req.body.pwd;
  const promisedQuery = util.promisify(con.query).bind(con);

  const user = await getUser(email);
  const validatedToken = await validateToken(user[0], token);
  const salt = generateSalt();
  const encrypted_pwd = md5(pwd + salt);

  if (validatedToken == 1) {

      const sqlquery = `update users set pwd = '${encrypted_pwd}', salt = '${salt}' where email = '${email}'`
      const result = await promisedQuery(sqlquery);
      // res.json({
      //     userFound: true,
      //     account_status: true
      // })
   
      res.render('login/pages/success', { status: 'Your Password has been Changed' });
  }else {     
      res.render('login/pages/success', { status: 'Something went wrong, Please retry "Forget Password"' });
  }
}

//Function authenticate : authenticate username and password and sends authtoken to the user
const authenticate = async (req, res) => {

  const promisedQuery = util.promisify(con.query).bind(con);
  const { email, pwd } = req.body;
  const checkIfUserExist = await checkExistance(email);

  if(checkIfUserExist) {
      const user = await getUser(email);
     
      if (user[0].account_status == 1) {
         
          const passwordstr = pwd + user[0].salt;
        
          if (user[0].pwd == md5(passwordstr)) {
              
              const data = {
                  userId: user[0].email
              }
              const authtoken = jwt.sign(data, jwt_secreat);

              // res.cookie("token", authtoken).redirect('home',{status: 'Login Successfully.'});
              res.cookie("token", authtoken).redirect('/dashboard');
          }
          else {
              res.render('login/pages/login',{fresh: false, message: 'Invalid Credentials.'});
          }

      }
      else {
          res.render('login/pages/login',{fresh: false, message: 'Your Account is Not Activated, Please Activate first to sign in.'});
      }

  }
  else {
      res.render('login/pages/login',{ fresh: false, message: 'User does Not exist.'});
  }


}


module.exports = {login_page, register_page, registeruser, activate, forget_password, setpwd_page, change_password, authenticate}