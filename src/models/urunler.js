const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    product_id: {
        type: String,
        trim: true
    },
    product_id2: {
        type: String,
        trim: true
    },
    product_url: {
        type: String,
        trim: true
    },
    product_name:{
        type: String,
        trim: true,
        text: true
    },
    product_marka:{
        type: String,
        trim: true,
        text: true
    },
    product_ozellik: {
        type: String,
        trim: true
    },
    product_category: {
        type: String,
        trim: true
    },
    product_description: {
        type: String,
        trim: true
    },
    stock_alert: {
        type: String,
        trim: true
    },
    urun_oysayisi:{
        type: Number,
    },
    urun_yorum: {
        type: Array,
        trim: true
    },
    product_details1: {
        type:String
    },
    product_details1foto: {
        type:String
    },
    product_details2: {
        type:String
    },
    product_details2foto: {
        type:String
    },
    product_details3: {
        type:String
    },
    product_details4: {
        type:String
    },
    product_photo: {
        type:Array,
        trim: true
    },
    banner:{
        type:Number
    },
    banneryazi:{
        type:String
    },
    bannerustyazi:{
        type:String
    },
    bannerfoto:{
        type:String
    },
    product_star: {
        type:Array
    },
    avarage: {
        type:String
    },
    product_category2: {
        type:String
    },
    Product_MinimumPrice:{
        type:Number
    },
    product_category3: {
        type:String
    },
    product_seller: {
        type:Array
    },
    urunuekleyen:{
        type:String,
    },
    tiklanmasayisi:{
        type:Number,
    },
    active: {
        type:String
    }
   
}, { collection: 'urunler',locale: 'tr', timestamps: true });

const Admin = mongoose.model('urunler', UserSchema);

module.exports = Admin;