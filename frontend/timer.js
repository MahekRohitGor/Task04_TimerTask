document.addEventListener("DOMContentLoaded", function(){
    const user_token = JSON.parse(localStorage.getItem("user_token"));
    console.log(user_token);
    if(!user_token){
        window.location.href = "login.html";
        return;
    }
    let user_task_timer = {};

    setTimeout(()=> {
        const cards = document.querySelectorAll(".card");
        cards.forEach((card)=>{
            const user_id = card.id.split("-")[1];
            const task_id = card.id.split("-")[2];
            const index = user_id+"-"+task_id;

            user_task_timer[index] = {
                hr: 0,
                min: 0,
                sec: 0,
                millisec: 0,
                cron: null,
                start_time: null
            }
            const hr = document.getElementById(`hr-${task_id}`);
            const min = document.getElementById(`min-${task_id}`);
            const sec = document.getElementById(`sec-${task_id}`);

            const start_btn = document.getElementById(`start-${task_id}`);
            const pause_btn = document.getElementById(`pause-${task_id}`);
            const submit_btn = document.getElementById(`submit-${task_id}`);

            function returnData(input){
                return input>9 ? input : `0${input}`;
            }

            function timer(index){
                const time = user_task_timer[index];
                if((time.millisec += 10) == 1000){
                    time.millisec = 0;
                    time.sec++;
                }
                if(time.sec == 60){
                    time.sec = 0;
                    time.min++;
                }
                if(time.min == 60){
                    time.min = 0;
                    time.hr++;
                }

                hr.innerText = returnData(time.hr);
                min.innerText = returnData(time.min);
                sec.innerText = returnData(time.sec);
            }

            start_btn.addEventListener("click", function(){
                user_task_timer[index].start_time = Date.now();
                const date = new Date(user_task_timer[index].start_time);
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const days = String(date.getDate()).padStart(2, '0');

                const hour = String(date.getHours()).padStart(2, '0');
                const minute = String(date.getMinutes()).padStart(2, '0');
                const seconds = String(date.getSeconds()).padStart(2, '0');

                const insertStartDate = `${year}-${month}-${days} ${hour}:${minute}:${seconds}`;

                const myHeaders = new Headers();
                myHeaders.append("api-key", "qyjiyX9YwzSb4ZNTdBS/EQ==");
                myHeaders.append("authorization_token", user_token);
                myHeaders.append("Content-Type", "application/json");

                const raw = JSON.stringify({
                "task_id": task_id,
                "status": "inprogress",
                "start_time": insertStartDate
                });

                const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: raw,
                redirect: "follow"
                };

                fetch("http://localhost:5000/v1/user/update-timer", requestOptions)
                .then((response) => response.text())
                .then((result) => {
                    const data = JSON.parse(result);
                    if(data.code == '1'){
                        user_task_timer[index].cron = setInterval(() => timer(index), 10);
                    } else{
                        alert(data.message)
                    }
                })
                .catch((error) => console.error(error));
            });

            pause_btn.addEventListener("click", function(){
                clearInterval(user_task_timer[index].cron);
            });

            submit_btn.addEventListener("click", function(){
                const end_time = Date.now();
                const date = new Date(end_time);
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const days = String(date.getDate()).padStart(2, '0');

                const hour = String(date.getHours()).padStart(2, '0');
                const minute = String(date.getMinutes()).padStart(2, '0');
                const seconds = String(date.getSeconds()).padStart(2, '0');

                const insertEndDate = `${year}-${month}-${days} ${hour}:${minute}:${seconds}`;

                const myHeaders = new Headers();
                myHeaders.append("api-key", "qyjiyX9YwzSb4ZNTdBS/EQ==");
                myHeaders.append("authorization_token", user_token);
                myHeaders.append("Content-Type", "application/json");

                const raw = JSON.stringify({
                "task_id": task_id,
                "status": "completed",
                "end_time": insertEndDate
                });

                const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: raw,
                redirect: "follow"
                };

                fetch("http://localhost:5000/v1/user/update-timer", requestOptions)
                .then((response) => response.text())
                .then((result) => {
                    const data = JSON.parse(result);
                    alert(data.message);
                })
                .catch((error) => console.error(error));
                });
        })
    }, 1000);
})