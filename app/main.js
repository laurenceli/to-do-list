const ToDoList = require('./todoList.js');
const ToDoItem  = require('./todoItem.js');

const modal = document.getElementById("modal-container");
const span = document.getElementsByClassName("close")[0];

let toDoList = new ToDoList([]);
let currentlyEditingId;

const todoForm = document.querySelector('.todo-form');
todoForm.addEventListener('submit', function(event){
  event.preventDefault();
  if (event.target.classList.contains('todo-form')) {
    addToDoOnSubmit();
  }
});

const modalForm = document.querySelector('.modal-form');
modalForm.addEventListener('submit', function(event){
  event.preventDefault();
  if (event.target.classList.contains('modal-form')) {
    editToDoOnSubmit();
  }
});

const todosContainer = document.querySelector('.todos-container');
todosContainer.addEventListener('click', function(event) {
  if (event.target.classList.contains('delete-button')) {
    deleteItemOnClick();
    addToStorageAndRender(toDoList);
  }

  if (event.target.classList.contains('edit-button')) {
    editItemOnClick();
    addToStorageAndRender(toDoList);
  }
});

getStoredListAndRender();

function addToDoOnSubmit(){
  const formInputs = parseThenClearInputForm();
  const toDoItem = generateNewToDoItem(formInputs);

  toDoList.addItem(toDoItem);

  addToStorageAndRender(toDoList);
}

function parseThenClearInputForm(){
  const todoInputArray = document.getElementById("todo-form").elements;
  let formValues = [];

  // [length - 1] because last element is the button
  for(let i = 0; i < todoInputArray.length - 1; i++){ 
    formValues.push(todoInputArray[i].value);
    todoInputArray[i].value = '';
  }
  return formValues;
}

function generateNewToDoItem(inputs) {
  const toDoItemTemplate = {
    id: Date.now(),
    status: 'To Do',
    title: inputs[0],
    description: inputs[1],
    dueDate: inputs[2],
  };
  const toDoItem = new ToDoItem(toDoItemTemplate);
  return toDoItem;
}

function editToDoOnSubmit(){
  const formInputs = parseThenClearEditForm();
  editToDoItem(formInputs);
  addToStorageAndRender(toDoList);
}

function parseThenClearEditForm(){
  const modalInputArray = document.getElementById("modal-form").elements;
  let formValues = [];
  // [length - 1] because last element is the button
  for(let i = 0; i < modalInputArray.length - 1; i++){ 
    formValues.push(modalInputArray[i].value);
    modalInputArray[i].value = '';
    modal.style.display = "none";
  }
  return formValues;
}

function editToDoItem(inputs){
  const editedItem = {
    id: currentlyEditingId,
    status: inputs[3],
    title: inputs[0],
    description: inputs[1],
    dueDate: inputs[2],
  }
  toDoList.deleteItem(currentlyEditingId);
  toDoList.addItem(editedItem);
  currentlyEditingId = '';
}

function addToStorageAndRender(toDoList) {
  localStorage.setItem('todos', JSON.stringify(toDoList));
  renderTodos(toDoList);
}

function getStoredListAndRender() {
  const reference = localStorage.getItem('todos');
  if (reference) {
    toDoList = new ToDoList(JSON.parse(reference).todoItems)
    renderTodos(toDoList);
  }
}

function renderTodos(toDoList) {
  const todoSwimlane = document.querySelector('.todo-items');
  const pendingSwimlane = document.querySelector('.in-progress-items');
  const completedSwimlane = document.querySelector('.completed-items');

  todoSwimlane.innerHTML = '';
  pendingSwimlane.innerHTML = '';
  completedSwimlane.innerHTML = '';

  toDoList.todoItems.forEach(function(item) {
    const listItem = document.createElement('li');
    listItem.setAttribute('class', 'item');
    listItem.setAttribute('data-id', item.id);

    const todoHtml = `
      <div class="todo-title">${item.title}</div>
      <div class="todo-description">${item.description}</div>
      <div class="todo-due-date">${item.dueDate}</div>
      <button class="edit-button todo-button">...</button>
      <button class="delete-button todo-button">X</button>
    `;
    listItem.innerHTML = todoHtml

    switch(item.status) {
      case 'To Do': 
      case 'todo':
        todoSwimlane.append(listItem);
      break;
      case 'inprogress': 
        pendingSwimlane.append(listItem);
      break;
      case 'done':
        completedSwimlane.append(listItem);
    }
  });
}

function deleteItemOnClick(){
    const itemId = event.target.parentElement.getAttribute('data-id');
    toDoList.deleteItem(itemId);
}

function editItemOnClick(){
  populateModal();
  modal.style.display = "block";
}

function populateModal(){
  const modalInputArray = document.getElementById("modal-form").elements;
  const itemId = event.target.parentElement.getAttribute('data-id');
  const item = toDoList.getItemById(itemId);
  modalInputArray[0].value = item.title;
  modalInputArray[1].value = item.description;
  modalInputArray[2].value = item.dueDate;
  modalInputArray[3].value = item.status;
  currentlyEditingId = item.id;
}

span.onclick = function() {
  modal.style.display = "none";
}

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}