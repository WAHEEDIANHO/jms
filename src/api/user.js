const express = require('express');
const passport = require("passport")
const UserService = require('../service/user-service')
const {BadRequestError} = require("../utils/app-errors");
const {UserModel} = require("../database/models");
const authenticate = require('./middleware/auth')
const {verifyUser, verifyAdmin} = require("./middleware/auth");


const userRouter = () => {

    const router = express.Router();
    const service = new UserService();



    router.get( '/', verifyUser, verifyAdmin, async function(req, res, next) {
        try {
            const users = await service.getUsers()
            res.status(200).json(users)
        }catch (e) {
            throw new BadRequestError(e.message, e)
        }
    })

    router.post('/signup', async (req, res, next) => {


                // UserModel.register(
                //     new UserModel({ ...req.body }),
                //     req.body.password,
                //     (err, user) => {
                //         if (err) {
                //             res.statusCode = 500;
                //             // res.setHeader("Content-type", "application/json");
                //             console.log(err);
                //             return res.json({ err: err });
                //         } else {
                //             passport.authenticate("local")(req, res, () => {
                //                 console.log("from here");
                //                 res.statusCode = 200;
                //                 res.setHeader("Content-type", "application/json");
                //                 return res.json({ success: true, status: "reg successful" });
                //             });
                //         }
                //     }
                // );
        try {
            req.body.email = req.body.username,
            req.body.password = "12345"
            const { data } = await service.signUp(req.body)
            res.status(200).json(data)
        }catch (e) { next(e) }
    })

    router.post('/login', passport.authenticate("local", {session: false}), (req, res) => {
        const token = authenticate.getToken({ _id: req.user._id });
        console.log(authenticate.getUserId(token));
        res.statusCode = 200;
        res.setHeader("Content-type", "application/json");
        res.json({
            success: true,
            token: token,
            _id: req.user._id,
            role: req.user.role,
            status: "You are successfully loged in",
        });
    })

    router.get('/:id', verifyUser, async (req, res, next) => {
        const { id } = req.params;
        console.log(id);
        try {
            const { data } = await service.getUserById(id)
            console.log(data)
            res.status(200).json(data);
        } catch (e) { next(e) }
    })

    return router
}

module.exports = userRouter