import { Component, inject, OnInit } from '@angular/core';
import { TodoListComponent } from "../../../components/todo/todo-list/todo-list.component";
import { TodoStateService } from '../../../components/todo/todo-state.service';
import { TodoUtils } from '../../../components/todo/todo.utils';
import { PopupService } from '../../../components/common-ui/popup/popup.service';
import { TodoModelUtils } from '../../../components/todo/todo.model.utils';

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
    const todo = TodoUtils.createTodo(title);
    const errors = TodoModelUtils.validate(todo);
    
    if(errors.length > 0) {
      TodoModelUtils.printErrors(this.popupService, errors);
      return;
    }
    
    this.todoService.addTodo(todo);
  }
}
