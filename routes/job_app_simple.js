
//--------------- Importing Node Modules
const express = require('express');
const util = require("util");

//------------------Configs
const router = express.Router();
const varifyUser = require('../middlewares/varifyUser');
const con  = require('../db');

//----------------End Points (Login Required)
// router.get('/', varifyUser, (req,res) => { 
//     res.sendFile(path.join(__dirname, '../views/Color_Game_JS_T3.html'));
// })


///////////////////////////////////////////////////////

router.get('/', varifyUser, async (req, res) => {
    let promisedQuery = util.promisify(con.query).bind(con);
    const sqlquery = 'select applicant_id, first_name, last_name from applicants;'

    const result= await promisedQuery(sqlquery);
    console.log(result);
    res.render('job_app_simple/pages/list', {result, length: result.length});

})
    
router.get('/form',varifyUser, async (req, res) => {
    let promisedQuery = util.promisify(con.query).bind(con);

    const sqlquery = `select select_master.select_key, select_master.select_value, select_master.combo_type, option_master.option_key, option_master.option_value from select_master join option_master on select_master.select_key = option_master.select_key;`
    let result = await promisedQuery(sqlquery);
    if(isNaN(req.query.id)){
        res.render('job_app_simple/pages/form', { result: result, update: false, user:  [false]})
    }
    else{
        const fetchUsrQuery = `select * from applicants where applicant_id = ${parseInt(req.query.id)}`
        const fetchEducationDetails = `select id, degree,course,university_or_board,passing_year,percentage from education_details where applicant_id = ${parseInt(req.query.id)}`
        const fetchLanguagenDetails = `select language, lread,lwrite,speak from languages_known where applicant_id = ${parseInt(req.query.id)}`
        const fetchTechnologies = `select technology, expertise from technologies_known where applicant_id = ${parseInt(req.query.id)}`
        const fetchworkexperience = `select applicant_id, company, designation, DATE_FORMAT(joining, '%Y-%m-%d'), DATE_FORMAT(leaving, '%Y-%m-%d') from work_experience where applicant_id = ${parseInt(req.query.id)}`
        const fetchReference = `select applicant_id, reference_name, reference_mobile_no, relation from reference_contact where applicant_id = ${parseInt(req.query.id)}`
        let fetchUsr = await promisedQuery(fetchUsrQuery);
        let fetchEdu = await promisedQuery(fetchEducationDetails);
        let fetchLan = await promisedQuery(fetchLanguagenDetails);
        let fetchTech = await promisedQuery(fetchTechnologies);
        let fetchWE = await promisedQuery(fetchworkexperience);
        let fetchRC = await promisedQuery(fetchReference);
        console.log(fetchUsr);
        res.render('job_app_simple/pages/form', { result: result, update: true, user: fetchUsr,education_data: fetchEdu, language_data: fetchLan, technology_data: fetchTech, work_exp: fetchWE, con_list: fetchRC});
    }

    

    // console.log(result)
    

})

router.post('/submit',varifyUser, async (req, res) => {

    const formData = req.body;
    console.log(formData)
    const id = await insertBasicDetails(formData);
    await insertEducationalDetails(formData, id);
    await insertWorkexperienceDetails(formData, id);
    await insertReferanceContact(formData, id);
    await insertLanguages(formData, id);
    await insertTechnologies(formData, id);

    res.json({ id });
    // res.send('ok')
})

router.post('/update',varifyUser, async (req, res) => {

    const formData = req.body;
    console.log(formData)
    
    const id = await updateBasicDetails(formData);
    await updateEducationalDetails(formData);
    await updateLanguageDetails(formData);
    await updateTechnologyDetails(formData);
    await updateWorkExperience(formData, id);
    await updateReferenceContacts(formData, id)

    res.send('ok');
})

// ======================= inserting basic details ===================================================//


async function insertBasicDetails(formData) {

    let promisedQuery = util.promisify(con.query).bind(con);

    const values_array = ['first_name', 'last_name', 'designation', 'zip_code', 'address_1', 'address_2', 'city', 'state', 'email', 'phone', 'gender', 'relationship', 'dob', 'prefered_location', 'notice_period', 'department', 'expacted_ctc', 'currunt_ctc']

    let values = [];
    values_array.forEach(item => {
        if ((item == 'expacted_ctc' || item == 'notice_period' || item == 'currunt_ctc') && formData[item] != '') {
            values.push(parseInt(formData[item]))
        }
        else values.push(formData[item]);
    })

    const fields = ['first_name', 'last_name', 'designation', 'zipcode', 'address_1', 'address_2', 'city', 'state', 'email', 'phone_no','gender', 'relationship_status', 'date_of_birth', 'prefered_location', 'notice_period', 'department', 'expacted_ctc', 'currunt_ctc'];

    let sqlquery = `insert into applicants (`;
    sqlquery += generateQuery(fields, values);
    values = removeEmpty(values);

    let result = await promisedQuery(sqlquery,values);

    return result.insertId;

}

// ======================= inserting Educational details ===================================================//

async function insertEducationalDetails(formData, id) {

    let promisedQuery = util.promisify(con.query).bind(con);

    const { degree, board_uni, course, passing_year, percentage } = formData;
    const fields = ['applicant_id', 'degree', 'course', 'university_or_board', 'passing_year', 'percentage'];
    // const length = percentage.length;
    const allDeg = ['ssc', 'hsc'].concat(degree);
    const newcourse = ['ssc','hsc'].concat(course);
    let values = [];
    // console.log("abc", allDeg)

    const filtered_data = filterRows([allDeg, newcourse, board_uni, passing_year, percentage]);
    const length = filtered_data[0].length;

    for (let i = 0; i < length; i++) {
        let sqlquery = `insert into education_details (`;
        values = [];
        values.push(id);
        for(let j=0; j< filtered_data.length; j++){
            if(j == 1 && i < 2){
                values.push('');
            }
            else values.push(filtered_data[j][i]);
        }
        // console.log('value str',values)
        sqlquery += generateQuery(fields, values);
        console.log(sqlquery);
        try {
            values = removeEmpty(values)
            let result = await promisedQuery(sqlquery,values);
            console.log(result)
        }
        catch (err) {
            console.log(err);
        }
    }
}

// ======================= inserting Work Experience Details ===================================================//

async function insertWorkexperienceDetails(formData, id) {
    let promisedQuery = util.promisify(con.query).bind(con);

    const { company, old_designation, from, to } = formData;
    const fields = ['applicant_id', 'company', 'designation', 'joining', 'leaving'];
    
    const filtered_data = filterRows([company, old_designation, from, to]);
    const length = filtered_data[0].length;
    console.log('fd',filtered_data)
    let values = [];

    for (let i = 0; i < length; i++) {
        let sqlquery = `insert into work_experience (`;
        values = []
        values.push(id);
        for(let j=0; j< filtered_data.length; j++){
            values.push(filtered_data[j][i]);
        }
        
        sqlquery += generateQuery(fields, values);
        console.log(sqlquery);
        try {
            values = removeEmpty(values)
            let result = await promisedQuery(sqlquery, values);
            console.log(result)
        }
        catch (err) {
            console.log(err);
        }
    }
}

// ======================= inserting Languages ===================================================//

async function insertLanguages(formData, id){
    let promisedQuery = util.promisify(con.query).bind(con);

    const { language, read, write, speak } = formData;
    const fields = ['applicant_id','language', 'lread', 'lwrite','speak'];
    let nread = (read == undefined)?[]:read;
    let nwrite = (write == undefined)?[]:write;
    let nspeak = (speak == undefined)?[]:speak;
    const filtered_data = [language, nread, nwrite, nspeak];
    const length = filtered_data[0].length;
    // console.log(filtered_data)
    let values = [];

    for (let i = 0; i < length; i++) {
        let sqlquery = `insert into languages_known (`;
        values = []
        values.push(id);
        for(let j=0; j< filtered_data.length; j++){
            if(j == 0){
                values.push(filtered_data[j][i]);
            }
            else{
                if(filtered_data[j].includes(language[i])){
                    values.push(true);
                    // console.log(values);
                }
                else{
                    // console.log('runiing');
                   values.push(false); 
                //    console.log(values);
                }
            }
        }
        
        sqlquery += generateQuery(fields, values);
        console.log(sqlquery);
        try {
            values = removeEmpty(values)
            let result = await promisedQuery(sqlquery, values);
            console.log(result)
        }
        catch (err) {
            console.log(err);
        }"${values[i]}"
    }
}

// ======================= inserting Technologies ===================================================//

async function insertTechnologies(formData, id){
    let promisedQuery = util.promisify(con.query).bind(con);

    const { technology, php_radio, mysql_radio, laravel_radio } = formData;
    const fields = ['applicant_id','technology', 'expertise'];
    
    const radio_data = [php_radio, mysql_radio, laravel_radio];

    for(let i=0; i<radio_data.length; i++){
        if(radio_data[i] == undefined){
            radio_data.splice(i,1);
        }
    }
    // console.log(radio_data)
    const length = technology.length;

    let values = [];

    for (let i = 0; i < length; i++) {
        let sqlquery = `insert into technologies_known (`;
        values = []
        values.push(id);
        values.push(technology[i]);
        values.push(radio_data[i]);
       
        
        sqlquery += generateQuery(fields, values);
        console.log(sqlquery);
        try {
            values = removeEmpty(values)
            let result = await promisedQuery(sqlquery, values);
            console.log(result)
        }
        catch (err) {
            console.log(err);
        }
    }

}


// ======================= inserting Referance Contact ===================================================//

async function insertReferanceContact(formData, id){
    let promisedQuery = util.promisify(con.query).bind(con);

    const { ref_names, ref_con, ref_relation } = formData;
    const fields = ['applicant_id','reference_name', 'reference_mobile_no', 'relation'];
    
    const filtered_data = filterRows([ref_names, ref_con, ref_relation]);
    const length = filtered_data[0].length;

    let values = [];

    for (let i = 0; i < length; i++) {
        let sqlquery = `insert into reference_contact (`;
        values = []
        values.push(id);
        for(let j=0; j< filtered_data.length; j++){
            values.push(filtered_data[j][i]);
        }
        
        sqlquery += generateQuery(fields, values);
        console.log(sqlquery);
        try {
            values = removeEmpty(values)
            let result = await promisedQuery(sqlquery, values);
            console.log(result)
        }
        catch (err) {
            console.log(err);
        }
    }
}


// ======================= Update Basic Details ===================================================//

async function updateBasicDetails(formData){
    let promisedQuery = util.promisify(con.query).bind(con);

    const fields = ['first_name', 'last_name', 'designation', 'zipcode' , 'address_1', 'address_2','city', 'state', 'email', 'phone_no', 'gender', 'relationship_status','date_of_birth', 'prefered_location', 'notice_period', 'department', 'expacted_ctc', 'currunt_ctc'];
    const formFields = ['first_name', 'last_name', 'designation', 'zip_code', 'address_1', 'address_2', 'city', 'state', 'email', 'phone', 'gender', 'relationship', 'dob', 'prefered_location', 'notice_period', 'department', 'expacted_ctc', 'currunt_ctc']
    let values = [];

    formFields.forEach(item => {
        if ((item == 'expacted_ctc' || item == 'notice_period' || item == 'currunt_ctc') && formData[item] != '') {
            values.push(parseInt(formData[item]))
        }
        else if(formData[item] != '')
            values.push(formData[item]);
        else    
        values.push(undefined);
    })
    

    let sqlquery = `update applicants set `;

    sqlquery += generateUpdateQuery(fields, values);
    values = removeEmpty(values);
    console.log("abcd",values)

    sqlquery += ` where applicant_id = ${formData.update_applicant_id}`
    // console.log(sqlquery);
    const result = await promisedQuery(sqlquery, values);
    
    return result.affectedRows;
}

// ======================= Update Education Details ===================================================//

async function updateEducationalDetails(formData){

    const user_id = formData.update_applicant_id;
    let promisedQuery = util.promisify(con.query).bind(con);
    let ids = formData.eduIds;
    let degree = ['SSC', 'HSC'];
    degree = degree.concat(formData.degree);
    let course = ['SSC','HSC'];
    course = course.concat(formData.course);
    let board_uni = formData.board_uni;
    let passing_year = formData.passing_year;
    let percentage = formData.percentage;
    // console.log(degree, course, board_uni, passing_year, percentage);
    let fields = ['degree', 'course', 'university_or_board','passing_year','percentage'];
    for(let i=0; i<ids.length; i++){
        let values = [];
        let sqlquery = 'update education_details set '
        if(i>2 && degree[i] == ''){
            continue;
        }
        if(i<2){
            values = [board_uni[i], passing_year[i], parseInt(percentage[i])];
            let fields2 = fields.slice(2);
            sqlquery += generateUpdateQuery(fields2, values);
        }
        else{
            values = [degree[i], course[i], board_uni[i], passing_year[i], parseInt(percentage[i])];
            sqlquery += generateUpdateQuery(fields, values);
        }
        sqlquery += ` where id = ${ids[i]}`
        values = removeEmpty(values);
        const result = await promisedQuery(sqlquery, values);
        // console.log(result);
    }
  
    if(ids.length < 4 && degree[3] != ''){
       
        let fields = ['applicant_id','degree', 'course', 'university_or_board','passing_year','percentage'];
        let values = [user_id, degree[3], course[3], board_uni[3], passing_year[3], parseInt(percentage[3])];
        let sqlquery = `insert into education_details (`
        sqlquery += generateQuery(fields, values);
        values = removeEmpty(values);
        const result = await promisedQuery(sqlquery, values);
        // console.log("insertion",result);
    }

    if(ids.length == 4 && degree[3] == ''){
        const sqlquery =  `delete from education_details where id = ${ids[3]}`;
        const result = await promisedQuery(sqlquery);
        // console.log("deletion",result);
    }
}

// ======================= Update Language Details ===================================================//


async function updateLanguageDetails(formData){

    let promisedQuery = util.promisify(con.query).bind(con);
    const user_id = formData.update_applicant_id;
   

    const deleteLanguages = `delete from languages_known where applicant_id = ${parseInt(user_id)}`;
    const delete_Languages = promisedQuery(deleteLanguages);

    const ans = insertLanguages(formData, user_id);
    console.log(ans);

}

// ======================= Update Technologies ===================================================//

async function updateTechnologyDetails(formData){

    let promisedQuery = util.promisify(con.query).bind(con);
    const user_id = formData.update_applicant_id;
  

    const deleteTechnologies = `delete from technologies_known where applicant_id = ${parseInt(user_id)}`;
    const delete_tech = await promisedQuery(deleteTechnologies);

    const ans = insertTechnologies(formData, user_id);
    console.log(ans);

}

// ======================= Update WorkExperience ===================================================//

async function updateWorkExperience(formData){
    let promisedQuery = util.promisify(con.query).bind(con);
    const user_id = formData.update_applicant_id;
  

    const deleteWorkexperience = `delete from work_experience where applicant_id = ${parseInt(user_id)}`;
    const delete_we = await promisedQuery(deleteWorkexperience);

    const ans = insertWorkexperienceDetails(formData, user_id);
    console.log(ans);
}

// ======================= Update Reference Contact ===================================================//

async function updateReferenceContacts(formData){
    let promisedQuery = util.promisify(con.query).bind(con);
    const user_id = formData.update_applicant_id;
  

    const deleteReferences = `delete from reference_contact where applicant_id = ${parseInt(user_id)}`;
    const delete_rc = await promisedQuery(deleteReferences);

    const ans = insertReferanceContact(formData, user_id);
    console.log(ans);
}

// // ======================= Function Filter Rows ===================================================//

function filterRows(data) {
    let length = data[0].length;
    
    for (let i = 0; i < length; i++) {
        let flag = true;
        for (let j = 0; j < data.length; j++) {
            if (data[j][i] == '') {
                flag = false;          
            }
        }
        if (!flag) {
            for (let j = 0; j < data.length; j++) {
                data[j].splice(i,1);
                
            }
        }
    }
   
    return data;
}

// ======================= Function Remove Empty ===================================================//

function removeEmpty(array){
    let newArray = []
    array.forEach(item => {
        if(item !==undefined && item !== ''){
            newArray.push(item);
            console.log("sdfasd",item);
        }
        else{
            console.log(item);
        }
    })
    return newArray;
}

// ======================= Function Generate Query ===================================================//

function generateQuery(fields, values) {
    var fields_part = "";
    var values_part = "";
    console.log(values);

    for (let i = 0; i < values.length; i++) {
        if (values[i] !== '') {
            fields_part += `,${fields[i]} `;
            values_part += `,? `;
            // if (typeof values[i] == 'string') {
            //     values_part += `,"${values[i]}" `;
            // }
            // else {
            //     values_part += `,? `;
            // }
        }
    }
    fields_part = fields_part.slice(1);
    values_part = values_part.slice(1);
    let sqlquery = `${fields_part} ) values ( ${values_part} );`
    // console.log("sqlqey",sqlquery);
    return sqlquery;
}


// ======================= Function Generate Update Query ===================================================//

function generateUpdateQuery(fields, values){

    const length = fields.length;
    let sqlquery = ''
    console.log(fields);
    console.log(values);
    for(let i=0; i<length; i++){

        if(values[i] != undefined){
            sqlquery += `,${fields[i]} = ? `
            // if (typeof values[i] == 'string') {
            //     sqlquery += `,${fields[i]} = "${values[i]}" `
            // }
            // else {
            //     sqlquery += `,${fields[i]} = ${values[i]} `
            // }
        }
        else{
            console.log(i,fields[i], values[i], 'is undefined');
        }
    }
    sqlquery = sqlquery.slice(1);

    return sqlquery;
}


///////////////////////////////////////////////////////

module.exports = router;