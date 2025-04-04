const users = require("../controllers/user");

const user = (app) =>{
        app.post("/v1/user/signup", users.signup);
        app.post("/v1/user/login", users.login);
        app.post("/v1/user/logout", users.logout);
}

module.exports = user;