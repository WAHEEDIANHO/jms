const express = require('express');
const passport = require("passport")
const UserService = require('../service/user-service')
const {BadRequestError} = require("../utils/app-errors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const {UserModel} = require("../database/models");
const authenticate = require('./middleware/auth')


const userRouter = () => {

    const router = express.Router();
    const service = new UserService();

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, "uploads");
        },
        filename: function (req, file, cb) {
            cb(
                null,
                file.fieldname + "-" + Date.now() + path.extname(file.originalname)
            );
        },
    });

    const upload = multer({
        storage: storage,
        fileFilter: function fileFilter(req, file, cb) {
            const mimetypes = /image\/png|image\/jpeg|imagesvg\+xml|image\/gif|image\/svg\+xml/;
            // console.log(file.mimetype);
            if (!mimetypes.test(file.mimetype)) cb(null, false);
            else cb(null, true);
        },
        // limits: { fileSize: 4000 },
    }).single("file");

    router.get('/', async function(req, res, next) {
        try {
            const users = await service.getUsers()
            res.status(200).json(users)
        }catch (e) {
            throw new BadRequestError(e.message, e)
        }
    })

    router.post('/signup', async (req, res, next) => {
        upload(req, res, function (err) {
            if (err instanceof multer.MulterError) {
                return res.status(500).json({ err: err.message, sucess: false });
            } else if (err) {
                console.log(err);
                return res.status(500).json({ err: err.message, sucess: false });
            }
            // Handling data after image upload
            console.log(req.file);
            if (req.file !== undefined) {
                req.body.imageUrl = `uploads/${req?.file?.filename}`;
                req.body.username = req.body.email;
                // req.body.password = "12345678";
                UserModel.register(
                    new UserModel({ ...req.body }),
                    req.body.password,
                    (err, user) => {
                        if (err) {
                            res.statusCode = 500;
                            // res.setHeader("Content-type", "application/json");
                            console.log(err);
                            fs.unlinkSync(`${__dirname}/../uploads/${req.file.filename}`);
                            return res.json({ err: err });
                        } else {
                            passport.authenticate("local")(req, res, () => {
                                console.log("from here");
                                res.statusCode = 200;
                                res.setHeader("Content-type", "application/json");
                                return res.json({ success: true, status: "reg successful" });
                            });
                        }
                    }
                );
            } else {
                // const err = new Error("Bad file type");
                res.status(400).json({ err: "Bad file", success: false });
            }
        });



        // try {
        //     console.log(req)
        //     req.body.username = req.body.email
        //     const { data } = await service.signUp(req.body)
        //     res.status(200).json(data)
        // }catch (e) { next(e) }
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
            status: "You are successfully loged in",
        });
    })

    router.get('/:id', async (req, res, next) => {
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