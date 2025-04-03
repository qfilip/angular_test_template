import { Component, computed, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { Todo } from '../../models/todo.models';
import { DialogWrapperComponent } from '../../../common-ui/components/dialog-wrapper/dialog-wrapper.component';
import { PopupService } from '../../../common-ui/services/popup.service';
import { TodoStateService } from '../../services/todo-state.service';
import { TodoModelUtils } from '../../utils/todo.model.utils';
import { TodoUtils } from '../../utils/todo.utils';

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
