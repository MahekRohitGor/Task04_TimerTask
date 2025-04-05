document.addEventListener("DOMContentLoaded", function(){
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
                return input>10 ? input : `0${input}`;
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
                user_task_timer[index].cron = setInterval(() => timer(index), 10);
            });

            pause_btn.addEventListener("click", function(){
                clearInterval(user_task_timer[index].cron);
            });

            submit_btn.addEventListener("click", function(){
                const end_time = Date.now();
                console.log((end_time - user_task_timer[index].start_time)/1000);
            })
        })
    }, 1000);
})