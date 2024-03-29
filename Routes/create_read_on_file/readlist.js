const fs = require('fs');

const readlist = (callback) => {
    
    let file_obj = {};
    try {
        fs.readFile('people.txt', function (err, data) {
    
            if (err) {
                flag = false;
                console.log(err);
                callback(err);
            }
            else {
                let str = data.toString();
                let json_str = `{"people": [${str.substring(0, str.length - 1)}]}`;
                file_obj = JSON.parse(json_str);
                callback(file_obj)
                
            }
        })
    }
    catch (error) {
        console.log(error);
    }
}
module.exports = readlist;