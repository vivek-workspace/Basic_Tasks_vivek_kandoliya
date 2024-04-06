/*
Program : verifyUser
Type: Middleware
Description: this middleware is used for verifying jwt token at the all endpoints where login in required.
Auther: Vivek Kandoliya
*/

//- - - Node Modules

const jwt = require('jsonwebtoken');
const url = require('url');

const jwt_secreat = process.env.jwt_secreat;

const varifyUser = (req, res, next) => {
    // getting the user from jwt token
    if(!req.headers.cookie){
        res.redirect('/auth');
    }
    const token  = req.headers.cookie.split('=')[1];

    try{
        const data = jwt.verify(token, jwt_secreat);
        req.user = data.userId;
        next();
    }
    catch(error){
        console.log("error in fetch-user catch: ");
        console.log(error)
        //res.status(401).send({ error: "authenticate using valid token" });
        res.redirect('/auth');
    }
}

module.exports = varifyUser;