import { Component, computed, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { DialogWrapperComponent } from "../../common-ui/dialog-wrapper/dialog-wrapper.component";
import { Todo } from '../todo.models';
import { TodoStateService } from '../todo-state.service';
import { TodoUtils } from '../todo.utils';
import { PopupService } from '../../common-ui/popup/popup.service';
import { TodoModelUtils } from '../todo.model.utils';

@Component({
  selector: 'app-todo-title-dialog',
  imports: [DialogWrapperComponent],
  templateUrl: './todo-title.dialog.html',
  styleUrl: './todo-title.dialog.css'
})
export class TodoTitleDialog {
  @ViewChild('wrapper') private wrapper!: DialogWrapperComponent;
  @ViewChild('todoTitle') private todoTitle!: ElementRef<HTMLInputElement>;

  private todoService = inject(TodoStateService);
  private popupService = inject(PopupService);
  
  private _$todo = signal<Todo | null>(null);
  $title = computed(() => this._$todo()?.title);

  open = (x: Todo) => {
    this._$todo.set({...x});
    this.wrapper.open();
  }

  close = () => this.wrapper.close();

  edit() {
    const newTitle = this.todoTitle.nativeElement.value;
    const todo = TodoUtils.createTodo(newTitle);
    const errors = TodoModelUtils.validate(todo);
    
    if(errors.length > 0) {
      TodoModelUtils.printErrors(this.popupService, errors);
      return;
    }

    this.todoService.updateTodoTitle(this._$todo()!, newTitle);
    this.wrapper.close();
  }
}
