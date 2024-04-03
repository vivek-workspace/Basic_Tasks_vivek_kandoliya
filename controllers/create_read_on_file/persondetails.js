/*
Program: Personal Details
Description: this module returns the details of specific person
Called-by: form_server.js
@uther: Vivek Kandoliya
*/

// ===== Importing Node Modules =====
const fs = require('fs');


//Function : reads file and call callbackfunction in form_server.js for response
const peoplelist = (pid, callback) => {

    let file_obj = {};
    try {

        fs.readFile('people.txt', function (err, data) { //reading file
            if (err) {
                flag = false;
                console.log(err)
                callback(err);
                // throw err;
            }
            else {
                let ele = {};
                let str = data.toString(); 
                //converting textdata to json-string
                let json_str = `{"people": [${str.substring(0, str.length - 1)}]}`; 
                file_obj = JSON.parse(json_str);
                file_obj.people.forEach(element => { //searching for person id
                    if (element.sid == pid) {
                        ele = element;
                    }
                });

                callback(ele);
            }
        })
    }
    catch (error) {
        console.log(error)
    }

}
module.exports = peoplelist;