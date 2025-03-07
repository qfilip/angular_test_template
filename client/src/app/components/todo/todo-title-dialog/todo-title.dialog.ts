import { Component, computed, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { DialogWrapperComponent } from "../../common-ui/dialog-wrapper/dialog-wrapper.component";
import { Todo } from '../todo.models';
import { TodoStateService } from '../todo-state.service';
import { TodoUtils } from '../todo.utils';
import { PopupService } from '../../common-ui/popup/popup.service';

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
    const valid = TodoUtils.validateTitle(newTitle);

    if(!valid) {
      this.popupService.push({
        color: 'orange',
        header: 'Validation failed',
        text: 'Todo must have title' 
      });
      return;
    }

    this.todoService.updateTodoTitle(this._$todo()!, newTitle);
    this.wrapper.close();
  }
}
