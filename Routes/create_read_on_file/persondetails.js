
const fs = require('fs');

const peoplelist = (pid, callback) => {

    let file_obj = {};
    try {
        fs.readFile('people.txt', function (err, data) {

            if (err) {
                flag = false;
                console.log(err)
                callback(err);
                // throw err;
            }
            else {
                let ele = {};
                let str = data.toString();
                let json_str = `{"people": [${str.substring(0, str.length - 1)}]}`;
                file_obj = JSON.parse(json_str);
                file_obj.people.forEach(element => {
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