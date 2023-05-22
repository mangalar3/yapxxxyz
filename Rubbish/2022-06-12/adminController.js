const mongoose = require('mongoose');

const fs = require('fs');


// GET

const showHomePage = async (req, res, next) => {

    try {


        res.render('admin/homePage', { layout: '../layouts/adminHome_Layout', title: `Admin | TwitterJS`, description: ``, keywords: `` })


    } catch (err) {
        console.log(err);
    }
};

module.exports = {
    showHomePage,
  
}