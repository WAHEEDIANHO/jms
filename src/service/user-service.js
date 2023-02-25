const { UserRepository } = require("../database");
const { BadRequestError } = require('../utils/app-errors')
const { FormatData } = require('../utils')

class UserService{
    constructor() {
        this.repository = new UserRepository();
    }

    async signUp( userData ) {
        console.log(userData)
        try {
            const user = await this.repository.CreateUser(userData);

            return FormatData({success: true, msg: "Registration successful"});
        }catch (e) {
            throw new BadRequestError(e.message, e)
        }
    }

    async getUsers () {
        try {
            const users = await this.repository.findAllUsers();

            return FormatData(users);
        }catch (e) {
            throw new BadRequestError(e.message, e)
        }
    }

    async getUserById (id) {
        console.log(id);
        try {
            const user = await this.repository.FindUserById({id})
            if (user) return FormatData(user);
            else throw new Error(`No entry match userId: ${id}`);
        } catch (e) {
            throw new BadRequestError(e.message, e)
        }
    }
}

module.exports = UserService;