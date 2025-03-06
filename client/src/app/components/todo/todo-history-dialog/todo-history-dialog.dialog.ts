import { DatePipe } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';

import { DialogWrapperComponent } from '../../common-ui/dialog-wrapper/dialog-wrapper.component';
import { TodoStateService } from '../todo-state.service';
import { Todo, TodoHistory } from '../todo.models';
import { TodoUtils } from '../todo.utils';

@Component({
  selector: 'app-todo-history-dialog',
  imports: [DialogWrapperComponent, DatePipe],
  templateUrl: './todo-history-dialog.dialog.html',
  styleUrl: './todo-history-dialog.dialog.css'
})
export class TodoHistoryDialog {
  @ViewChild('wrapper') wrapper!: DialogWrapperComponent;

  private todoService = inject(TodoStateService);
  todoHistory: TodoHistory[] = [];

  open(x: Todo) {
    const events = this.todoService.getTodoEvents();
    this.todoHistory = TodoUtils.mapTodoHistoryFromEvents(events, x);
    this.wrapper.open();
  }
}
