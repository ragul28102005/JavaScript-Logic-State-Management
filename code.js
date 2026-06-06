<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>To-Do App</title>

<style>
*{
    margin:0;
    padding:0;
    box-sizing:border-box;
}

body{
    font-family:Arial, sans-serif;
    background:#f4f4f4;
    min-height:100vh;
    display:flex;
    justify-content:center;
    align-items:center;
    padding:20px;
}

.container{
    width:100%;
    max-width:600px;
    background:#fff;
    padding:25px;
    border-radius:12px;
    box-shadow:0 5px 15px rgba(0,0,0,.1);
}

h1{
    text-align:center;
    margin-bottom:20px;
}

form{
    display:flex;
    gap:10px;
    margin-bottom:20px;
}

input[type="text"]{
    flex:1;
    padding:12px;
    border:1px solid #ccc;
    border-radius:6px;
}

button{
    border:none;
    padding:12px 18px;
    cursor:pointer;
    border-radius:6px;
}

.add-btn{
    background:#2563eb;
    color:white;
}

.filters{
    display:flex;
    justify-content:center;
    gap:10px;
    margin-bottom:20px;
}

.filter-btn{
    background:#e5e7eb;
}

.filter-btn.active{
    background:#2563eb;
    color:white;
}

ul{
    list-style:none;
}

.todo-item{
    display:flex;
    align-items:center;
    gap:10px;
    padding:12px;
    border:1px solid #ddd;
    border-radius:8px;
    margin-bottom:10px;
}

.todo-text{
    flex:1;
}

.completed .todo-text{
    text-decoration:line-through;
    opacity:.6;
}

.edit-btn{
    background:#f59e0b;
    color:white;
}

.delete-btn{
    background:#dc2626;
    color:white;
}

@media(max-width:600px){

    form{
        flex-direction:column;
    }

    .todo-item{
        flex-wrap:wrap;
    }

}
</style>
</head>

<body>

<div class="container">

    <h1>To-Do List</h1>

    <form id="todoForm">
        <input
            type="text"
            id="todoInput"
            placeholder="Enter a task..."
            required
        >
        <button class="add-btn" type="submit">
            Add Task
        </button>
    </form>

    <div class="filters">
        <button class="filter-btn active" data-filter="all">
            All
        </button>

        <button class="filter-btn" data-filter="active">
            Active
        </button>

        <button class="filter-btn" data-filter="completed">
            Completed
        </button>
    </div>

    <ul id="todoList"></ul>

</div>

<script>

const todoForm = document.getElementById("todoForm");
const todoInput = document.getElementById("todoInput");
const todoList = document.getElementById("todoList");
const filterButtons = document.querySelectorAll(".filter-btn");

let todos =
    JSON.parse(localStorage.getItem("todos")) || [];

let currentFilter = "all";

function saveTodos(){
    localStorage.setItem(
        "todos",
        JSON.stringify(todos)
    );
}

function addTodo(text){

    const todo = {
        id: Date.now(),
        text,
        completed:false
    };

    todos.push(todo);

    saveTodos();
    renderTodos();
}

function deleteTodo(id){

    todos = todos.filter(
        todo => todo.id !== id
    );

    saveTodos();
    renderTodos();
}

function updateTodo(id){

    const task =
        todos.find(todo => todo.id === id);

    const newText =
        prompt("Edit Task", task.text);

    if(!newText || !newText.trim()) return;

    task.text = newText.trim();

    saveTodos();
    renderTodos();
}

function toggleTodo(id){

    todos = todos.map(todo =>
        todo.id === id
            ? {
                ...todo,
                completed: !todo.completed
              }
            : todo
    );

    saveTodos();
    renderTodos();
}

function getFilteredTodos(){

    switch(currentFilter){

        case "active":
            return todos.filter(
                todo => !todo.completed
            );

        case "completed":
            return todos.filter(
                todo => todo.completed
            );

        default:
            return todos;
    }
}

function renderTodos(){

    todoList.innerHTML = "";

    const filteredTodos =
        getFilteredTodos();

    filteredTodos.forEach(todo => {

        const li =
            document.createElement("li");

        li.className =
            `todo-item ${
                todo.completed
                ? "completed"
                : ""
            }`;

        li.dataset.id = todo.id;

        li.innerHTML = `
            <input
                type="checkbox"
                class="toggle"
                ${todo.completed ? "checked" : ""}
            >

            <span class="todo-text">
                ${todo.text}
            </span>

            <button class="edit-btn">
                Edit
            </button>

            <button class="delete-btn">
                Delete
            </button>
        `;

        todoList.appendChild(li);
    });

}

todoForm.addEventListener("submit", e => {

    e.preventDefault();

    const text =
        todoInput.value.trim();

    if(!text) return;

    addTodo(text);

    todoInput.value = "";
});

todoList.addEventListener("click", e => {

    const li =
        e.target.closest(".todo-item");

    if(!li) return;

    const id =
        Number(li.dataset.id);

    if(
        e.target.classList.contains(
            "delete-btn"
        )
    ){
        deleteTodo(id);
    }

    if(
        e.target.classList.contains(
            "edit-btn"
        )
    ){
        updateTodo(id);
    }
});

todoList.addEventListener("change", e => {

    if(
        e.target.classList.contains(
            "toggle"
        )
    ){

        const li =
            e.target.closest(".todo-item");

        const id =
            Number(li.dataset.id);

        toggleTodo(id);
    }
});

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        filterButtons.forEach(btn =>
            btn.classList.remove("active")
        );

        button.classList.add("active");

        currentFilter =
            button.dataset.filter;

        renderTodos();
    });

});

renderTodos();

</script>

</body>
</html>
