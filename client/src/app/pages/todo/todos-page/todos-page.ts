import { Component, inject, OnInit } from '@angular/core';
import { TodoListComponent } from "../../../components/todo/todo-list/todo-list.component";
import { TodoStateService } from '../../../components/todo/todo-state.service';
import { TodoUtils } from '../../../components/todo/todo.utils';
import { PopupService } from '../../../components/common-ui/popup/popup.service';

@Component({
  selector: 'app-todos-page',
  standalone: true,
  imports: [TodoListComponent],
  templateUrl: './todos.page.html',
  styleUrl: './todos.page.css'
})
export class TodosPage implements OnInit {
  private todoService = inject(TodoStateService);
  private popupService = inject(PopupService);

  ngOnInit(): void {
    this.todoService.loadTodos();
  }

  addTodo(title: string) {
    const valid = TodoUtils.validateTitle(title);
    
    if(!valid) {
      this.popupService.push({
        color: 'orange',
        header: 'Validation failed',
        text: 'Todo must have title' 
      });
      return;
    }
    
    const todo = TodoUtils.createTodo(title);
    this.todoService.addTodo(todo);
  }
}
