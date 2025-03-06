import { Component, inject, OnInit } from '@angular/core';
import { LoaderComponent } from "./components/common-ui/loader/loader.component";
import { SimpleDialogComponent } from './components/common-ui/simple-dialog/simple-dialog.component';
import { TodoListComponent } from "./components/todo/todo-list/todo-list.component";
import { TodoUtils } from './components/todo/todo.utils';
import { CommonModule } from '@angular/common';
import { TodoStateService } from './components/todo/todo-state.service';
import { DialogWrapperComponent } from "./components/common-ui/dialog-wrapper/dialog-wrapper.component";
import { TodosPage } from "./pages/todo/todos-page/todos-page";

@Component({
  selector: 'app-root',
  imports: [CommonModule, LoaderComponent, SimpleDialogComponent, TodosPage],
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  
}
