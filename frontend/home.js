document.addEventListener("DOMContentLoaded", function(){
    const user_token = JSON.parse(localStorage.getItem("user_token"));
    console.log(user_token);
    if(!user_token){
        window.location.href = "login.html";
        return;
    }

    const myHeaders = new Headers();
    myHeaders.append("api-key", "qyjiyX9YwzSb4ZNTdBS/EQ==");
    myHeaders.append("authorization_token", user_token);

    const requestOptions = {
    method: "POST",
    headers: myHeaders,
    redirect: "follow"
    };

    const div_container = document.getElementById("task-container");

    fetch("http://localhost:5000/v1/user/list-task", requestOptions)
    .then((response) => response.text())
    .then((result) => {
        const data = JSON.parse(result);
            if(data.code == '1'){
                const res = data.data;

                for(const task of res){
                    const htmlContent = `
                    <div id="card">
                    <p id="title">Title: <span id="title-span">${task.title}</span></p>
                    <p id="title">Description: <span id="desc-span">${task.desc}</span></p>
                    <p id="title">Deadline: <span id="deadline-span">${task.deadline}</span></p>
                    <p id="title">Status: <span id="status-span">${task.status}</span></p>
                    <p id="title">Notes: <span id="notes-span">${task.notes}</span></p>
                    </div>
                    `
                    div_container.innerHTML += htmlContent;
                }

            } else{
                alert(data.message);
            }
    })
    .catch((error) => console.error(error));

})