const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');



// GET

const homeShow = async (req, res, next) => {
    try {

        res.render('user/homePage', { layout: '../layouts/mainSecond_Layout', title: `IG Priv`, description: ``, keywords: `` })


    } catch (err) {
        console.log(err);
    }
};

const loginPageShow = async (req, res, next) => {
    try {

        res.render('user/loginPage', { layout: '../layouts/mainHome_Layout', title: `Login | Instagram`, description: ``, keywords: `` })


    } catch (err) {
        console.log(err);
    }
};



// POST

const loginUser = async (req, res, next) => {
  
    var gelenUsername = req.body.iUsername;
    var gelenSifre = req.body.iPassword

};



module.exports = {
    homeShow,
    loginPageShow,
    loginUser
}