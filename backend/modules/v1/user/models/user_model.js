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
                    message: t("user_not_found_please_register"),
                    data: null
                }
            } 
            else if(await common.isLogin(request_data.email_id, request_data.password)){
                return {
                    code: response_code.OPERATION_FAILED,
                    message: t("user_already_logged_in"),
                    data: null
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

    async add_task(request_data, user_id){
        try{
            const checkUserLogin = await common.isLoginId(user_id);
            if(!checkUserLogin){
                return {
                    code: response_code.OPERATION_FAILED,
                    message: t("user_not_login"),
                    data: null
                }
            }

            const task_data = {
                user_id: user_id,
                title: request_data.task_title,
                description: request_data.task_description,
                deadline: request_data.deadline,
                status: "pending"
            }

            const [task] = await database.query(`INSERT INTO tbl_tasks SET ?`, [task_data]);
            const insert_task_id = task.insertId;

            const timer_data = {
                task_id: insert_task_id
            }

            await database.query(`INSERT INTO tbl_timer SET ?`, [timer_data]);
            return {
                code: response_code.SUCCESS,
                message: t("task_added_success"),
                data: {
                    task_id: insert_task_id
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

    async list_all_tasks(user_id){
        try{
            const checkUserLogin = await common.isLoginId(user_id);
            console.log(checkUserLogin);
            if(!checkUserLogin){
                return {
                    code: response_code.OPERATION_FAILED,
                    message: t("user_not_login"),
                    data: null
                }
            }

            const [task_data] = await database.query(`SELECT * FROM tbl_tasks where user_id = ?`, [user_id]);
            if(task_data.length == 0){
                return {
                    code: response_code.OPERATION_FAILED,
                    message: t("no_task_found"),
                    data: null
                }
            }

            const task_details = task_data.map(task => ({
                task_id: task.task_id,
                user_id: user_id,
                title: task.title,
                desc: task.description,
                deadline: task.deadline,
                status: task.status,
                notes: task.notes
                
            }));

            return {
                code: response_code.SUCCESS,
                message: t("task_list_success"),
                data: task_details
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

    async updateStatus(request_data, user_id){
        try{
            console.log(user_id);
            const checkOtherTasks = `SELECT * from tbl_tasks where status = "inprogress" and user_id = ?`;
            const [results] = await database.query(checkOtherTasks, [user_id]);

            const checkCompTasks = `SELECT * from tbl_tasks where status = "completed" and user_id = ? and task_id = ?`;
            const [res] = await database.query(checkCompTasks, [user_id, request_data.task_id]);

            if(res.length > 0){
                return {
                    code: response_code.OPERATION_FAILED,
                    message: t('task_already_submitted'),
                    data: null
                }
            }

            if(results.length === 0 || request_data.status == "completed"){
                const task_data = {
                    status: request_data.status,
                }
                if(request_data.notes){
                    task_data.notes = request_data.notes;
                }
                const updateQuery = `UPDATE tbl_tasks SET ? where user_id = ? and task_id = ?`;
                await database.query(updateQuery, [task_data, user_id, request_data.task_id]);
                const data = {};

                if(request_data.start_time){
                    data.start_time = request_data.start_time;
                }
                if(request_data.end_time){
                    data.end_time = request_data.end_time;
                }

                const updateTimerQuery = `UPDATE tbl_timer SET ? where task_id = ?`;
                await database.query(updateTimerQuery, [data, request_data.task_id]);
    
                return {
                    code: response_code.SUCCESS,
                    message: t('updated_successfully'),
                    data: request_data.task_id
                }
            } else{
                return {
                    code: response_code.OPERATION_FAILED,
                    message: t('can_not_start_timer'),
                    data: request_data.task_id
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