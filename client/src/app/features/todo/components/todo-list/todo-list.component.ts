import { Component, computed, inject, input, ViewChild } from '@angular/core';

import { TodoTitleDialog } from '../todo-title-dialog/todo-title.dialog';
import { Todo } from '../../models/todo.models';
import { DialogOptions } from '../../../common-ui/models/dialog-options.model';
import { DialogService } from '../../../common-ui/services/dialog.service';
import { TodoStateService } from '../../services/todo-state.service';
import { TodoHistoryDialog } from '../todo-history-dialog/todo-history-dialog.dialog';

@Component({
  selector: 'app-todo-list',
  imports: [TodoTitleDialog, TodoHistoryDialog],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.css'
})
export class TodoListComponent {
  @ViewChild('todoTitleDialog') todoTitleDialog!: TodoTitleDialog;
  @ViewChild('todoHistoryDialog') todoHistoryDialog!: TodoHistoryDialog;

  private todoService = inject(TodoStateService);
  private dialogService = inject(DialogService);

  $display = input.required<'all' | 'pending' | 'completed'>();
  $todos = computed(() => {
    const display = this.$display();
    const todos = this.todoService.$todos();

    switch(display) {
      case 'all': return todos;
      case 'pending': return todos.filter(x => !x.completed);
      case 'completed': return todos.filter(x => x.completed);
      default: throw `Case '${display}' not covered`;
    }
  });

  toggleCompleted(x: Todo) {
    this.todoService.toggleTodoCompleted(x);
  }

  updateTitle(x: Todo) {
    this.todoTitleDialog.open(x);
  }

  viewHistory(x: Todo) {
    this.todoHistoryDialog.open(x);
  }

  deleteTodo(x: Todo) {
    this.dialogService.open({
      header: 'Delete',
      message: 'Are you sure you want to proceed?',
      buttons: [
        {
          label: 'Yup',
          class: 'green',
          action: () => {
            this.todoService.deleteTodo(x);
          }
        },
        {
          label: 'Hell no!',
          class: 'red'
        }
      ]
    } as DialogOptions);
  }
}
