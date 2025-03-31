document.addEventListener("DOMContentLoaded", () => {
    loadTasks();
    document.getElementById("toggle-theme").addEventListener("click", toggleDarkMode);

    // Attach event listeners to "Add Task" buttons
    document.querySelectorAll(".add-task").forEach(button => {
        button.addEventListener("click", () => {
            const column = button.closest(".column").id;
            addTask(column);
        });
    });

    // Enable drag-and-drop functionality on task lists
    document.querySelectorAll(".task-list").forEach(list => {
        list.addEventListener("dragover", allowDrop);
        list.addEventListener("drop", drop);
    });
});

// Function to add a new task
function addTask(status) {
    const taskText = prompt("Enter Task:");
    if (!taskText) return; // Exit if input is empty

    const task = { id: Date.now(), text: taskText, status };
    saveTask(task);
    renderTask(task);
}

// Function to display a task on the board
function renderTask(task) {
    const taskElement = document.createElement("div");
    taskElement.classList.add("task");
    taskElement.textContent = task.text;
    taskElement.setAttribute("draggable", "true");
    taskElement.setAttribute("id", task.id);
    taskElement.ondragstart = drag;

    document.querySelector(`.task-list[data-column="${task.status}"]`).appendChild(taskElement);
}

// Function to save task to localStorage
function saveTask(task) {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Function to load tasks from localStorage and display them
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(renderTask);
}

// Function to allow dropping of tasks in a column
function allowDrop(event) {
    event.preventDefault();
}

// Function to handle dragging of a task
function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
}

// Function to handle dropping of a task into a new column
function drop(event) {
    event.preventDefault();
    const taskId = event.dataTransfer.getData("text");
    const taskElement = document.getElementById(taskId);
    const taskList = event.target.closest(".task-list");
    
    if (!taskList) return; // Prevent errors if dropped outside a valid column

    taskList.appendChild(taskElement);
    updateTaskStatus(taskId, taskList.dataset.column);
}

// Function to update the status of task in localStorage
function updateTaskStatus(taskId, newStatus) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks = tasks.map(task => (task.id == taskId ? { ...task, status: newStatus } : task));
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Function to toggle dark mode
function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
}