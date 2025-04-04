class Routing{
    v1(app){
        const user = require("./v1/user/routes/routes");
        user(app);
    }
}

module.exports = new Routing();