const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const jobSchema = new Schema({
    title: { type: String, required: true },
    desc: { type: String, required: true },
    salary: { type: Number, required: true },
    location: { type: String, required: true },
    jobType: { type: String, required: true },
    hireDuration: { type: Number, required: true },
    deadline: { type: Date, required: true },
    email: { type: String, required: true },
    qualification: { type: String, required: true },
    noOfEmployee: { type: Number, default: 1 },
    userId: { type: Schema.Types.ObjectId, ref: 'user' },
    applications: [{type: Schema.Types.ObjectId, ref: 'application', unique: true}]

}, { timestamps: true })

module.exports = mongoose.model("job", jobSchema)