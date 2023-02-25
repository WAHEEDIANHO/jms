const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose')


const userSchema = new Schema({
    sname: { type: String, required: true },
    othername: { type: String, required: true },
    role: { type: String, required: true },
    phone: { type: String, required: true, min: 0 },
    address: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    nationality: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    dob: { type: Date, required: true },
    imageUrl: { type: String, required: true },
    gender: { type: String, required: true },
    admin: { type: Boolean, default: false },
}, { timestamps: true });

userSchema.plugin(passportLocalMongoose)
module.exports = mongoose.model('user', userSchema)
