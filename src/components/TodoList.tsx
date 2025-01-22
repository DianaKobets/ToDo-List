import React, { useState } from "react";
import { useObserver } from "mobx-react-lite";
import { PlusOutlined, CloseOutlined, CheckOutlined } from '@ant-design/icons';
import { CSSTransition, TransitionGroup } from 'react-transition-group'; 
import todoStore from "../store/todoStore.ts";
import '../components/TodoList.css';

const TodoList = () => {
  const [newTodo, setNewTodo] = useState<string>("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedTodo, setEditedTodo] = useState<string>("");

  const handleAddTodo = () => {
    if (newTodo.trim() !== "") {
      todoStore.addTodoItem(newTodo);
      setNewTodo("");
    }
  };

  const handleSaveEdit = (index) => {
    if (editedTodo.trim() !== "") {
      todoStore.updateTodoItem(index, editedTodo);
    }
    setEditingIndex(null);
    setEditedTodo("");
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditedTodo("");
  };

  return useObserver(() => (
    <div className="todo-list-container">
      <h1>todos</h1>

      <div className="todo-input">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Добавьте новую задачу"
        />
        <button onClick={handleAddTodo} data-testid="add-button">
          <PlusOutlined />
        </button>

      </div>

      <TransitionGroup component="ul">
        {todoStore.filteredTodos.map((todo, index) => (
          <CSSTransition key={index} timeout={500} classNames="todo-item">
            <li>
              {editingIndex === index ? (
                <div className="edit-mode">
                  <input
                    type="text"
                    value={editedTodo}
                    onChange={(e) => setEditedTodo(e.target.value)}
                    placeholder="Изменить задачу"
                  />
                  <button onClick={() => handleSaveEdit(index)}>Сохранить</button>
                  <button onClick={handleCancelEdit}>Отмена</button>
                </div>
              ) : (
                <div className="view-mode">
                  <p style={{ textDecoration: todo.completed ? "line-through" : "none" }}>
                    {todo.text}
                  </p>
                  <div className="buttons">
                    <button  data-testid={`done-button-${index}`} onClick={() => todoStore.completeTodoItem(index)} className="btn-green" >
                      <CheckOutlined />
                    </button>
                    <button onClick={() => {
                      setEditingIndex(index);
                      setEditedTodo(todo.text);
                    }} className="btn-edit">
                      ✎
                    </button>
                    <button data-testid={`close-button-${index}`} onClick={() => todoStore.removeTodoItem(index)} className="btn-red">
                      <CloseOutlined />
                    </button>
                  </div>
                </div>
              )}
            </li>
          </CSSTransition>
        ))}
      </TransitionGroup>

      <footer className="actions">
        <div className="items-counter">{todoStore.todos?.length || 0} задач осталось</div>
        <button onClick={() => todoStore.showAll()}>Все</button>
        <button onClick={() => todoStore.showActive()}>Активные</button>
        <button onClick={() => todoStore.showCompleted()}>Выполненные</button>
        <button onClick={() => todoStore.clearCompleted()}>Очистить выполненные</button>
      </footer>
    </div>
  ));
};

export default TodoList;
