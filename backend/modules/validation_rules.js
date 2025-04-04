const rules = {
    signup: {
        email_id: "required|email",
        password: "required|min:16",
        user_name: "required"
    },

    login: {
        email_id: "nullable|required_without:phone_number|email",
        password: "required|min:8"
    }
}

module.exports = rules;