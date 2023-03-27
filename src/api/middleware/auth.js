const passport = require('passport');
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require('passport-jwt').Strategy; //authenticating RESTful endpoint without session
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require("jsonwebtoken");

const {UserModel} = require("../../database/models");
const { SECRET_KEY } = require('../../config');

exports.local = passport.use(new LocalStrategy(UserModel.authenticate()));
passport.serializeUser(UserModel.serializeUser());
passport.deserializeUser(UserModel.deserializeUser())

exports.getToken = (payload) => {
    return jwt.sign(payload, SECRET_KEY, {expiresIn: 3600});
}

exports.getUserId = (token) => {
    return jwt.verify(token, SECRET_KEY);
};

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET_KEY;

exports.jwtPassport = passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
    UserModel.findById(jwt_payload._id, (err, user) => {
        if(err) return done(err, false);
        if(user) return done(null, user);
        else  return done(null, false)
    })
}))

exports.verifyUser = passport.authenticate('jwt', {session: false});

exports.verifyAdmin = (req, res, next) => {
    if (req.user.admin) {
        next();
    } else {
        res.status(401).send("Unauthorized access")
    }
};

exports.verifyEmployee = (req, res, next) => {
    if (req.user.role === "employee" || req.user.admin) {
        next();
    } else {
        res.status(401).send("Unauthorized access")
    }
};
