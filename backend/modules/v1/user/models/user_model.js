const common = require("../../../../utilities/common");
const database = require("../../../../config/database");
const response_code = require("../../../../utilities/response-error-code");
const md5 = require("md5");
const constants = require("../../../../config/constants");
const {sendOTP, welcomeEmail} = require("../../../../template");

const { t } = require('localizify');

class UserModel {
	async signup(request_data){
        try{
            if(!(await common.checkExistingUser(request_data.email))){
                const data = {
                    user_name: request_data.user_name,
                    email: request_data.email,
                    password: md5(request_data.password)
                }
                const insertUserQuery = `INSERT INTO tbl_user SET ?`;
                await database.query(insertUserQuery, [data]);

                return {
                    code: response_code.SUCCESS,
                    message: t("user_register_success")
                }
            }

        } catch(error){
            console.log(error.message);
            return {
                code: response_code.OPERATION_FAILED,
                message: t("some_error_occured"),
                data: error.message
            };
        }
    }
}
module.exports = new UserModel();