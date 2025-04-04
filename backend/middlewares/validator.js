const Validator = require('Validator');
const database = require("../config/database");
const { t } = require('localizify');
const common = require("../utilities/common");
const response_code = require("../utilities/response-error-code");

class Validators{
    async checkValidationRules(req,res,request_data,rules,message,keywords){
        const v = Validator.make(request_data, rules, message, keywords);

            if(v.fails()){
                const errors = v.getErrors();
                const firstError = Object.values(errors)[0][0];
                const response_data = {
                    code: response_code.OPERATION_FAILED,
                    message: firstError
                };
                common.response(res, response_data);
                return false;
            } else{
                return true;
            }
    }

    extractHeaderLang(req, res, next) {
        req.userLang = req.headers["accept-language"] || "en";
    
        localizify
            .add("en", en)
            .add("fr", fr)
            .add("guj", guj);
        
        localizify.setLocale(req.userLang);
        if (req.headers['content-type'] && req.headers['content-type'].includes('multipart/form-data')) {
            if (req.body && typeof req.body === 'object' && !req.body.userLang) {
                req.body.userLang = req.userLang;
            }
            return next();
        }
        try {
            if (req.body && typeof req.body === 'object' && !req.body.userLang) {
                req.body.userLang = req.userLang;
            } else if (typeof req.body === 'string') {
                const req_body = req.body;
                req_body.userLang = req.userLang;
                req.body = req_body;
            }
        } catch (error) {
            console.error('Language middleware decryption error:', error);
        }
    
        next();
    }
    
}

module.exports = new Validators();