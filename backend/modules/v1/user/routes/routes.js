const users = require("../controllers/user");

const user = (app) =>{
        app.post("/v1/user/signup", users.signup);
        app.post("/v1/user/login", users.login);
        app.post("/v1/user/logout", users.logout);
        app.post("/v1/user/add-task", users.add_task);
        app.post("/v1/user/list-task", users.list_all_tasks);
        app.post("/v1/user/update-timer", users.updateStatus);
}

module.exports = user;