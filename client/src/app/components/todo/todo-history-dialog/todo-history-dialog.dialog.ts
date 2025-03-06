import { DatePipe } from '@angular/common';
import { Component, inject, signal, ViewChild } from '@angular/core';

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
  @ViewChild('wrapper') private wrapper!: DialogWrapperComponent;

  private todoService = inject(TodoStateService);
  private _$todoHistory = signal<TodoHistory[]>([]);
  $todoHistory = this._$todoHistory.asReadonly();

  open(x: Todo) {
    const events = this.todoService.getTodoEvents();
    const history = TodoUtils.mapTodoHistoryFromEvents(events, x);
    this._$todoHistory.set(history) ;
    this.wrapper.open();
  }
}
