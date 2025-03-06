import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { DialogWrapperComponent } from "../../common-ui/dialog-wrapper/dialog-wrapper.component";
import { Todo } from '../todo.models';
import { TodoStateService } from '../todo-state.service';

@Component({
  selector: 'app-todo-title-dialog',
  imports: [DialogWrapperComponent],
  templateUrl: './todo-title.dialog.html',
  styleUrl: './todo-title.dialog.css'
})
export class TodoTitleDialog {
  @ViewChild('wrapper') wrapper!: DialogWrapperComponent;
  @ViewChild('todoTitle') todoTitle!: ElementRef<HTMLInputElement>;

  private todoService = inject(TodoStateService);
  private todo!: Todo;
  title = '';

  open = (x: Todo) => {
    this.todo = {...x};
    this.title = x.title;
    this.wrapper.open();
  }

  close = () => this.wrapper.close();

  edit() {
    const newName = this.todoTitle.nativeElement.value;
    this.todoService.updateTodoTitle(this.todo, newName);
    this.wrapper.close();
  }
}
