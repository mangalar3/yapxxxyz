const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    Category_Name:{
        type: String,
        trim: true,
    },
    Category_Name2:{
        type: String,
        trim: true,
    },
    Category_Name3:{
        type: String,
        trim: true,
    },
    Brands: {
        type: Array,
        trim: true
    },

}, { collection: 'Markalar', timestamps: true });

const Admin = mongoose.model('Markalar', UserSchema);

module.exports = Admin;