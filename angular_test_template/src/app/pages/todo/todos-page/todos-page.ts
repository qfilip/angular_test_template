import { Component, inject, OnInit } from '@angular/core';
import { TodoListComponent } from "../../../components/todo/todo-list/todo-list.component";
import { TodoStateService } from '../../../components/todo/todo-state.service';
import { TodoUtils } from '../../../components/todo/todo.utils';

@Component({
  selector: 'app-todos-page',
  standalone: true,
  imports: [TodoListComponent],
  templateUrl: './todos.page.html',
  styleUrl: './todos.page.css'
})
export class TodosPage implements OnInit {
  todoService = inject(TodoStateService);

  ngOnInit(): void {
    this.todoService.loadTodos();
  }

  addTodo(title: string) {
    const valid = !!title && title.length > 0;
    
    if(!valid) {
      alert('Todo must have title');
      return;
    }
    
    const todo = TodoUtils.createTodo(title);
    this.todoService.addTodo(todo);
  }
}
