const bcrypt = require('bcryptjs');
const User = require('../model/userModel'); 
const studentModel = require('../model/studentModel');
const { validationResult } = require('express-validator/check');
const assessmentCentersModel = require('../model/assessmentCentersModel');
const specializationModel = require('../model/ncModel');
const sequelize = require('../config/database');

exports.getDashboard = async(req, res, next) => {

    let count = User.findAndCountAll({attributes: ['id']});
    let student = studentModel.findAndCountAll({attributes: ['id']});

    let passed = studentModel.findAndCountAll({
        where: {
            status: 'Passed',
        }
    });
    let dropped = studentModel.findAndCountAll({
        where: {
            status: 'Dropped'
        }
    })

    
    try {

            // let specId = await specializationModel.findAll({attributes: ['id']});

            var spec = await specializationModel.findAll({attributes: ['id']}); 
            var specArr = spec;
            var obj = JSON.parse(JSON.stringify(specArr));
            // here I get the values of the obj 
            var value = Object.values(obj);

            // console.log(value);
            // here I map the value to find the id of spec
            var data = value.map((item) => {
                var specId = [item.id];
                return specId;
            })
            // console.log(data);
  
            let specializationId = data;
            var specArray =  await studentModel.findAll({were: {specializationId: specializationId}, attributes: ['nc', 'specializationId']});
            var stringifyArr = JSON.parse(JSON.stringify(specArray))
            // console.log(stringifyArr);

            var cntArr = await studentModel.findAll({
                attributes: ['nc', [sequelize.fn('COUNT', sequelize.col('nc')), 'specializationId']],
                group: 'nc',
                raw: 'true'
            })
            
            var ranked = cntArr.map((item, i) => {
                if(i > 0){
                    var prevItem = cntArr[i - 1];
                    if(prevItem.specializationId == item.specializationId){
                        item.rank = prevItem.rank
                    }
                    else{
                        item.rank = i + 1;
                    }
                }
                else{
                    item.rank = 1;
                }
                return item;
            })
            // console.log(ranked);


            var assesmentCenter = await assessmentCentersModel.findAll({attributes: ['id']});
            var assessmentCenterArr = assesmentCenter;
            var assessmentObj = JSON.parse(JSON.stringify(assessmentCenterArr));
            // here I get the values of the obj 
            var assessmentValue = Object.values(assessmentObj);

            // console.log(value);
            // here I map the value to find the id of spec
            var assessmentCenterData = assessmentValue.map((item) => {
                var specId = [item.id];
                return specId;
            })

            
            let assessmentCenterId = assessmentCenterData;
            var assessmentCenterArray =  await studentModel.findAll({were: {assessmentCenterId: assessmentCenterId}, attributes: ['school', 'assessmentCenterId']});
            var stringifyArr = JSON.parse(JSON.stringify(assessmentCenterArray))
            
            var cntAssessmentCenterArr = await studentModel.findAll({
                attributes: ['school', [sequelize.fn('COUNT', sequelize.col('school')), 'assessmentCenterId']],
                group: 'school',
                raw: 'true'
            })

            var assessCenterRanked = cntAssessmentCenterArr.map((item, i) => {
                if(i > 0){
                    var prevItem = cntAssessmentCenterArr[i - 1];
                    if(prevItem.assessmentCenterId == item.assessmentCenterId){
                        item.rank = prevItem.rank
                    }
                    else{
                        item.rank = i + 1;
                    }
                }
                else{
                    item.rank = 1;
                }
                return item;
            })

        var specRank = await ranked;
        var assesmentRank = await assessCenterRanked;

       const users = await User.findOne({
            attributes: [
                'id',
                'firstName', 
                'lastName', 
                'username', 
                'email',
                'isAdmin',
        ]})
            res.render('admin/dashboard', 
            {
                user:users,
                counts: count,
                students: student,
                drop: dropped,
                pass: passed,
                topNc: specRank,
                topSchool: assesmentRank,
                title: 'Dashboard',
                path: '/dashboard',
                active: {dashboard:true}
            })

        
         
    } catch (error) {
        console.log(error);
    }
    
};

exports.getUsers = (req, res, next) => {

    User.findAll({
        attributes: [
            'id',
            'firstName', 
            'lastName', 
            'username', 
            'email',
            'isAdmin',
    ]}).then(users => {
        res.render('admin/users', 
        {
            user:users,
            title: 'User',
            path: '/users-profile',
            active: {users:true},
            oldInput: {
                email: "",
                username: "",
                firstName: "",
                lastName: "",
                password: ""
        }
        })
        // console.log("All users:", JSON.stringify(users, null, 4));
        
      });
 
    
};

exports.postUsers = async(req, res, next) => {
 
    const errors = validationResult(req);
    let {
        firstName, 
        lastName, 
        username, 
        email,
        isAdmin,
        password
    } = req.body;

    try{

        const users = await User.findAll({
            attributes: [
                'id',
                'firstName', 
                'lastName', 
                'username', 
                'email',
                'isAdmin',
        ]})

        if(!errors.isEmpty()){
            console.log(errors.array());
            return res.status(422).render('admin/users', 
            {
                user:users,
                title: 'User',
                path: '/users-profile',
                errorMessage: errors.array()[0].msg,
                active: {users:true},
                oldInput: {email: email, username: username, password: password, firstName: firstName, lastName: lastName}
            });
        }

            if(isAdmin === true){
                isAdmin = "Admin"
                isAdmin.toString()
                return isAdmin;
            }else if(isAdmin === false){
            
                return isAdmin.toString();
            } 
                const hash = await bcrypt.hash(password, 12)
                password = hash;
                User.create(
                      {   firstName,
                          lastName,
                          username, 
                          email,
                          isAdmin,
                          password
                      });
                  res.redirect('/users-profile'); 
          
    }catch(err){
        console.log(err);
    }
};

exports.getReports = (req, res, next) => {
    res.render('admin/reports', 
    {
        path: '/reports',
        title: 'Reports',
        active:{reports: true} 
    });
};

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
      console.log(err);
      res.redirect('/');
    });
};
