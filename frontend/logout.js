document.addEventListener("DOMContentLoaded", function(){
    const user_token = JSON.parse(localStorage.getItem("user_token"));
    console.log(user_token);
    if(!user_token){
        window.location.href = "login.html";
        return;
    }

    const button = document.getElementById("logout");

    button.addEventListener("click", function(){
        const myHeaders = new Headers();
        const user_token = JSON.parse(localStorage.getItem("user_token"));

        myHeaders.append("api-key", "qyjiyX9YwzSb4ZNTdBS/EQ==");
        myHeaders.append("authorization_token", user_token);

        const raw = "";

        const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
        };

        fetch("http://localhost:5000/v1/user/logout", requestOptions)
        .then((response) => response.text())
        .then((result) => {
            const data = JSON.parse(result);
            if(data.code == '1'){
                localStorage.removeItem("user_token");
                window.location.href = "login.html";
            } else{
                alert(data.message);
            }
        })
        .catch((error) => console.error(error));
            })
})