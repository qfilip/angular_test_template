import { Component, inject, OnInit } from '@angular/core';
import { PopupService } from '../../../common-ui/services/popup.service';
import { TodoListComponent } from '../../components/todo-list/todo-list.component';
import { TodoStateService } from '../../services/todo-state.service';
import { TodoModelUtils } from '../../utils/todo.model.utils';
import { TodoUtils } from '../../utils/todo.utils';

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
