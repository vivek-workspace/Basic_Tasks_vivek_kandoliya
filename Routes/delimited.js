
//--------------- Importing Node Modules
const express = require('express');

//------------------Configs
const router = express.Router();
const path = require('path');
const varifyUser = require('../middlewares/varifyUser');
const con  = require('../db');

//----------------End Points (Login Required)

///////////////////////////////////////////////////////////////////////////////

router.get('/', varifyUser,(req, res) => {

    let searchString = req.query.searchbox;
    if(searchString == undefined) searchString = '';
    let SortingFields = ProcessRaw(searchString);
    
    let sqlquery = generateQuery(SortingFields);

    try{
        con.query(`${sqlquery}`, (err, result, fields) => {
            if (err) return res.send('sql error occured.');
            res.render('delimited/pages/home', { data: result,searchString: searchString, columns: fields ,sqlquery: sqlquery});
        })
    }
    catch(err){
        console.log(err);
    }

})

function ProcessRaw(str) {

    let indexArray = []

    for(let i=0; i<str.length; i++){
        let SC = str.charAt(i);
        if(SC == '-' || SC == '_' || SC == '^' || SC == '$' || SC == '{' || SC == '}' || SC == ':' || SC == '*'){
            indexArray.push(i);
        }
    }
    // indexArray.push(parseInt(str.indexOf('-')));
    // indexArray.push(parseInt(str.indexOf('_')));
    // indexArray.push(parseInt(str.indexOf('^')));
    // indexArray.push(parseInt(str.indexOf('$')));
    // indexArray.push(parseInt(str.indexOf('{')));
    // indexArray.push(parseInt(str.indexOf('}')));
    // indexArray.push(parseInt(str.indexOf(':')));
    // indexArray.push(parseInt(str.indexOf('*')));

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
    console.log(indexArray);
    indexArray.sort(function(a, b) {
        return a - b;
      });
    console.log(indexArray);

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

function generateQuery(params){

    let sqlquery = ` select Student_ID, First_Name, Father_Name, Last_Name, Gender, City, State, Country, Age, Mobile_No, concat(extract(year from Time_Stamp),'-',extract(month from Time_Stamp),'-',extract(day from Time_Stamp) ,' ', extract(Hour from Time_Stamp), ':', extract(Minute from Time_Stamp) , ':', extract(Second from Time_Stamp)) as 'Time_Stamp(Y-M-D H:M:S)'    from Student_Master `

    if(!params.Student_ID.length == 0){
        let array = params.Student_ID
        console.log("search sid = "+params.Student_ID)
        if(!sqlquery.includes('where')) sqlquery+= ' where ';
        else sqlquery += ` and `
        let Search_by_ID= ` Student_Master.Student_ID in (${array}) `;
        sqlquery += Search_by_ID;
    }
    if(!params.First_Name.length == 0){
        if(!sqlquery.includes('where')) sqlquery+= ' where ( ';
        else sqlquery += ` and ( `;
        let Search_by_Student_f_Name = ''
        for(let i=0; i<params.First_Name.length; i++){
            if(!i == 0) Search_by_Student_f_Name += ` or ` 
            Search_by_Student_f_Name += ` Student_Master.First_Name LIKE '%${params.First_Name[i]}%' `
        }
        sqlquery += (Search_by_Student_f_Name + ` ) `);
    }

    if(!params.Father_Name.length == 0){
        if(!sqlquery.includes('where')) sqlquery+= ' where ( ';
        else sqlquery +=  ` and ( `;
        let Search_by_Student_m_Name = ''
        for(let i=0; i<params.Father_Name.length; i++){
            if(!i == 0) Search_by_Student_m_Name += ` or ` 
            Search_by_Student_m_Name += ` Student_Master.Father_Name LIKE '%${params.Father_Name[i]}%'  `
        }
        sqlquery += Search_by_Student_m_Name + ` ) `;
    }

    if(!params.Last_Name.length == 0){
        if(!sqlquery.includes('where')) sqlquery+= ' where ( ';
        else sqlquery +=  ` and ( `;
        let Search_by_Student_l_Name = '';
        for(let i=0; i<params.Last_Name.length; i++){
            if(!i == 0) Search_by_Student_l_Name += ` or ` 
            Search_by_Student_l_Name += ` Student_Master.Last_Name LIKE '%${params.Last_Name[i]}%' `
        }
        sqlquery += Search_by_Student_l_Name + ` ) `;
    }

    if(!params.Gender.length == 0){
        if(!sqlquery.includes('where')) sqlquery+= ' where ( ';
        else sqlquery += ` and ( `;
        let Search_by_Student_Gender =''

        for(let i=0; i<params.Gender.length; i++){
            if(!i == 0) Search_by_Student_Gender += ` or ` 
            Search_by_Student_Gender += ` Student_Master.Gender LIKE '%${params.Gender[i]}%' `
        }
        sqlquery += Search_by_Student_Gender + ` ) `;
        
    }

    if(!params.City.length == 0){
        if(!sqlquery.includes('where')) sqlquery+= ' where ( ';
        else sqlquery += ` and ( `;
        let Search_by_Student_City = '';
        
        for(let i=0; i<params.City.length; i++){
            if(!i == 0) Search_by_Student_City += ` or ` 
            Search_by_Student_City += ` Student_Master.City LIKE '%${params.City[i]}%' `
        }
        sqlquery += Search_by_Student_City + ` ) `;
    }

    if(!params.Age.length == 0){
        if(!sqlquery.includes('where')) sqlquery+= ' where ( ';
        else sqlquery += ` and ( `;
        let Search_by_Student_Age = '';
        for(let i=0; i<params.Age.length; i++){
            if(!i == 0) Search_by_Student_Age += ` or ` 
            Search_by_Student_Age += ` Student_Master.Age LIKE '%${params.Age[i]}%' `
        }
        sqlquery += Search_by_Student_Age + ` ) `;
    }

    if(!params.Mobile_No.length == 0){
        if(!sqlquery.includes('where')) sqlquery+= ' where ( ';
        else sqlquery += ` and ( `;
        let Search_by_Student_MoNo = '';
        for(let i=0; i<params.Mobile_No.length; i++){
            if(!i == 0) Search_by_Student_MoNo += ` or ` 
            Search_by_Student_MoNo += ` Student_Master.Mobile_No LIKE '%${params.Mobile_No[i]}%' `
        }
        sqlquery += Search_by_Student_MoNo + ` ) `;
    }

    sqlLimit = ' limit 20;'
    sqlquery +=  sqlLimit;
    return sqlquery;
}

/////////////////////////////////////////////////////////////////////////////

module.exports = router;