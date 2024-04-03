/*
Program: create user
Description: this module creates new user in file
Called-by: form_server.js
@uther: Vivek Kandoliya
*/


// ===== Importing Local Modules =====
const fs = require('fs');
const peoplelist = require('./persondetails');


// ==== Function: used to append user data in file
const create = (user) => {

    //generating unique id for user
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let id = "";
    for (let i = 0; i < 10; i++) {
        id += characters.charAt(Math.floor(Math.random() * 10));
    }

    user.sid = id;
    let flag = true;

    try { // appending data to file
        fs.appendFile('people.txt', JSON.stringify(user) + ",", function (err) {
            if (err) {
                flag = false;
                console.log(err);
            }
        })
    }
    catch (error) {
        console.log('touched : Routes/create_read_on_file/createuser -> create()')
        console.log(error);
    }
    return flag;
}

module.exports = create;