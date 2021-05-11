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