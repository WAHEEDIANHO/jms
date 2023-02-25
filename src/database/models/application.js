const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const appSchema = new Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    othername: { type: String },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    qualification: { type: String, required: true },
    address: { type: String, required: true }
}, { timestamps: true })

module.exports = mongoose.model('application', appSchema)