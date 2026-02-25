// ================== SELECTORS ==================
const todoInput = document.querySelector("#todoInput");
const addBtn = document.querySelector("#addBtn");
const todoList = document.querySelector(".todo-list");


// ================== STATE ==================
let todos = JSON.parse(localStorage.getItem("todos")) || [];
let draggedElement = null;


// ================== STORAGE ==================
function save() {
  localStorage.setItem("todos", JSON.stringify(todos));
}


// ================== UI ==================
function createTodoItem(todo) {
  const item = document.createElement("div");
  item.className = "todo-item";
  item.draggable = true;
  item.dataset.id = todo.id;

  item.innerHTML = `
    <i class="fas fa-grip-vertical"></i>
    <div class="todo-text">${todo.text}</div>
    <button class="edit-btn btn btn-warning"><i class="fas fa-edit"></i></button>
    <button class="delete-btn btn btn-danger"><i class="fas fa-trash"></i></button>
  `;

  return item;
}

function render() {
  todoList.innerHTML = "";
  todoList.append(...todos.map(createTodoItem));
}


// ================== ACTIONS ==================
function addTodo() {
  const value = todoInput.value.trim();
  if (!value) return;

  const todo = {
    id: Date.now(), 
    text: value
  };

  todos.unshift(todo);
  save();

  todoList.prepend(createTodoItem(todo));
  todoInput.value = "";
  addBtn.disabled = true;
}

function deleteTodo(id, element) {
  todos = todos.filter(t => t.id !== id);
  element.remove();
  save();
}

function editTodo(id, element) {
  const todo = todos.find(t => t.id === id);
  const newValue = prompt("Update todo item", todo.text);
  if (!newValue || !newValue.trim()) return;

  todo.text = newValue.trim();
  element.querySelector(".todo-text").textContent = todo.text;
  save();
}


// ================== EVENTS ==================

// input validation
todoInput.addEventListener("input", () => {
  addBtn.disabled = !todoInput.value.trim();
});

// add todo
addBtn.addEventListener("click", addTodo);
document.addEventListener("keydown", e => {
  if (e.key === "Enter") addTodo();
});

// event delegation for edit/delete
todoList.addEventListener("click", e => {
  const item = e.target.closest(".todo-item");
  if (!item) return;

  const id = Number(item.dataset.id);

  if (e.target.closest(".delete-btn")) deleteTodo(id, item);
  if (e.target.closest(".edit-btn")) editTodo(id, item);
});


// ================== DRAG & DROP ==================
todoList.addEventListener("dragstart", e => {
  draggedElement = e.target.closest(".todo-item");
  draggedElement.classList.add("dragging");
});

todoList.addEventListener("dragend", () => {
  draggedElement.classList.remove("dragging");
  draggedElement = null;
  saveStateFromDOM();
});

todoList.addEventListener("dragover", e => {
  e.preventDefault();
  const afterElement = getDragAfterElement(todoList, e.clientY);
  if (!draggedElement) return;

  if (afterElement == null) todoList.appendChild(draggedElement);
  else todoList.insertBefore(draggedElement, afterElement);
});

function getDragAfterElement(container, y) {
  const elements = [...container.querySelectorAll(".todo-item:not(.dragging)")];

  return elements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;

      if (offset < 0 && offset > closest.offset) return { offset, element: child };
      return closest;
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
}


// ================== HELPER ==================
function saveStateFromDOM() {
  const newOrderIds = [...todoList.children].map(el => Number(el.dataset.id));
  todos.sort((a, b) => newOrderIds.indexOf(a.id) - newOrderIds.indexOf(b.id));
  save();
}


// ================== INIT ==================
render();
addBtn.disabled = true;
