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
        const user_id = req.user_id;
        const response_data = await userModel.logout(user_id);
        await common.response(res, response_data);
    }

    async add_task(req,res){
        const request_data = req.body;
        const user_id = req.user_id;
        const response_data = await userModel.add_task(request_data, user_id);
        await common.response(res, response_data);
    }

    async list_all_tasks(req,res){
        const user_id = req.user_id;
        console.log("list all task: ", user_id);
        const response_data = await userModel.list_all_tasks(user_id);
        await common.response(res, response_data);
    }
    
}


module.exports = new User();