/*
 *                                                          Project: My To-Do List
 *                                                              Version: v1.1
 *                                                              Author: Naman
 *
 *                                                               Description:
 *                                             A mood-based productivity app with task management,
 *                                              priority sorting, live clock, motivational quotes,
 *                                                         and day/night focus modes.
 */

//===========================================================================================
//                                  DOM ELEMENTS

const quotes=document.querySelector("#quotes");
const greetMsg=document.querySelector(".greeting-msg");
const taskCompleteSection=document.querySelector(".task-complete-section");
const taskCount=document.querySelector("#taskCount");
const completedTasks=document.querySelector("#Completed");
const remainingTasks=document.querySelector("#Remaining");
const prioritySection=document.querySelector(".priority-section");
const high=document.querySelector("#High");
const medium=document.querySelector("#Medium");
const low=document.querySelector("#Low");
const addbtn=document.querySelector(".addbtn");
const input_task=document.querySelector(".input-task");
const input_button=document.querySelector(".input-button");
const input_text=document.querySelector(".input-text");
const tasks_container=document.querySelector(".viewTasksList");
const viewTaskBtn=document.querySelector(".viewTasksBtn");
const tasks=document.querySelector(".tasks");
const clear_button=document.querySelector(".clear-button");
const task_tracker=document.querySelector(".Task-Tracker");
const disclaimerMsg=document.querySelector("#Disclaimer");
const changeMode=document.querySelector("#change-mode");
const body=document.querySelector("body");

//=========================================================================================

//=========================================================================================
//                                     quotes-section

const day_quotes_section=["Start now. Progress beats perfection.",
    "Do it today, not someday.",
    "Small tasks done on time build big success.",
    "Action today creates freedom tomorrow.",
    "Your future self will thank you.",
    "One task at a time. One step closer.",
    "Finish what you start.",
    "Discipline today, results tomorrow.",
    "Don’t wait for motivation. Start.",
    "Done is better than perfect."]

const night_quotes_section=["Quiet nights build strong minds.",
    "Discipline works when motivation doesn’t.",
    "No noise. Just progress.",
    "Focus is a superpower.",
    "Late effort, real growth.",
    "Earn tomorrow today.",
    "You vs you. Every day.",
    "Consistency never sleeps.",
    "Stay sharp. Stay silent.",
    "Results don’t need applause."]

let day_idx=0;
let night_idx=0;

function quotes_change(){
    quotes.style.opacity = 0;

    setTimeout(() => {
        if(darkMode === false){
            quotes.innerText = day_quotes_section[day_idx];
            day_idx = (day_idx + 1) % day_quotes_section.length;
        } else {
            quotes.innerText = night_quotes_section[night_idx];
            night_idx = (night_idx + 1) % night_quotes_section.length;
        }
        quotes.style.opacity = 1;
    }, 300);
}
setInterval(quotes_change, 3000);

//========================================================================================

//=========================================================================================
//                                    Greeting-msg-section

const name=prompt("Please Enter your name");
greetMsg.innerHTML=`Hello ${name},<br>Let's get started`;

//=========================================================================================

//=========================================================================================
//                                  All-Tasks Completed banner

function task_complete_banner(remainingTasks,totalTasks){
    if(remainingTasks===0 && totalTasks!==0){
        taskCompleteSection.classList.remove("hide");
    }
    else{
        taskCompleteSection.classList.add("hide");
    }
}

//==========================================================================================

//==========================================================================================
//                                      Refresh-UI-section

function refreshUI(){
    renderTasks();
    updateTaskTracker();
    updateClearButton();
    TaskTracker();
}

//==========================================================================================

//=========================================================================================
//                                      Task-Tracker-section

let taskList=[]; //single source of truth

function TaskTracker() {
    const total = taskList.length;
    const completed = taskList.filter(task => task.completed).length;
    const remaining = total - completed;

    taskCount.innerText = `Total Tasks: ${total}`;
    completedTasks.innerText = `Completed: ${completed}`;
    remainingTasks.innerText = `Remaining: ${remaining}`;

    task_complete_banner(remaining,total);
}

//=========================================================================================

//==========================================================================================
//                                    Tasks-Priority-section

const priorityOrder = {
    High: 1,
    Medium: 2,
    Low: 3
};

//==========================================================================================

//========================================================================================
//                                      Add-task-section

addbtn.addEventListener("click", () => {       //event-listener when Add task button is clicked
    input_task.classList.add("show");
    input_text.focus();
});

document.addEventListener("keydown", (e) => {      //Flexible UI (using keys to control the flow)
    if(e.key==="Enter" && e.ctrlKey){
        e.preventDefault();
        input_task.classList.add("show");
        input_text.focus();
    }

    else if(e.key==="Escape"){
        input_task.classList.remove("show");
    }
});

function addTask() {
    const task = input_text.value.trim();
    if (task === "") 
        return;
    
    if (!priorityOrder[prioritySection.value]) {
        alert("Please select a valid priority");
        return;}

    taskList.push({
        id:Date.now(),
        text:input_text.value,
        priority:prioritySection.value || "Medium",
        completed:false,
    });

    prioritySection.value="Priority";
    input_text.value = "";
    input_task.classList.remove("show");
    
    alert("Task added successfully");

    if (!tasks.classList.contains("hide")) {
        renderTasks();
    }
    refreshUI();
}

input_button.addEventListener("click", addTask);

document.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.ctrlKey) {
        addTask();
    }
});

//==============================================================================
//                       Preventing-empty-input

input_text.addEventListener("input", () => {
    if (input_text.value.trim() === "") {
        input_button.disabled = true;
    } else {
        input_button.disabled = false;
    }
});

//===============================================================================

//==============================================================================
//                             View-Tasks-Section

function renderTasks() {                        //re-rendering UI
    tasks_container.innerHTML = "";
    disclaimerMsg.classList.add("hide");
    
    const sortedTasks = [...taskList].sort((a, b) => {
    if (a.completed !== b.completed) {
        return a.completed - b.completed;       // incomplete first
    }

    const pA = priorityOrder[a.priority] ?? 99;    //priority order of tasks
    const pB = priorityOrder[b.priority] ?? 99;
    return pA - pB;});

    sortedTasks.forEach(task => {
        let displayTask = document.createElement("p");
        displayTask.dataset.id = task.id;  
        displayTask.innerText = task.text;
        displayTask.classList.add(task.priority.toLowerCase());
        
        addTaskControls(displayTask,task);
        tasks_container.append(displayTask);

        displayTask.addEventListener("dblclick",()=>{
            enableEdit(displayTask,task);
        })
    })
    updateTaskTracker();
    updateClearButton();
    TaskTracker();
}

//==========================================================================

//==========================================================================
//                 Functioning of view-task button

viewTaskBtn.addEventListener("click", () => {
    const isHidden = tasks.classList.toggle("hide");

    if (!isHidden) {
        renderTasks();
        
        if (taskList.length === 0) {
            clear_button.classList.add("hide");
            disclaimerMsg.classList.remove("hide");
        } else {
            clear_button.classList.remove("hide");
            disclaimerMsg.classList.add("hide");
        }
    } 
    else {
        clear_button.classList.add("hide");
        disclaimerMsg.classList.add("hide");
    }
    updateTaskTracker();
    updateClearButton();
});

//=========================================================================

//==========================================================================
//                            Editing a task

function enableEdit(taskElement,task){
    let input=document.createElement("input");
    input.type="text";
    input.value=task.text;
    input.classList.add("edit-input");

    taskElement.replaceWith(input);
    input.focus();
    
    //save-edit
    function saveEdit() {
        const newText = input.value.trim();
        if (newText !== "") {
            task.text = newText;
        }
        renderTasks();
    }

    function onBlur() {
        saveEdit();
    }

    input.addEventListener("blur", onBlur);

    input.addEventListener("keydown", (e) => {           //flexible UI
        if (e.key === "Enter") {
            saveEdit();
        }
        if(e.key==="Escape"){
            input.removeEventListener("blur", onBlur);
            input.replaceWith(taskElement);}
    });
}

//==========================================================================

//==========================================================================
//           Adding checkmarks, Delete Button for each task

function addTaskControls(list,task){
    let checkmark=document.createElement("input");
    checkmark.type="checkbox";
    checkmark.checked = task.completed;

    if (task.completed) {
        list.classList.add("completed");
    }

    checkmark.addEventListener("change", () => {
        task.completed = checkmark.checked;
        renderTasks();})
    
    let del=document.createElement("button");
    del.innerText="❌";
    del.classList.add("del-button");

    del.addEventListener("click", () => {
        taskList = taskList.filter(t => t.id !== task.id);
        if (taskList.length === 0) {
            clear_button.classList.add("hide");
        }
        renderTasks();

    });

    list.prepend(checkmark);
    list.append(del);
}

//==========================================================================


//=========================================================================
//                   Functioning of clear-button

clear_button.addEventListener("click",()=>{
    const sure = confirm("Are you sure you want to clear all tasks? This cannot be undone.");
    if (!sure) return;
    taskList.length=0;
    clear_button.classList.add("hide");
    refreshUI();
})

//=========================================================================

//=========================================================================
//                        On-screen view of clear button

function updateClearButton() {
    if (taskList.length > 0 && !tasks.classList.contains("hide")) {
        clear_button.classList.remove("hide");
    } else {
        clear_button.classList.add("hide");
    }
}

//=========================================================================

//=========================================================================
//                        On-screen view of tasks-tracker

function updateTaskTracker() {
    if (taskList.length === 0 || tasks.classList.contains("hide")) {
        task_tracker.classList.add("hide");
    } else {
        task_tracker.classList.remove("hide");
    }
}

//=========================================================================

//=========================================================================
//                         Changing-Mode (Day & Night)

let darkMode=false;
changeMode.addEventListener("click",()=>{
    if(darkMode===false){
        body.classList.add("night");
        body.classList.remove("day");
        darkMode=true;
    }
    else{
        body.classList.add("day");
        body.classList.remove("night");
        darkMode=false;
    }
})

//=========================================================================

//=========================================================================
//                            Live-Clock-Section

let liveClock = document.querySelector("#liveClock");

function updateClock() {
    const now = new Date();

    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();
    
    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    
    liveClock.innerText = `${hours}:${minutes}:${seconds}`;
}

updateClock();
setInterval(updateClock, 1000);

//=========================================================================








