const apiKey = "db504b8c-dc26-446f-8fbe-8f50a290069e";
const apiUrl = "https://js1-todo-api.vercel.app/api/todos";
const url = `${apiUrl}?apikey=${apiKey}`;

// Selectors
const todoInput = document.querySelector(".todo-input");
const todoButton = document.querySelector(".todo-button");
const todoList = document.querySelector(".todo-list");

// Event Listeners
todoButton.addEventListener("click", addTodo);
todoList.addEventListener("click", deleteCheck);

getTodosFromApi();

function getTodosFromApi() {
  const getUrl = `https://js1-todo-api.vercel.app/api/todos?apikey=db504b8c-dc26-446f-8fbe-8f50a290069e`;
  fetch(getUrl)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      displayTodos(data);
    })
    .catch((error) => console.error("Error getting todos", error));

  // console.log(data);
}

function displayTodos(data) {
  data.forEach((todo) => {
    console.log(todo);
    const todoDivElement = document.createElement("div");
    todoDivElement.classList.add("todo");

    const todoLiElement = document.createElement("li");
    todoLiElement.classList.add("todo-item");
    todoLiElement.innerText = todo.title;

    const todoCompleteButtonElement = document.createElement("button");
    todoCompleteButtonElement.classList.add("complete-btn");
    todoCompleteButtonElement.innerHTML = '<i class="fas fa-check"></i>';

    const todoTrashButtonElement = document.createElement("button");
    todoTrashButtonElement.classList.add("trash-btn");
    todoTrashButtonElement.innerHTML = '<i class="fas fa-trash"></i>';

    // Set the id attribute for the todo element
    todoDivElement.setAttribute("data-id", todo._id);

    // Apply the completed class directly
    if (todo.completed) {
      todoLiElement.classList.add("completed");
      todoDivElement.classList.add("completed");
    }

    // Add click event listener to toggle completion state
    todoCompleteButtonElement.addEventListener("click", () => {
      todo.completed = !todo.completed;
      if (todo.completed) {
        todoLiElement.classList.add("completed");
      } else {
        todoLiElement.classList.remove("completed");
      }
    });

    todoDivElement.append(
      todoLiElement,
      todoCompleteButtonElement,
      todoTrashButtonElement
    );
    todoList.insertAdjacentElement("beforeend", todoDivElement);
  });
}

// Get the input element and error div
const errorDiv = document.getElementById("errorDiv");

function setError(message) {
  errorDiv.innerText = message;
  errorDiv.classList.add("error");
  todoInput.classList.add("error");
}

function clearError() {
  errorDiv.innerText = "0";
  errorDiv.classList.remove("error");
  todoInput.classList.remove("error");
}

function addTodo(event) {
  // Prevent form from submitting
  event.preventDefault();

  // Clear any existing error message
  clearError();

  // Check if the input is empty or less than 2 characters
  if (todoInput.value.trim() === "") {
    setError("Todo can't be empty.");
    return;
  } else if (todoInput.value.trim().length < 2) {
    setError("Todo must be at least 2 characters long.");
    return;
  }

  // Todo DIV
  const todoDiv = document.createElement("div");
  todoDiv.classList.add("todo");

  // Create LI
  const newTodo = document.createElement("li");
  newTodo.innerText = todoInput.value;
  newTodo.classList.add("todo-item");
  todoDiv.append(newTodo);

  // CHECK MARK BUTTON
  const completedButton = document.createElement("button");
  completedButton.innerHTML = '<i class="fas fa-check"></i>';
  completedButton.classList.add("complete-btn");
  todoDiv.appendChild(completedButton);

  // CHECK trash BUTTON
  const trashButton = document.createElement("button");
  trashButton.innerHTML = '<i class="fas fa-trash"></i>';
  trashButton.classList.add("trash-btn");
  todoDiv.appendChild(trashButton);

  // APPEND TO LIST
  todoList.appendChild(todoDiv);

  // Clear the input value
  todoInput.value = "";

  // Send POST request to API to add new todo
  addTodoToAPI(newTodo.innerText);
}

function deleteCheck(e) {
  const item = e.target;
  const todo = item.parentElement;
  const todoId = todo.getAttribute("data-id");

  // DELETE TODO
  if (item.classList.contains("trash-btn")) {
    if (!todo.classList.contains("completed")) {
      displayModal();
      console.log("Set item to done before deleteing");
      return;
    }

    // Animation
    todo.classList.add("fall");
    todo.addEventListener("transitionend", function () {
      todo.remove();
    });

    // console.log(todoId);

    // Make DELETE request to API
    deleteTodoFromAPI(todoId);
  }

  // CHECK MARK
  if (item.classList.contains("complete-btn")) {
    const todo = item.parentElement;
    todo.classList.toggle("completed");
    const completed = todo.classList.contains("completed");

    // Send PUT requst to update todo
    updateTodoToCompleted(todoId, completed);
  }
}

// Function to display the modal
function displayModal() {
  const modal = document.querySelector(".modal");
  modal.style.display = "flex";

  const closeButton = document.querySelector(".modal-button");
  closeButton.addEventListener("click", closeModal);
}

// Function to close the modal
function closeModal() {
  const modal = document.querySelector(".modal");
  modal.style.display = "none";
}

document.addEventListener("mousedown", outsideModalClick);

// Function to close the modal when clicking outside
function outsideModalClick(e) {
  const modal = document.querySelector(".modal");

  // Check if the clicked element is outside the modal
  if (!modal.contains(e.target)) {
    closeModal();
  }
}

// Function to send POST request to API to add new todo
function addTodoToAPI(todoText) {
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title: todoText }),
  })
    .then((response) => response.json())
    .then((data) => console.log("New todo added:", data))
    .catch((error) => console.error("Error adding new todo:", error));
}

// Function to send DELETE request to API to delete todo
function deleteTodoFromAPI(todoId) {
  const deleteUrl = `${apiUrl}/${todoId}?apikey=${apiKey}`;

  fetch(deleteUrl, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((data) => console.log("Todo deleted:", data))
    .catch((error) => console.error("Error deleting todo:", error));
}

// Function to send PUT request to API to update todo status to completed
function updateTodoToCompleted(todoId, completed) {
  fetch(`${apiUrl}/${todoId}?apikey=${apiKey}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ completed }),
  })
    .then((response) => response.json())
    .then((data) => console.log("Todo updated:", data))
    .catch((error) => console.error("Error updating todo:", error));
}
