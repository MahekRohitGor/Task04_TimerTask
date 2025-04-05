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
                    <div class="card" id="card-${task.user_id}-${task.task_id}">
                    <p id="title-${task.task_id}">Title: <span id="title-${task.task_id}">${task.title}</span></p>
                    <p id="desc-${task.task_id}">Description: <span id="desc-${task.task_id}">${task.desc}</span></p>
                    <p id="deadline-${task.task_id}">Deadline: <span id="deadline-${task.task_id}">${task.deadline}</span></p>
                    <p id="status-${task.task_id}">Status: <span id="status-${task.task_id}">${task.status}</span></p>
                    <p id="notes-${task.task_id}">Notes: <span id="notes-${task.task_id}">${task.notes}</span></p>
                    <span id="hr-${task.task_id}">00</span>:<span id="min-${task.task_id}">00</span>:<span id="sec-${task.task_id}">00</span><br>
                    <button id="start-${task.task_id}">Start</button>
                    <button id="pause-${task.task_id}">Pause</button>
                    <button id="submit-${task.task_id}">Submit</button>
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