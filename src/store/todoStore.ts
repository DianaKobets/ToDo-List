import { makeAutoObservable } from "mobx";

interface TodoItem {
  text: string;
  completed: boolean;
}

class TodoStore {
  todos: TodoItem[] = [];
  filter: 'all' | 'active' | 'completed'  = 'all';

  constructor() {
    makeAutoObservable(this);
  }

  addTodoItem(text: string) {
    this.todos.push({ text, completed: false });
  }

  removeTodoItem(index: number) {
    this.todos.splice(index, 1);
  }

  updateTodoItem(index: number, newText: string) {
    this.todos[index].text = newText;
  }

  completeTodoItem(index: number) {
    this.todos[index].completed = true;
}


  showAll() {
    this.filter = "all";
  }

  showActive() {
    this.filter = "active";
  }

  showCompleted() {
    this.filter = "completed";
  }

  get filteredTodos() {
    if (this.filter === "active") {
        return this.todos.filter((todo) => !todo.completed);
    }
    if (this.filter === "completed") {
        return this.todos.filter((todo) => todo.completed);
    }
    return this.todos; 
}

  clearCompleted(){
    this.todos = this.todos.filter((todo) => !todo.completed);
  }
}

const todoStore = new TodoStore();
export default todoStore;
