document.addEventListener("DOMContentLoaded", function(){
    if(document.getElementById("add_task_btn")){
        const add_task_btn = document.getElementById("add_task_btn");
        add_task_btn.addEventListener("click", function(){
            window.location.href = "add_task.html";
        });
    }

    if(document.getElementById("add_task")){
        const add_task = document.getElementById("add_task");
        add_task.addEventListener("click", function(event){
            event.preventDefault();
            const title = document.getElementById("title").value;
            const desc = document.getElementById("desc").value;
            const deadline = new Date(document.getElementById("deadline").value);
            const newDeadline = deadline.toISOString().slice(0,19).replace('T', ' ');
            console.log(newDeadline);
            const user_token = JSON.parse(localStorage.getItem("user_token"));
    
            const myHeaders = new Headers();
            myHeaders.append("api-key", "qyjiyX9YwzSb4ZNTdBS/EQ==");
            myHeaders.append("authorization_token", user_token);
            myHeaders.append("Content-Type", "application/json");
    
            const raw = JSON.stringify({
                task_title: title,
                task_description: desc,
                deadline: newDeadline
            });
    
            const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
            };
    
            fetch("http://localhost:5000/v1/user/add-task", requestOptions)
            .then((response) => response.text())
            .then((result) => {
                const data = JSON.parse(result);
                if(data.code == '1'){
                    alert(data.message);
                    window.location.href = "home.html";
                } else{
                    alert(data.message);
                }
            })
            .catch((error) => console.error(error));
            })
    }
    
})