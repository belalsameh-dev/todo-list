const todoInput = document.querySelector("#todoInput");
const addBtn = document.querySelector("#addBtn");
const todoList = document.querySelector(".todo-list");

const todos = JSON.parse(localStorage.getItem("todos")) || [];

todoInput.addEventListener("input", () => {
  todoInput.value === "" ? (addBtn.disabled = true) : (addBtn.disabled = false);
});

function save() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

function createTodoItem(text) {
  const todoItem = document.createElement("div");
  todoItem.classList.add("todo-item");

  todoItem.innerHTML = `
      <div class="todo-text">${text}</div>
      <button id="editBtn" class="btn btn-warning">
        <i class="fas fa-edit"></i>
      </button>
      <button id="deleteBtn" class="btn btn-danger">
        <i class="fas fa-trash"></i>
      </button>
    `;

  return todoItem;
}

function render() {
  todoList.innerHTML = "";

  todos.forEach((todo, index) => {
    const todoItem = createTodoItem(todo);

    // Delete
    todoItem.querySelector("#deleteBtn").addEventListener("click", () => {
      deleteTodo(index);
    });

    // Edit
    todoItem.querySelector("#editBtn").addEventListener("click", () => {
      editTodo(index);
    });

    todoList.prepend(todoItem);
  });
}

function addTodo() {
  const value = todoInput.value.trim();
  if (!value) return;

  todos.push(value);
  save();
  render();

  todoInput.value = "";
  addBtn.disabled = true;
}

function deleteTodo(index) {
  //   if (confirm("Are you sure you want to delete this item?")) {
  todos.splice(index, 1);
  save();
  render();
  //   }
}

function editTodo(index) {
  const newValue = prompt("Update your todo item", todos[index]);

  if (newValue.trim() !== "") {
    todos[index] = newValue.trim();
    save();
    render();
  }
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addTodo();
  }
});

addBtn.addEventListener("click", addTodo);

// Initial Render
render();
