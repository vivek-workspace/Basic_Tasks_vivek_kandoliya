
//--------------- Importing Node Modules
const express = require('express');
const util = require("util");
const crypto = require('crypto');
const md5 = require('md5');
const jwt = require('jsonwebtoken');
require('dotenv').config();

//------------------Configs
const router = express.Router();
const path = require('path');
const con = require('../db');
const varifyUser = require('../middlewares/varifyUser');
const jwt_secreat = process.env.jwt_secreat;

// router.get('/', (req, res) => {
//     res.render('home')
// })





/////////////////////////////////////////////////

router.get('/register', async (req, res) => {
    res.render('login/pages/register', { fresh: true });
})

router.get('/', (req, res) => {

    res.render('login/pages/login', {fresh: true});
})

router.post('/registeruser', async (req, res) => {

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
})


router.get('/activate', async (req, res) => {

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



})

router.get('/fgtpwd',async (req, res) => {

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

})

router.get('/setpwd', (req,res) => {
    const token = req.query.token;
    const email = req.query.id;

    res.render('login/pages/setpwd', {token, email});
})

router.post('/changepwd',async (req, res) => {
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
})

router.post('/signin', async (req, res) => {

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


})

router.get('/fetchuser',varifyUser,async (req, res) => {

   const email = req.user;
   const UserData = await getUser(email);

   res.status(200).json({UserData});
})

router.get('/dashboard', varifyUser, (req, res) => {
    res.render('dashboard');
})


router.get('/success', (req, res) => {

    res.render('login/pages/success');
})


// ==========  Creating New User ===============================//

async function createNewUser(data) {

    const promisedQuery = util.promisify(con.query).bind(con);

    const { email, salt, first_name, last_name, city, encrypted_pwd, activation_token } = data;


    const sqlquery = `insert into users (email, pwd, salt, first_name, last_name, city, account_status, activation_token) values (?,?,?,?,?,?,?,?);`
    const result = await promisedQuery(sqlquery, [email, encrypted_pwd, salt, first_name, last_name, city, false, activation_token]);
    if (result.affectedRows == 1)
        return true;
    else
        return false;


}



function generateSalt() {
    return crypto.randomBytes(2).toString('hex');
}

function generateToken() {
    return crypto.randomBytes(8).toString('hex');
}

async function getUser(email) {
    const promisedQuery = util.promisify(con.query).bind(con);
    const sqlquery = `select * from users where email = ?;`
    const result = await promisedQuery(sqlquery,[email]);

    return result;
}

async function checkExistance(email) {

    const promisedQuery = util.promisify(con.query).bind(con);
    const sqlquery = `select count(email) as count from users where email = ?; `
    let flag = true;

    const result = await promisedQuery(sqlquery, [email]);
   
    if (result[0].count == 0) {
        flag = false;
       
    }
  
    return flag;

}

function validateToken(user, token) {

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
////////////////////////////////////////////////////




module.exports = router;
