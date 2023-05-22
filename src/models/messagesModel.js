const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    Message_ID:{
        type: String,
        trim: true,
    },
    Message_Content: {
        type: Array,
        trim: true
    },
    Message_Creater: {
        type: String,
        trim: true
    },
    Message_Receiver: {
        type: String,
        trim: true
    },
    Last_Sender: {
        type: String,
    },
    is_Opened: {
        type: String
    }
}, { collection: 'messages', timestamps: true });

const Admin = mongoose.model('messages', UserSchema);

module.exports = Admin;