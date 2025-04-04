const common = require("../../../../utilities/common");
const database = require("../../../../config/database");
const response_code = require("../../../../utilities/response-error-code");
const md5 = require("md5");

const { t } = require('localizify');

class UserModel {
	async signup(request_data){
        try{
            console.log(await common.checkExistingUser(request_data.email_id));
            if(!(await common.checkExistingUser(request_data.email_id))){
                const data = {
                    user_name: request_data.user_name,
                    email_id: request_data.email_id,
                    password: md5(request_data.password)
                }

                const [user_data] = await database.query(`INSERT INTO tbl_user SET ?`, [data]);
                const user_id = user_data.insertId;
                
                const device_data = {
                    device_type: "Android",
                    time_zone: "UTC",
                    device_token: "000000000000000000000000",
                    user_token: common.generateToken(24),
                    user_id: user_id,
                    os_version: "23.8.8",
                    app_version: "1.2.3"
                }

                await database.query(`INSERT INTO tbl_device_info SET ?`, [device_data]);
                return {
                    code: response_code.SUCCESS,
                    message: t("user_register_success"),
                    data: device_data.user_token
                }
            } else{
                return {
                    code: response_code.OPERATION_FAILED,
                    message: t("user_already_exists_login")
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

    async login(request_data){
        try{
            if(!(await common.checkExistingUser(request_data.email_id))){
                return {
                    code: response_code.OPERATION_FAILED,
                    message: t("user_not_found_please_register")
                }
            } 
            else if(await common.isLogin(request_data.email_id, request_data.password)){
                return {
                    code: response_code.OPERATION_FAILED,
                    message: t("user_already_logged_in")
                }
            }
            else{
                const isAuthValid = await common.checkUserAuth(request_data.email_id, request_data.password);
                if(isAuthValid){
                    const user_token = common.generateToken(24);

                    const user_id = await common.getUserData(request_data.email_id, request_data.password);
                    await database.query(`UPDATE tbl_user SET is_login = 1 where user_id = ?`, [user_id]);

                    const device_data = {
                        device_type: "Android",
                        time_zone: "UTC",
                        device_token: "000000000000000000000000",
                        user_token: user_token,
                        os_version: "23.8.8",
                        app_version: "1.2.3"
                    }
    
                    await database.query(`UPDATE tbl_device_info SET ? where user_id = ?`, [device_data, user_id]);

                    return {
                        code: response_code.SUCCESS,
                        message: t("user_login_success"),
                        data: {
                            user_token: user_token
                        }
                    }
                } else{
                    return {
                        code: response_code.OPERATION_FAILED,
                        message: t("user_login_failed_invalid_creds")
                    }
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

    async logout(user_id){
        try{
            const data = common.getUserAllData(user_id);
            if(data.is_login == 0){
                return {
                    code: response_code.OPERATION_FAILED,
                    message: t("user_already_logged_out")
                }
            } else{
                const device_data = {
                    time_zone: "",
                    device_token: "",
                    user_token: "",
                    os_version: "",
                    app_version: ""
                }

                await database.query(`UPDATE tbl_user SET is_login = 0 where user_id = ?`, [user_id]);
                await database.query(`UPDATE tbl_device_info SET ? where user_id = ?`, [device_data, user_id]);

                return {
                    code: response_code.SUCCESS,
                    message: t("user_logout_success")
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