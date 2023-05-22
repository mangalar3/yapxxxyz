const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    Banner_Title:{
        type: String,
        trim: true,
    },
    Banner_Description: {
        type: String,
        trim: true
    },
    Banner_Product_Name: {
        type: String,
    },
    Product_Url: {
        type: String,
    },
    active: {
        type: String,
    },
   
}, { collection: 'bannerProducts', timestamps: true });

const Admin = mongoose.model('bannerProducts', UserSchema);

module.exports = Admin;