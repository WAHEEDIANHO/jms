require('dotenv').config();

module.exports = {
    MONGO_URL: process.env.MONGO_URL,
    MONG0_DEV: process.env.MONG0_DEV,
    SECRET_KEY: process.env.SECRET_KEY
}