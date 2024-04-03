/*
Program: delimited search controller
Description: main controller of delimited search task
Called-by: delimited.js
@uther: Vivek Kandoliya
*/


//=====  Importing Local Modules  =====
const con = require('../../db');
const common_functions = require('../common/common');

//Function home_page : returns listing of the students with search and without search.
const list = (req, res) => {

    let searchString = req.query.searchbox;
    if (searchString == undefined) searchString = '';
    let SortingFields = ProcessRaw(searchString); // converting search string to object of arrays

    let { Student_ID, First_Name, Father_Name, Last_Name, Gender, City, Age, Mobile_No } = SortingFields

    //setting fiels and value array with proper order
    let fields = ['Student_ID', 'First_Name', 'Father_Name', 'Last_Name', 'Gender', 'City', 'State', 'Country', 'Age', 'Mobile_No']
    let values = [Student_ID, First_Name, Father_Name, Last_Name, Gender, City, Age, Mobile_No];

    //generating dynamic conditional part of the query
    let sqlqueryPostfix = common_functions.generateConditionalSelect(fields, values);

    let sqlquery = ` select Student_ID, First_Name, Father_Name, Last_Name, Gender, City, State, Country, Age, Mobile_No, concat(extract(year from Time_Stamp),'-',extract(month from Time_Stamp),'-',extract(day from Time_Stamp) ,' ', extract(Hour from Time_Stamp), ':', extract(Minute from Time_Stamp) , ':', extract(Second from Time_Stamp)) as 'Time_Stamp(Y-M-D H:M:S)' from Student_Master `
    sqlquery += sqlqueryPostfix;

    try {
        con.query(`${sqlquery}`, (err, result, fields) => {
            if (err) {
                console.log('touched : controllers/delimited_search/cs_controller -> list')
                console.log(err);
                return res.render('error_page');
            };
            res.render('delimited/pages/home', { data: result, searchString: searchString, columns: fields, sqlquery: sqlquery });
        })
    }
    catch (err) {
        console.log(err);
    }

}

//function ProcessRaw : this funciton takes delimited search string as input and returns search object which contans multiple arrays of search words
function ProcessRaw(str) {

    let indexArray = []

    for(let i=0; i<str.length; i++){
        let SC = str.charAt(i);
        if(SC == '-' || SC == '_' || SC == '^' || SC == '$' || SC == '{' || SC == '}' || SC == ':' || SC == '*'){
            indexArray.push(i);
        }
    }
    

    let SearchObject = {
        Student_ID: [],
        First_Name: [],
        Father_Name: [],
        Last_Name: [],
        Gender: [],
        City: [],
        Age: [],
        Mobile_No: []
    }
   
    indexArray.sort(function(a, b) {
        return a - b;
      });

    for (let i = 0; i < indexArray.length; i++) {
        if(indexArray[i] >= 0){
            switch (str.charAt(indexArray[i])) {
                case '-':
                    SearchObject.Student_ID.push(str.slice(indexArray[i]+1, indexArray[i + 1]));
                    break;
                case '_':
                    SearchObject.First_Name.push(str.slice(indexArray[i]+1, indexArray[i + 1]));
                    break;
                case '^':
                    SearchObject.Father_Name.push(str.slice(indexArray[i]+1, indexArray[i + 1]));
                    break;
                case '$':
                    SearchObject.Last_Name.push(str.slice(indexArray[i]+1, indexArray[i + 1]));
                    break;
                case '{':
                    SearchObject.Gender.push(str.slice(indexArray[i]+1, indexArray[i + 1]));
                    break;
                case '}':
                    SearchObject.City.push(str.slice(indexArray[i]+1, indexArray[i + 1]));
                    break;
                case ':':
                    SearchObject.Age.push(str.slice(indexArray[i]+1, indexArray[i + 1]));
                    break;
                case '*':
                    SearchObject.Mobile_No.push(str.slice(indexArray[i]+1, indexArray[i + 1]));
                    break;
            }   
        }
    }

    console.log(SearchObject);
    return SearchObject;
}

module.exports = { list }