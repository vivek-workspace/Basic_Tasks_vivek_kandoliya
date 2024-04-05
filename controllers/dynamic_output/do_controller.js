/*
Program: dynamic output controller
Description: main controller of dynamic output task
Called-by: dynamic_output.js
@uther: Vivek Kandoliya
*/

// ====  Importing Node Modules  ====
const { LocalStorage } = require("node-localstorage");
const { CLIENT_RENEG_LIMIT } = require('tls');

//=====  Importing Local Modules  =====
const con = require('../../db');

//===== Setting valriables  ======
let localstorage = new LocalStorage('./abc');

//Function return fresh_home : returns fresh home page of this task (first time)
const fresh_home = (req, res) => {
    try {
        res.render('dynamic_out/pages/home', { result: false });
    }
    catch (error) {
        console.log('touched : controllers/dynamic_output/do_controller -> fresh_home')
        console.log(err);
        return res.render('error_page');
    }
}

//Function return post_query : returns output data of the fired query (page 1)
const post_query = (req, res) => {

    //set set variables using request data
    let sqlquery = req.body.sqlquery;
    sqlquery = sqlquery.replace(";", "");

    //storing query into local storage.
    localstorage.clear();
    localstorage.setItem("sqlquery", sqlquery);

    let finalsqlquery = sqlquery;

    //storing limit into local storage.
    let limited = -1;
    localstorage.setItem('limited', limited);
    if (!sqlquery.includes('limit') && sqlquery.length != 0) {
        finalsqlquery = `${sqlquery} limit 0,20`;
    }
    else if (sqlquery.length != 0) {
        destructured = finalsqlquery.split('limit');
        limited = parseInt(destructured[1]);
        localstorage.setItem('limited', limited);
        if (limited < 20) {
            finalsqlquery = `${destructured[0]} limit 0,${limited}`;
        }
        else {
            finalsqlquery = `${destructured[0]} limit 0,20`;
        }

    }

    con.query(`${finalsqlquery}; ${sqlquery}`, function (err, result) {
        console.log('adfasd',finalsqlquery,'kmnljik', sqlquery)
        if (err) {
            console.log(err);
            return res.render('dynamic_out/pages/home', { result: true, err: true, data: err, query: finalsqlquery });
        } else {

            return res.render('dynamic_out/pages/home', { result: true, err: false, query: finalsqlquery, data: result[0], columns: Object.keys(result[0][0]), page: 1, no_of_records: 20, total_data: result[1].length });
        }
    })

}


//Function return get_query : returns output data of next pages (other pages)
const get_query = (req, res) => {
    try{
        let page = req.query.page;
        if (page == undefined || isNaN(page)) page = 1;
        let sqlquery = localstorage.getItem('sqlquery');
        let start = (page * 20) - 20;
        let limited = localstorage.getItem('limited');
        let finalsqlquery = sqlquery
    
        if (!sqlquery.includes('limit')) {
            finalsqlquery = `${sqlquery} limit ${start},20;`;
        }
        else if (sqlquery.length != 0) {
            destructured = finalsqlquery.split('limit');
            limited = parseInt(destructured[1]);
            console.log(limited);
            console.log(start);
            console.log(start + 20)
            if (limited < start + 20 && limited > 0) {
                finalsqlquery = `${destructured[0]} limit ${start},${limited - start};`;
            }
            else {
                finalsqlquery = `${destructured[0]} limit ${start},20;`;
            }
        }
    
    
        con.query(`${finalsqlquery} ${sqlquery}`, function (err, result) {
            try{
                if (err) {
                    res.render('dynamic_out/pages/home', { result: true, err: true, data: err, query: finalsqlquery });
                } else if(result[0].length > 0){
                    
                    res.render('dynamic_out/pages/home', { result: true, err: false, query: finalsqlquery, data: result[0], columns: Object.keys(result[0][0]), page: page, no_of_records: 20, total_data: result[1].length });
                }
                else{
                    res.render('dynamic_out/pages/home', { result: false, err: false});
                }
            }
            catch(error){
                console.log(error);
            }
        })
    }
    catch(error){
        console.log(error);
    }
   


}

module.exports = { fresh_home, post_query, get_query }