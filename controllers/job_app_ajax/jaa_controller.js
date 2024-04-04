/*
Program: job application ajax controller
Description: this module main controller for task:job application ajax
Called-by: job_app_ajax.js
@uther: Vivek Kandoliya
*/


// =====  Importing Lcoal Modules =====
const con = require('../../db');
const { insertBasicDetails, insertEducationalDetails, insertWorkexperienceDetails, insertLanguages, insertTechnologies, insertReferanceContact, updateBasicDetails, updateEducationalDetails, updateLanguageDetails, updateTechnologyDetails, updateWorkExperience, updateReferenceContacts } = require('../common/common');

// ===== Setting Variables  =====
const util = require("util")


//Function list: returns appliation list
const list = async (req, res) => {
  let promisedQuery = util.promisify(con.query).bind(con);
  const sqlquery = 'select applicant_id, first_name, last_name from applicants;'

  const result= await promisedQuery(sqlquery);
  console.log(result);
  res.render('jwt_app_ajax/pages/list', {result, length: result.length});

}

//Function form_page = renders form page for both update and fresh form operations
const form_page = async (req, res) => {

  try{
    let promisedQuery = util.promisify(con.query).bind(con);

    const sqlquery = `select select_master.select_key, select_master.select_value, select_master.combo_type, option_master.option_key, option_master.option_value from select_master join option_master on select_master.select_key = option_master.select_key;`
    let result = await promisedQuery(sqlquery);
    if(isNaN(req.query.id)){
        res.render('jwt_app_ajax/pages/jaf_basic', { result: result, update: false, user:  [false]})
    }
    else{
        res.render('jwt_app_ajax/pages/jaf_basic', { result: result, update: true, user: [true],});
    }
  
  }
  catch(error){
    console.log('touched : controller/job_app_ajax -> form_page')
        console.log(error);
        res.render('error_page');
  }
}

//Function submit : handles submit form job app form
const submit = async (req, res) => {
    
  const formData = req.body;
  console.log(formData)
  const id = await insertBasicDetails(formData);
  await insertEducationalDetails(formData, id);
  await insertWorkexperienceDetails(formData, id);
  await insertReferanceContact(formData, id);
  await insertLanguages(formData, id);
  await insertTechnologies(formData, id)
  
  res.json({ id });
  // res.send('ok')
}


//Function get_user : returns all details of the user
const get_user = async (req, res) => {
  let promisedQuery = util.promisify(con.query).bind(con);
  
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
  
  const userData = {
      basic: fetchUsr,
      edication: fetchEdu,
      language: fetchLan,
      technology: fetchTech,
      workexperience: fetchWE,
      referencecontact: fetchRC
  }
  
  res.json(userData);
}

//Function update : updates user details in the db.
const update_user = async (req, res) => {
    
  const formData = req.body;
  console.log(formData)
  
  const id = await updateBasicDetails(formData);
  await updateEducationalDetails(formData);
  await updateLanguageDetails(formData);
  await updateTechnologyDetails(formData);
  await updateWorkExperience(formData, id);
  await updateReferenceContacts(formData, id)
  
  res.status(200).send('updated');
}


module.exports = {list, form_page, submit, get_user, update_user}