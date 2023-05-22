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



module.exports = {
    homeShow,
}