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