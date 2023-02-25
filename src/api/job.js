const express = require('express');
const { body, validationResult } = require('express-validator');

const JobService = require('../service/job-service')
const { verifyUser, isEmployee} = require('./middleware/auth')
const { initiateError } = require("../utils");
const { STATUS_CODES } = require("../utils/app-errors");


const jobRouter = () => {

    const router = express.Router();
    const service =new JobService();

    router.route('/')
        .get(async (req, res, next) => {
            // console.log(req.query)
            const { data } = await service.getJob(req.query);
            return res.status(200).json(data)
        })

        .post(verifyUser,
            [
                body(['title', 'desc', 'salary', 'location',
                'jobType', 'hireDuration', 'deadline', 'qualification', 'noOfEmployee'], 'Enter valid data into each field').trim().notEmpty(),
                body('email', 'Enter a valid email address').isEmail(),
                body(['salary', 'hireDuration', 'noOfEmployee']).isNumeric().custom((val, {req}) => {
                    if(val <= 0) throw new Error("Negative value not accepted")
                    return true
                })
            ],
            async (req, res, next) => {

            try {

                const err = validationResult(req);
                if(!err.isEmpty()) initiateError(STATUS_CODES.BAD_REQUEST, err.array().map(item => item.param))

                req.body.userId = req.user._id.toString();
                const { body } = req;
                console.log(body)
                const { data } = await service.createJob(body);
                res.status(200).json(data)
            } catch (e) { next(e) }
        }
        )

    router.route('/:id')
        .get( async (req, res, next) => {
            try {
                const  data  = await service.getJobById(req.params.id);
                res.status(200).json(data);
            } catch (e) { next(e) }
        })

        .put(verifyUser, async (req, res, next) => {
            try {
                const { data } = await service.updateJob({userId: req.user._id.toString(), jobId: req.params.id, update: req.body });
                res.status(200).json(data);
            }catch (e) {
                next(e)
            }
        })

        .delete(verifyUser, async (req, res, next) => {
            try {
                const  { data } = await service.deleteJob({userId: req.user._id.toString(), jobId: req.params.id}) || {};
                return res.status(200).json(data)
            }catch (e) {
                next(e)
            }
        })

    router.route('/apply')
        .post(verifyUser,
                [
                body(['firstname', 'lastname', 'email', 'phone',
                    'qualification', 'address', 'jobId'], 'Enter valid data into each field').trim().notEmpty(),
                body('email', 'Enter a valid email address').isEmail(),
            ],
                async (req, res, next) => {
                    try {

                        const err = validationResult(req);
                        if(!err.isEmpty()) initiateError(STATUS_CODES.BAD_REQUEST, err.array().map(item => item.param))

                        const { body } = req;
                        console.log(body)
                        const { data } = await service.applyJob(body, body.jobId);
                        res.status(200).json(data)
                    } catch (e) { next(e) }
            }
        )
    // .get()



    return router
}

module.exports = jobRouter