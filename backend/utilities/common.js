let cryptLib = require("cryptlib");
let constants = require("../config/constants");

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
        return res.json(this.encrypt(message));
    }

    async checkExistingUser(email){
        try{
            const checkUser = `SELECT * FROM tbl_user WHERE email = ? and is_deleted = 0`;
            const [user] = await database.query(checkUser, [email]);
            return user.length > 0;
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