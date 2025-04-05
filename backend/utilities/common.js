let cryptLib = require("cryptlib");
let constants = require("../config/constants");
let database = require("../config/database");
let response_code = require("./response-error-code.js");
const md5 = require("md5");

class Common{
    generateOtp(length){
        if(length <= 0){
            throw new Error("OTP length must be greater than 0");
        }
        const digits = '0123456789';
        let otp = '';
        for (let i = 0; i < length; i++) {
            otp += digits[Math.floor(Math.random() * digits.length)];
        }
        return otp;
    }

    generateToken(length){
        if(length <= 0){
            throw new Error("Token length must be greater than 0");
        }
        const alphaNumeric = '0123456789qwertyuiopasdfghjklzxcvbnm';
        let token = '';
        for (let i = 0; i < length; i++) {
            token += alphaNumeric[Math.floor(Math.random() * alphaNumeric.length)];
        }
        return token;
    }

    async requestValidation(v) {
        if (v.fails()) {
            const Validator_errors = v.getErrors();
            const error = Object.values(Validator_errors)[0][0];
            return {
                code: true,
                message: error
            };
        } 
        return {
            code: false,
            message: ""
        };
    }

    async response(res, message){
        return res.json(message);
    }

    async checkExistingUser(email){
        try{
            const checkUser = `SELECT * FROM tbl_user WHERE email_id = ? and is_deleted = 0`;
            const [user] = await database.query(checkUser, [email]);
            return user.length > 0;
        } catch(error){
            console.log(error.message);
            return false;
        }
    }

    async checkUserAuth(email, pass){
        try{
            const checkUser = `SELECT user_id FROM tbl_user WHERE email_id = ? and password = ? and is_deleted = 0`;
            const [user_data] = await database.query(checkUser, [email, md5(pass)]);
            return user_data.length > 0;

        } catch(error){
            console.log(error.message);
            return false;
        }
    }

    async isLogin(email, pass){
        try{
            const checkUser = `SELECT user_id FROM tbl_user WHERE email_id = ? and password = ? and is_deleted = 0 and is_login = 1`;
            const [user_data] = await database.query(checkUser, [email, md5(pass)]);
            return user_data.length > 0;

        } catch(error){
            console.log(error.message);
            return false;
        }
    }

    async getUserData(email, pass){
        try{
            const checkUser = `SELECT user_id FROM tbl_user WHERE email_id = ? and password = ? and is_deleted = 0`;
            const [user_data] = await database.query(checkUser, [email, md5(pass)]);
            return user_data[0].user_id;

        } catch(error){
            console.log(error.message);
            return false;
        }
    }

    async getUserAllData(id){
        try{
            const checkUser = `SELECT * FROM tbl_user WHERE user_id = ? and is_deleted = 0`;
            const [user_data] = await database.query(checkUser, [id]);
            return user_data[0];
        } catch(error){
            console.log(error.message);
            return false;
        }
    }

    async isLoginId(user_id){
        try{
            const [user_data] = await database.query(`select * from tbl_user where user_id = ? and is_deleted = 0 and is_active = 1 and is_login = 1`, [user_id]);
            console.log(user_data);
            return user_data.length > 0;

        } catch(error){
            console.log(error.message);
            return false;
        }
    }

    async updateToken(user_id, token){
        try{
            const updateTokenQuery = `UPDATE tbl_device SET user_token = ? WHERE user_id = ?`;
            await database.query(updateTokenQuery, [token, user_id]);
        } catch(error){
            console.error("Error in updateToken:", error.message);
            const response = {
                code: response_code.OPERATION_FAILED,
                message: t("token_update_failed"),
                data: error.message
            }
            this.response(res, response);
        }
    }

    encrypt(data) {
        return cryptLib.encrypt(JSON.stringify(data), constants.encryptionKey, constants.encryptionIV);
    }
    decryptPlain(data) {
        return cryptLib.decrypt(data, constants.encryptionKey, constants.encryptionIV);
    }
    decryptString (data){
        try{
            if(data){
                return cryptLib.decrypt(data, constants.encryptionKey, constants.encryptionIV);
            }else{
                return;
            }
        }catch(error){
            return error;
        }
    }
}

module.exports = new Common();