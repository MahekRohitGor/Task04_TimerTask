document.addEventListener("DOMContentLoaded", function(){
    const button = document.getElementById("login");
    console.log(button);

    button.addEventListener("click", function(event){
        event.preventDefault();
        const email_id = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        const myHeaders = new Headers();
        myHeaders.append("api-key", "qyjiyX9YwzSb4ZNTdBS/EQ==");
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            email_id: email_id,
            password: password
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        fetch("http://localhost:5000/v1/user/login", requestOptions)
            .then((response) => response.text())
            .then((result) => {
                const data = JSON.parse(result);
                if(data.data){
                    localStorage.setItem("user_token", JSON.stringify(data.data.user_token));
                    if(data.code == '1'){
                        window.location.href = "home.html";
                    } else{
                        alert(data.message);
                    }
                } else{
                    alert(data.message);
                }
            })
            .catch((error) => console.error(error));
        })
    
})