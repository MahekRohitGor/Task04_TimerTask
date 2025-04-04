let userModel = require("../models/user_model");
let common = require("../../../../utilities/common");

class User{
    async signup(req,res){
        const request_data = req.body;
        const response_data = await userModel.signup(request_data);
        await common.response(res, response_data);
    }

    async login(req,res){
        const request_data = req.body;

        const response_data = await userModel.login(request_data);
        await common.response(res, response_data);
    }

    async logout(req,res){
        const request_data = req.body;
        
        const response_data = await userModel.logout(request_data);
        await common.response(res, response_data);
    }
    
}


module.exports = new User();