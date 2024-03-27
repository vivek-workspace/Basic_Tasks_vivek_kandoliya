
const jwt = require('jsonwebtoken');

const jwt_secreat = process.env.jwt_secreat;

const varifyUser = (req, res, next) => {
    // getting the user from jwt token
    // console.log(req.headers);
    if(!req.headers.cookie){
        res.status(401).send({error: 'no auth-token found'});
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
        res.status(401).send({ error: "authenticate using valid token" });
    }
}

module.exports = varifyUser;