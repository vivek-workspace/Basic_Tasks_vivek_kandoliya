


const inpText = document.getElementsByClassName('inptext');
const inpSelect = document.getElementsByClassName('inpselect');
const inpRadio = document.getElementsByClassName('inpradio');
const inpCheckbox = document.getElementsByClassName('inpcheckbox');


function disableCheckBox() {

    const abilityCheck = document.querySelectorAll('.abltcheck');
    abilityCheck.forEach(item => {
        item.disabled = true;
    })
}

disableCheckBox();

function addEducationRow(id) {

    let table_ele = document.querySelector('#educationDetails').lastElementChild;
    let count = table_ele.childElementCount
    console.log(count)
    let next = parseInt(count / 2);
    ++next;

    const headRow = document.createElement('tr');
    const headTd = document.createElement('td');
    const headInp = document.createElement('input');
    headInp.name = 'degree[]';
    headInp.classList.add('inptext', 'inp', `degree${next}`);
    headInp.placeholder = `enter degree ${next}`;
    headTd.appendChild(headInp);
    headRow.appendChild(headTd);
    table_ele.appendChild(headRow);

    const bodyRow = document.createElement('tr');
    const label1Td = document.createElement('td');
    label1Td.innerText = 'Course : '
    label1Td.colspan = '1'
    const label2Td = document.createElement('td');
    label2Td.innerText = 'University : '
    label2Td.colspan = '1'
    const label3Td = document.createElement('td');
    label3Td.innerText = 'Passing Year : '
    const label4Td = document.createElement('td');
    label4Td.innerText = 'Percentage : '
    const inp1Td = document.createElement('td');
    const inp1 = document.createElement('input');
    inp1.classList.add('inptext', 'inp', `degree${next}`);
    inp1.name = 'course[]';
    inp1Td.appendChild(inp1);
    const inp2Td = inp1Td.cloneNode(true);
    const inp2 = inp2Td.lastElementChild;
    inp2.name = 'board_uni[]';
    const inp3Td = inp1Td.cloneNode(true);
    const inp3 = inp3Td.lastElementChild;
    inp3.name = 'passing_year[]';
    inp3.classList.add('year');
    const inp4Td = inp1Td.cloneNode(true);
    const inp4 = inp4Td.lastElementChild;
    inp4.name = 'percentage[]';
    inp4.classList.add('percent');

    bodyRow.append(label1Td, inp1Td, label2Td, inp2Td, label3Td, inp3Td, label4Td, inp4Td);
    table_ele.appendChild(bodyRow);

    const allInp = document.querySelectorAll(`.degree${next}`);
    fieldGroups.push(allInp);

}

function removeEducationRow() {
    let table_ele = document.querySelector('#educationDetails').lastElementChild;
    let count = table_ele.childElementCount
    console.log(count);
    if (count / 2 > 2) {
        const ele = table_ele.lastElementChild;
        ele.remove();
        const ele2 = table_ele.lastElementChild;
        ele2.remove();
    } else {
        alert('can not remove SSC');
    }
}


function toggleSubButtons(subgroupName) {
    const Subgroup = document.querySelectorAll(`.${subgroupName}`);

    Subgroup.forEach(item => {
        if (item.disabled) {

            item.disabled = false;
        }
        else {
            item.checked = false;
            item.disabled = true;
        }
    })

}

function validateForm() {

    flag = true;
    let alertContent = [];

    setMendetory();

    const allFilled = checkAllFields(alertContent, inpText);
    if (!allFilled) flag = false;

    const isValidZip = valdiateZipcode(alertContent);
    if (!isValidZip) flag = false;

    const isValidEmail = valdiateEmail(alertContent);
    if (!isValidEmail) flag = false;

    const isValidPhoneNo = valdiatePhoneNo(alertContent);
    if (!isValidPhoneNo) flag = false;

    const isGenderChecked = validateGender(alertContent);
    if (!isGenderChecked) flag = false;

    const isValidDate = valdiateDate(alertContent);
    if (!isValidDate) flag = false;

    const isValidYear = validateYear(alertContent);
    if (!isValidYear) flag = false;

    const isValidPercentage = validatePercentage(alertContent);
    if (!isValidPercentage) flag = false;

    const isValidNumber = validateNumber(alertContent);
    if (!isValidNumber) flag = false;

    if (!flag) {
        alert(alertContent);
    }

    return flag;
}

function isMendetory(array) {
    let flag = false;
    array.classList.forEach(element => {
        if (element == 'mendetory') {
            flag = true;
        }
    });
    return flag;
}

const masterElements = document.querySelectorAll('.master');
const compny1Elements = document.querySelectorAll('.company1');
const compny2Elements = document.querySelectorAll('.company2');
const compny3Elements = document.querySelectorAll('.company3');
const reference1Elements = document.querySelectorAll('.reference1');
const reference2Elements = document.querySelectorAll('.reference2');
let fieldGroups = [masterElements, compny1Elements, compny2Elements, compny3Elements, reference1Elements, reference2Elements];

function setMendetory() {

    fieldGroups.forEach(item => {
        checkIfAnyAndSet(item);
    })

}

function checkIfAnyAndSet(item) {
    let mendetory = false;
    item.forEach(field => {
        if (field.value != '') {
            mendetory = true;
        }
    })

    if (mendetory) {
        item.forEach(field => {
            field.classList.add('mendetory')
        })
    }
    else {
        item.forEach(field => {
            field.classList.remove('mendetory');
        })
    }
}

function checkAllFields(alertContent, inpText) {

    let flag = true;
    for (let i = 0; i < inpText.length; i++) {
        if (inpText[i].value.trim() == '' && isMendetory(inpText[i])) {
            flag = false;
            inpText[i].style.border = '2px solid red'
        }
        else {
            inpText[i].style.border = 'none'
        }
    }
    if (!flag) {
        alertContent.push(' Hilighted Fields can not be Empty ');
    }
    return flag;
}

function valdiateZipcode(alertContent) {
    let flag = true;

    const zip_code = document.getElementById('zip_code');
    if (zip_code.value != '' && (zip_code.value.length != 6 || isNaN(zip_code.value))) {
        flag = false;
        zip_code.style.border = '2px solid red'
        alertContent.push(' Invalid Zip Code ');
    }
    else if (zip_code.value != '') {
        zip_code.style.border = 'none'
    }

    return flag;
}

function valdiateEmail(alertContent) {
    let flag = true;

    const emailField = document.getElementById('email');
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (emailField.value != '' && !emailRegex.test(emailField.value)) {
        flag = false;
        emailField.style.border = '2px solid red'
        alertContent.push(' Invalid Email ');
    }
    else if (email.value != '') {
        emailField.style.border = 'none'
    }

    return flag;
}

function valdiatePhoneNo(alertContent) {
    let flag = true;

    const phonenoFields = document.querySelectorAll('.phone');
    phonenoFields.forEach(item => {
        if (item.value != '' && (item.value.length != 10 || isNaN(item.value))) {
            flag = false;
            alertContent.push(` Invalid Phone No at ${item.name}`);
            item.style.border = '2px solid red'
        }
        else if (item.value != '') {
            item.style.border = 'none'
        }
    })

    return flag;
}


function validateGender(alertContent) {

    let flag = false;
    const genderRadio = document.getElementsByName('gender');

    genderRadio.forEach(item => {
        if (item.checked) {
            flag = true;
        }
    })

    if (!flag) {
        alertContent.push(' Select Gender ');
        genderRadio.forEach(item => { item.parentNode.style.border = '2px solid red' })
    }
    else {
        genderRadio.forEach(item => { item.parentNode.style.border = 'none' })
    }
    return flag;
}

function valdiateDate(alertContent) {
    let flag = true;
    const dateFields = document.querySelectorAll('.datefield');

    const dateRegExp = /^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/;
    dateFields.forEach(item => {
        if (item.value != '' && !dateRegExp.test(item.value)) {
            flag = false;
            alertContent.push(' Invalid Date ');
            item.style.border = '2px solid red';
        }
        else if (!isMendetory(item)) {
            item.style.border = 'none';
        }
    })

    return flag;
}

function validateYear(alertContent) {
    let flag = true;

    const yearFields = document.querySelectorAll('.year');

    yearFields.forEach(item => {
        if (item.value != '' && isNaN(item)) {
            flag = false;
            alertContent.push(' Invalid Year ');
            item.style.border = '2px solid red';
        }
        else if (!isMendetory(item)) {
            item.style.border = 'none';
        }
    })

    return flag;
}

function validateYear(alertContent) {
    let flag = true;

    const yearFields = document.querySelectorAll('.year');

    yearFields.forEach(item => {
        if (item.value != '' && isNaN(item.value)) {
            flag = false;
            alertContent.push(' Invalid Year ');
            item.style.border = '2px solid red';
        }
        else if (!isMendetory(item)) {
            item.style.border = 'none';
        }
    })

    return flag;
}

function validatePercentage(alertContent) {
    let flag = true;

    const percentageFields = document.querySelectorAll('.percent');

    percentageFields.forEach(item => {

        if ((item.value != '' && isNaN(item.value)) || item.value > 100 || item.value < 0) {
            flag = false;
            alertContent.push(' Invalid Percentage ');
            item.style.border = '2px solid red';
        }
        else if (!isMendetory(item)) {
            item.style.border = 'none';
        }
    })

    return flag;
}

function validateNumber(alertContent) {
    let flag = true;

    const NumberFields = document.querySelectorAll('.number');

    NumberFields.forEach(item => {
        if (item.value != '' && isNaN(item.value)) {
            flag = false;
            alertContent.push(`${item.name} must be a Number`);
            item.style.border = '2px solid red';
        }
        else if (!isMendetory(item)) {
            item.style.border = 'none';
        }
    })

    return flag;
}



// ================================= update form script =======================================//



const userStr = document.getElementById('dataTxt').value;

if (userStr.value == 'false') {
    console.log('fresh');
}
else {
    const user = JSON.parse(userStr);
    const basic_keys = Object.keys(user);
    const education_data = JSON.parse(document.getElementById('eduText').value);
    const language_data = JSON.parse(document.getElementById('lanText').value);
    const technology_data = JSON.parse(document.getElementById('techText').value);
    const work_experience =  JSON.parse(document.getElementById('weText').value);
    const reference_contact =  JSON.parse(document.getElementById('clText').value);
 
    const user_id = document.createElement('input');
    user_id.style.display = 'none';
    user_id.name = 'update_applicant_id';
    user_id.value = user['applicant_id'];
    document.getElementById('form').appendChild(user_id);

    let basic_fields = [];

    basic_fields.push(document.getElementById('first_name'));
    basic_fields.push(document.getElementById('last_name'));
    basic_fields.push(document.getElementById('designation'));
    basic_fields.push(document.getElementById('email'));
    basic_fields.push(document.getElementById('phone'));
    basic_fields.push(document.getElementById('male'));
    basic_fields.push(document.getElementById('female'));
    basic_fields.push(document.getElementById('address_1'));
    basic_fields.push(document.getElementById('address_2'));
    basic_fields.push(document.getElementById('city'));
    basic_fields.push(document.getElementById('state'));
    basic_fields.push(document.getElementById('zip_code'));
    basic_fields.push(document.getElementById('dob'));
    basic_fields.push(document.getElementById('relationship'));
    basic_fields.push(document.getElementById('prefered_location'));
    basic_fields.push(document.getElementById('notice_period'));
    basic_fields.push(document.getElementById('expacted_ctc'));
    basic_fields.push(document.getElementById('currunt_ctc'));
    basic_fields.push(document.getElementById('department'));

    let edu_fields = [];

    edu_fields.push(document.getElementById('ssc_board'));
    edu_fields.push(document.getElementById('ssc_year'));
    edu_fields.push(document.getElementById('ssc_percent'));
    edu_fields.push(document.getElementById('hsc_board'));
    edu_fields.push(document.getElementById('hsc_year'));
    edu_fields.push(document.getElementById('hsc_percent'));
    edu_fields.push(document.getElementById('degree1'));
    edu_fields.push(document.getElementById('bachelor_course'));
    edu_fields.push(document.getElementById('bachelor_uni'));
    edu_fields.push(document.getElementById('bachelor_year'));
    edu_fields.push(document.getElementById('bachelor_percent'));
    edu_fields.push(document.getElementById('degree2'));
    edu_fields.push(document.getElementById('master_course'));
    edu_fields.push(document.getElementById('master_uni'));
    edu_fields.push(document.getElementById('master_year'));
    edu_fields.push(document.getElementById('master_percent'));


    let wefields = [];

    wefields.push(document.getElementById('company1'));
    wefields.push(document.getElementById('designation1'));
    wefields.push(document.getElementById('from1'));
    wefields.push(document.getElementById('to1'));
    wefields.push(document.getElementById('company2'));
    wefields.push(document.getElementById('designation2'));
    wefields.push(document.getElementById('from2'));
    wefields.push(document.getElementById('to2'));
    wefields.push(document.getElementById('company3'));
    wefields.push(document.getElementById('designation3'));
    wefields.push(document.getElementById('from3'));
    wefields.push(document.getElementById('to3'));

    let ref_fields = [];

    ref_fields.push(document.getElementById('ref_name1'));
    ref_fields.push(document.getElementById('ref_con1'));
    ref_fields.push(document.getElementById('ref_relation_1'));
    ref_fields.push(document.getElementById('ref_name2'));
    ref_fields.push(document.getElementById('ref_con2'));
    ref_fields.push(document.getElementById('ref_relation_2'));


    // lan_fields.push(document.getElementById('hindi'));
    // lan_fields.push(document.getElementById('h_read'));
    // lan_fields.push(document.getElementById('h_write'));
    // lan_fields.push(document.getElementById('h_speak'));
    // lan_fields.push(document.getElementById('english'));
    // lan_fields.push(document.getElementById('e_read'));
    // lan_fields.push(document.getElementById('e_write'));
    // lan_fields.push(document.getElementById('e_speak'));
    // lan_fields.push(document.getElementById('gujarati'));
    // lan_fields.push(document.getElementById('g_read'));
    // lan_fields.push(document.getElementById('g_write'));
    // lan_fields.push(document.getElementById('g_speak'));
    



    mapFieldValues(basic_fields, user, basic_keys);


    let i = 0
    education_data.forEach(degree => {

        const edu_keys = Object.keys(degree);
        edu_keys.forEach(item => {
            if (edu_keys.indexOf(item) == 0) {
                const id = document.createElement('input');
                id.name = 'eduIds[]';
                id.value = degree[item];
                id.hidden = true;
                document.getElementById('educationDetails').appendChild(id);
            }
            else {
                if (i < 6) {
                    if (item == 'degree' || item == 'course') { }
                    else {
                        edu_fields[i].value = degree[item];
                        i++;
                    }
                }
                else {
                    edu_fields[i].value = degree[item];
                    i++;
                }
            }
        })
    })

    const hindicheck = document.getElementById('hindi');
    const englishcheck = document.getElementById('english');
    const gujaraticheck = document.getElementById('gujarati');
    setCheckFor(hindicheck, language_data);
    setCheckFor(englishcheck, language_data);
    setCheckFor(gujaraticheck, language_data);

    const phpradios = document.getElementById('php');
    const mysqlradios = document.getElementById('mysql');
    const laravelradios = document.getElementById('laravel');
    setRadioFor(phpradios, technology_data);
    setRadioFor(mysqlradios, technology_data);
    setRadioFor(laravelradios, technology_data);

    let k=0;
    // console.log(work_experience)
    work_experience.forEach(item => {
        console.log(Object.keys(item));
        mapFieldValues(wefields.slice(k, k+4), item, Object.keys(item));
        k+=5;
    })   
    
    k=0;
    console.log(reference_contact)
    reference_contact.forEach(item => {
        console.log(Object.keys(item));
        console.log(ref_fields)
        mapFieldValues(ref_fields.slice(k, k+3), item, Object.keys(item));
        k+=4;
    })   

    // i = 0;

    // language_data.forEach(language => {
    //     const lan_keys = Object.keys(language);
    //     console.log(language)
    //     let active = false;
    //     lan_keys.forEach(item => {
    //         console.log('key:',item)
    //        if(lan_keys.indexOf(item) == 0){
    //         console.log(lan_keys.indexOf(item))
    //         console.log(lan_fields[i].id,language[item])
    //         if(lan_fields[i].value == language[item]){
    //             lan_fields[i].checked = true;
    //             active= true;
    //         }
    //         i++;
    //        }
    //        else if(active){
    //         lan_fields[i].disabled = false;
    //          if(language[item] == 1){
    //             lan_fields[i].checked = true;
    //          }
    //          i++;
    //        }

    //     })
    // })
}

function setCheckFor(ele, language_data) {
    let value = ele.value;
   
    for (let i = 0; i < language_data.length; i++) {
        if (language_data[i].language == value) {
            ele.disabled = false;
            ele.checked = true;

            const ele_read = document.getElementById(`${ele.value}_read`);
            const ele_write = document.getElementById(`${ele.value}_write`);
            const ele_speak = document.getElementById(`${ele.value}_speak`);

            ele_read.disabled = false;
            ele_write.disabled = false;
            ele_speak.disabled = false;

            if (language_data[i].lread == 1)
                ele_read.checked = true;

            if (language_data[i].lwrite == 1)
                ele_write.checked = true;

            if (language_data[i].speak == 1)
                ele_speak.checked = true;
        }
    }
}

function setRadioFor(ele, technology_data){
    
    let value = ele.value;
    for (let i = 0; i < technology_data.length; i++) {
       
        if (technology_data[i].technology == value) {
            ele.disabled = false;
            ele.checked = true;

            const radios = document.getElementsByName(`${value}_radio`);

            radios.forEach(item => {
                item.disabled = false;
                if(item.value == technology_data[i].expertise)
                    item.checked = true;
            })
        }
    }

}

function mapFieldValues(fields, data, keys) {
    let i = 1;
    fields.forEach(item => {
        if ((item.type == 'text' || item.tagName == 'SELECT') && data[keys[i]] !== null) {
            //console.log('main',item.id, data[keys[i]])
            item.value = data[keys[i]];
        }
        else if (item.type === 'radio' && data[keys[i]] !== null) {
            //console.log('entered',item.type, data[keys[i]])
            if (data[keys[i]] == item.value)
                item.checked = true;
            else
                i--;
        }
        else if (item.type != 'radio') {
            //console.log('not radio',item.tagName, data[keys[i]])
            item.value = '';
        }

        i++;
    })
}

