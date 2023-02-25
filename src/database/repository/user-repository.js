const { UserModel } = require("../models");
const { APIError, STATUS_CODES} = require('../../utils/app-errors')

class UserRepository{
    async CreateUser(userData) {
        const { username, password } = userData;
        try {
            const newUser = new UserModel(userData);
            await newUser.setPassword(password);
            await newUser.save(); // user created

            const { user } = await UserModel.authenticate()(username, password);
            console.log(user);
            return user;

        }catch (e) {
            console.log(e)
            throw new APIError('API ERROR', STATUS_CODES.INTERNAL_ERROR, "user already exist")
        }
    }

    async findAllUsers() {
        try {
            const users = await UserModel.find({})
            console.log(users)
            return users
        }catch (e) {
            throw APIError('API Error', STATUS_CODES.INTERNAL_ERROR, 'Unable to Find Customers')
        }
    }

    async FindUser({ username }){
        try{
            const existingUser = await UserModel.findOne({ username: username})
            return existingUser;
        }catch(err){
            throw APIError('API Error', STATUS_CODES.INTERNAL_ERROR, 'Unable to Find Customer')
        }
    }

    async FindUserById({ id }){
        try{
            const existingUser = await UserModel.findById(id);
            return existingUser;
        }catch(err){
            throw APIError('API Error', STATUS_CODES.INTERNAL_ERROR, 'Unable to Find Customer')
        }
    }

    async updateUser(id, update) {
        try {

            const updateUser = await UserModel.findByIdAndUpdate(id, update);
            return updateUser;

        } catch (e) {
            throw new APIError('API Error', STATUS_CODES.INTERNAL_ERROR, 'Unable to Find Customer')
        }
    }
}

module.exports = UserRepository;