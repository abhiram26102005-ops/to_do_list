// script.js — matches your provided HTML/CSS exactly

// --- data load / initialization ---
let todo = JSON.parse(localStorage.getItem("todo") || "[]");

// Elements (matching your HTML)
const todoInput = document.getElementById("todoInput");
const addButton = document.querySelector(".btn");
const deleteAllButton = document.querySelector(".deleteButton");
const listContainer = document.querySelector(".sroll"); // the <ul class="sroll"> in your HTML
const counterP = document.querySelector(".counter-container p"); // the <p> that shows "items total 0"

// Helper to update the counter text (keeps it inside the same <p>)
function updateCounter() {
  // keep the same visual wording as your HTML
  const count = todo.length;
  counterP.innerHTML = `<span>items total </span><span id="todoCount">${count}</span>`;
}

// Persist
function saveToLocalStorage() {
  localStorage.setItem("todo", JSON.stringify(todo));
}

// --- render tasks ---
function displayTasks() {
  // Clear list container (your HTML had an initial <li id="todoList"> placeholder — remove it)
  listContainer.innerHTML = "";

  if (!todo.length) {
    // show a friendly placeholder li (keeps styling)
    const emptyLi = document.createElement("li");
    emptyLi.className = "empty";
    emptyLi.textContent = "No tasks yet";
    listContainer.appendChild(emptyLi);
    updateCounter();
    return;
  }

  // For each task create an li with checkbox, text and delete button
  todo.forEach((task) => {
    const li = document.createElement("li");
    li.className = "task-item";

    // Checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = !!task.done;
    checkbox.setAttribute("aria-label", "mark task done");
    checkbox.addEventListener("change", () => {
      toggleTaskDone(task.id, checkbox.checked);
    });

    // Text
    const span = document.createElement("span");
    span.className = task.done ? "task-text disabled" : "task-text";
    span.textContent = task.text;

    // Delete button
    const delBtn = document.createElement("button");
    delBtn.className = "del-btn";
    delBtn.textContent = "Delete";
    delBtn.addEventListener("click", () => deleteTask(task.id));

    // append to li then to container
    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(delBtn);

    listContainer.appendChild(li);
  });

  updateCounter();
}

// --- add task ---
function addTask() {
  const newTask = todoInput.value.trim();
  if (!newTask) return; // ignore empty

  todo.push({
    id: Date.now(),
    text: newTask,
    done: false,
  });

  saveToLocalStorage();
  todoInput.value = "";
  displayTasks();
}

// --- toggle done ---
function toggleTaskDone(id, done) {
  const idx = todo.findIndex((t) => t.id === id);
  if (idx === -1) return;
  todo[idx].done = done;
  saveToLocalStorage();
  displayTasks();
}

// --- delete single task ---
function deleteTask(id) {
  todo = todo.filter((t) => t.id !== id);
  saveToLocalStorage();
  displayTasks();
}

// --- delete all tasks ---
function deleteAllTasks() {
  if (!todo.length) return;
  if (!confirm("Delete all tasks?")) return;
  todo = [];
  saveToLocalStorage();
  displayTasks();
}

// --- event wiring ---
// DOMContentLoaded not strictly necessary because you use `defer`, but safe to keep:
document.addEventListener("DOMContentLoaded", () => {
  // Add task via button
  if (addButton) addButton.addEventListener("click", addTask);

  // Add task via Enter key
  if (todoInput) {
    todoInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        addTask();
      }
    });
  }

  // Delete all (note: your button has class="deleteButton")
  if (deleteAllButton) deleteAllButton.addEventListener("click", deleteAllTasks);

  // Render initial tasks
  displayTasks();
});
