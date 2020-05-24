const express = require('express');
const defaultController = require('../controller/defaultController');
const { check } = require('express-validator/check');
const router = express.Router();

router.get('/', defaultController.getLogin);
router.post('/login', 
[
    check('email').isEmail().withMessage('Please enter your email address'),
    check('password','Enter password with 5 or more characters').not().isEmpty()
]
,defaultController.postLogin);

router.get('/reset-password', defaultController.getResetPass)
.post('/reset-password', defaultController.postResetPass);

router.get('/reset-password/:token', defaultController.getNewPassword);
router.post('/new-password', defaultController.postNewPassword);
module.exports = router;