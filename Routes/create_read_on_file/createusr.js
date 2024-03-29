const fs = require('fs');
const peoplelist = require('./persondetails');



const create = (user) => {


    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let id = "";
    for (let i = 0; i < 10; i++) {
        id += characters.charAt(Math.floor(Math.random() * 10));
    }

    user.sid = id;
    let flag = true;

    try {
        fs.appendFile('people.txt', JSON.stringify(user) + ",", function (err) {
            if (err) {
                flag = false;
                console.log(err);
            }
            else {
                console.log("file created");
            }
        })
    }
    catch (error) {
        console.log(error);
    }
    return flag;
}

module.exports = create;