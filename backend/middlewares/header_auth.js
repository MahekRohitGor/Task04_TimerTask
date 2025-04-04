const {default: localizify} = require('localizify');
const database = require("../config/database");
const common = require("../utilities/common");
const response_code = require("../utilities/response-error-code");
const en = require("../language/en");
const fr = require("../language/fr");
const guj = require("../language/guj");
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
                    return this.sendUnauthorizedResponse(res, "Invalid API key");
                }

            } catch(error){
                console.log(error);
                return this.sendUnauthorizedResponse(res, "Invalid API key");
            }
        } else{
            return this.sendUnauthorizedResponse(res, "Invalid API key");
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
            let selectRequestOwnerQuery = "SELECT * from tbl_device_info WHERE user_token = ? and is_deleted = 0 and is_active = 1";
            const [owner] = await database.query(selectRequestOwnerQuery, [token]);
            if (owner.length > 0) {
                return owner[0];
            } else {
                throw new Error("Invalid access token");
            }
        } catch (error) {
            console.error("Error in getRequestOwnerUser:", error.message);
            throw error;
        }
    }

    async header(req, res, next) {
        try {
            this.setLanguage(req.headers);
            const api_dec = req.headers["api-key"];
            if (api_dec === process.env.API_KEY) {
                this.processRequest(req, res, next);
            } else {
                return this.sendUnauthorizedResponse(res, "Invalid API key");
            }
        } catch (error) {
            return res.status(500).json({
                code: response_code.UNAUTHORIZED,
                message: "Internal Server Error",
                data: error.message,
            });
        }
    }

    setLanguage(headers) {
        const supported_languages = ["en", "fr", "guj"];
        const lng = (headers["accept-language"] && supported_languages.includes(headers["accept-language"]))
            ? headers["accept-language"]
            : "en";

        process.env.LNG = lng;
        localizify
            .add("en", en)
            .add("fr", fr)
            .add("guj", guj);
    }

    async processRequest(req, res, next) {
        const byPassApi = ['login', 'signup'];
        const headerObj = new HeaderAuth();
        req = headerObj.extractMethod(req);

        if (byPassApi.includes(req.requestMethod)) {
            return next();
        } else {
            const token = req.headers.authorization_token;
            if (!token) {
                return this.sendUnauthorizedResponse(res, "Authorization token is missing");
            }
            await this.authenticateUser(req, res, next, token, headerObj);
        }
    }

    async authenticateUser(req, res, next, token, headerObj) {
        try {
            let user;
            user = await headerObj.getRequestOwnerUser(token);
            req.user_id = user.user_id;
            req.user = user;
            next();
        } catch (error) {
            console.log(error);
            return this.sendUnauthorizedResponse(res, "Invalid Access Token");
        }
    }

    sendUnauthorizedResponse(res, message) {
        const data = {
            code: response_code.UNAUTHORIZED,
            message: message,
            data: null
        }
        common.response(res, data);
    }

}

module.exports = new HeaderAuth();