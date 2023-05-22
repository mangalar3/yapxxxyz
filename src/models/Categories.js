const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    product_category3:{
        type: Array,
        trim: true,
    },
    product_category2: {
        type: String,
        trim: true
    },
    product_category: {
        type: String,
    },
   
}, { collection: 'categories', timestamps: true });

const Admin = mongoose.model('categories', UserSchema);

module.exports = Admin;