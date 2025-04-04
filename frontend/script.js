document.addEventListener("DOMContentLoaded", function(){
    const button = document.getElementById("register");
    const user_name = document.getElementById("uname").value;
    const email_id = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    button.addEventListener("click", function(){
        const myHeaders = new Headers();
        myHeaders.append("api-key", "qyjiyX9YwzSb4ZNTdBS/EQ==");
        myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        user_name: user_name,
        email_id: email_id,
        password: password
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    fetch("localhost:5000/v1/user/signup", requestOptions)
        .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((error) => console.error(error));
    })
    
})