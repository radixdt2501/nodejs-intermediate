const mongoose = require('mongoose');
const Joi = require('joi');

const userSchema = new mongoose.Schema({
    email: Joi.string().email().required(),
    phoneNum: Joi.string().regex(/^\d{3}-\d{3}-\d{4}$/).required(),
    userName: {
        type: String,
        required: true,
    },
    userId: {
        type: Number,
        required: false,
    },
    token: { 
        type: String ,
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('user', userSchema);