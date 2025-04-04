const {default: localizify} = require('localizify');
const database = require("../config/database");
const common = require("../utilities/common");
const response_code = require("../utilities/response-error-code");
const lodash = require('lodash');

class HeaderAuth{

    async validateHeader(req,res,next){
        let api_key = (req.headers['api-key'] != undefined && req.headers['api-key'] != "" ? req.headers['api-key'] : '');
        if(api_key != ""){
            try{
                let api_dec = api_key;
                console.log(api_dec === process.env.API_KEY);
                if(api_dec === process.env.API_KEY){
                    next();
                } else{
                    const response_data_ = {
                        code: response_code.UNAUTHORIZED,
                        message: "Invalid API Key"
                    }
                    const response_data = common.encrypt(response_data_);
                    res.status(401).send(response_data);
                }

            } catch(error){
                console.log(error);
                    const response_data_ = {
                        code: response_code.UNAUTHORIZED,
                        message: "Invalid API Key"
                    }
                    const response_data = common.encrypt(response_data_);
                    res.status(401).send(response_data);
            }
        } else{
            const response_data_ = {
                code: response_code.UNAUTHORIZED,
                message: "Invalid API Key"
            }
            const response_data = common.encrypt(response_data_);
            res.status(401).send(response_data);
        }
    }

    extractMethod(request) {
        let url = request.originalUrl;
        let segment = [];
        url.split("/").forEach((element) => {
            if (!lodash.isEmpty(element)) {
                segment.push(element.trim());
            }
        });
        request.appVersion = segment[0];
        request.requestedModule = segment[1];
        request.requestMethod = segment[segment.length - 1];

        return request;
    }

    async getRequestOwnerUser(token) {
        try {
            console.log("here");
            let selectRequestOwnerQuery = "SELECT * from tbl_device_info WHERE user_token = ? and is_deleted = 0 and is_active = 1";
            const [owner] = await database.query(selectRequestOwnerQuery, [token]);
            console.log(owner);
            if (owner.length > 0) {
                return owner[0];
            } else {
                throw new Error("Invalid access token");
            }
        } catch (error) {
            console.log(error.message);
            throw error;
        }
    }

    async header(req, res, next) {
        try {
            console.log("here");
            let headers = req.headers;
    
            const byPassApi = ['login', 'signup', 'api-docs', 'verifyOtp'];
            let api_dec = headers["api-key"];
            if (api_dec === process.env.API_KEY) {
                let headerObj = new HeaderAuth();
                req = headerObj.extractMethod(req);
    
                if (byPassApi.includes(req.requestMethod)) {
                    return next();
                } else {
                    const token = headers.authorization_token;
                    if (!token) {
                        return res.status(401).json({
                            code: response_code.UNAUTHORIZED,
                            message: "Authorization token is missing"
                        });
                    }

                    try {
                        let user;
                        user = await headerObj.getRequestOwnerUser(token);
                        console.log("User found:", user);
                        req.user_id = user.user_id;
                        req.user = user;
                        console.log("req.user_id set to:", req.user_id);
                        next();
                    } catch (error) {
                        console.log(error);
                        return res.status(401).json({
                            code: response_code.UNAUTHORIZED,
                            message: "Invalid Access Token"
                        });
                    }
                }
            } else {
                return res.status(401).json({
                    code: response_code.UNAUTHORIZED,
                    message: "Invalid API key",
                });
            }
        } catch (error) {
            return res.status(500).json({
                code: response_code.UNAUTHORIZED,
                message: "Internal Server Error",
                data: error.message,
            });
        }
    }

}

module.exports = new HeaderAuth();