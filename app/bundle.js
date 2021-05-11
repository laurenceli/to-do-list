(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const ToDoList = require('./todoList.js');
const ToDoItem  = require('./todoItem.js');

const todoForm = document.querySelector('.todo-form');
const todoInputArray = document.getElementById("todo-form").elements;
const todoItemsList = document.querySelector('.todo-items');
const todoSwimlane = document.querySelector('.todo-items');
const pendingSwimlane = document.querySelector('.in-progress-items');
const completedSwimlane = document.querySelector('.completed-items');
const todosContainer = document.querySelector('.todos-container');
const modal = document.getElementById("myModal");
const btn = document.getElementById("myBtn");
const span = document.getElementsByClassName("close")[0];
const modalInputArray = document.getElementById("modal-form").elements;
const modalForm = document.querySelector('.modal-form');

let toDoList = new ToDoList([]);
let currentlyEditingId;

todoForm.addEventListener('submit', function(event){
  event.preventDefault();
  if (event.target.classList.contains('todo-form')) {
    addToDoOnSubmit();
  }
});

modalForm.addEventListener('submit', function(event){
  event.preventDefault();
  if (event.target.classList.contains('modal-form')) {
    editToDoOnSubmit();
  }
});

todosContainer.addEventListener('click', function(event) {
  if (event.target.classList.contains('delete-button')) {
    deleteItemOnClick();
    addToLocalStorage(toDoList);
  }

  if (event.target.classList.contains('edit-button')) {
    editItemOnClick();
    addToLocalStorage(toDoList);
  }
});

getFromLocalStorage();

function addToDoOnSubmit(){
  const formInputs = parseThenClearInputForm();
  const toDoItem = generateNewToDoItem(formInputs);

  toDoList.addItem(toDoItem);
  console.log(toDoItem)

  //renderTodos(toDoList);
  addToLocalStorage(toDoList);
}

function parseThenClearInputForm(){
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
  addToLocalStorage(toDoList);
}

function parseThenClearEditForm(){
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

function addToLocalStorage(toDoList) {
  console.log(`Saving to local: ${JSON.stringify(toDoList)}`);
  localStorage.setItem('todos', JSON.stringify(toDoList));
  console.log(`Rendering: ${JSON.stringify(toDoList)}`);
  renderTodos(toDoList);
}

function getFromLocalStorage() {
  const reference = localStorage.getItem('todos');
  console.log(`Getting from local: ${JSON.stringify(reference)}`);
  if (reference) {
    toDoList = new ToDoList(JSON.parse(reference).todoItems)
    console.log(`Rendering: ${JSON.stringify(toDoList)}`);
    renderTodos(toDoList);
  }
}

function renderTodos(toDoList) {
  todoItemsList.innerHTML = '';
  pendingSwimlane.innerHTML = '';
  completedSwimlane.innerHTML = '';
  toDoList.todoItems.forEach(function(item) {
    const li = document.createElement('li');
    li.setAttribute('class', 'item');
    li.setAttribute('data-key', item.id);

    switch(item.status) {
      case 'To Do': 
      case 'todo':
        li.innerHTML = `
          <div class="todo-title">${item.title}</div>
          <div class="todo-description">${item.description}</div>
          <div class="todo-due-date">${item.dueDate}</div>
          <button class="edit-button todo-button">...</button>
          <button class="delete-button todo-button">X</button>
        `;
        todoItemsList.append(li);
      break;
      case 'inprogress': 
        li.innerHTML = `
          <div class="todo-title">${item.title}</div>
          <div class="todo-description">${item.description}</div>
          <div class="todo-due-date">${item.dueDate}</div>
          <button class="edit-button todo-button">...</button>
          <button class="delete-button todo-button">X</button>
        `;
        pendingSwimlane.append(li);
      break;
      case 'done':
        li.innerHTML = `
          <div class="todo-title">${item.title}</div>
          <div class="todo-description">${item.description}</div>
          <div class="todo-due-date">${item.dueDate}</div>
          <button class="edit-button todo-button">...</button>
          <button class="delete-button todo-button">X</button>
        `;
        completedSwimlane.append(li);
    }
  });
}

function deleteItemOnClick(){
    const itemId = event.target.parentElement.getAttribute('data-key');
    toDoList.deleteItem(itemId);
}

function editItemOnClick(){
  populateModal();
  modal.style.display = "block";
}

function populateModal(){
  const itemId = event.target.parentElement.getAttribute('data-key');
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
},{"./todoItem.js":2,"./todoList.js":3}],2:[function(require,module,exports){
// item class 
class ToDoItem {
	constructor(item){
		this.id = item.id;
		this.title = item.title;
		this.description = item.description;
		this.status = item.status;
		this.dueDate = item.dueDate;
	}

	editToDoItem(item){
		this.id = item.id;
		this.title = item.title;
		this.description = item.description;
		this.status = item.status;
		this.dueDate = item.dueDate;
	}

	setStatusDone(){
		this.status = 'done'
	}

	setStatusInProgress(){
		this.status = 'inprogress'
	}

	setStatusTodo(){
		this.status = 'todo'
	}
}

module.exports = ToDoItem;
},{}],3:[function(require,module,exports){
// to do list
class ToDoList {
	constructor(items){
		this.todoItems = items;
	}

	addItem(item){
	  if (item) {
	    this.todoItems.push(item);
	  }
	  else {
	  	throw new Error('Expected todoItem');
	  }
	}

	deleteItem(id){
		this.todoItems.splice(ToDoList.getIndexById(this.todoItems, id), 1);
	}

	getItemById(id){
		return this.todoItems[ToDoList.getIndexById(this.todoItems, id)];
	}

	static getIndexById(todos, id){
		let targetIndex = -1;
		const todoItems = todos;
		const listLength = todoItems.length;
		for(let i = 0; i < listLength; i++){
			const item = todoItems[i];
			if(item.id == id){
				targetIndex = i;
			}
		}
		return targetIndex;
	}
}

module.exports = ToDoList;
},{}]},{},[1]);
