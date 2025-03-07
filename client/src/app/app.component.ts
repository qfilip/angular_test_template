import { Component } from '@angular/core';
import { LoaderComponent } from "./components/common-ui/loader/loader.component";
import { SimpleDialogComponent } from './components/common-ui/simple-dialog/simple-dialog.component';
import { CommonModule } from '@angular/common';
import { TodosPage } from "./pages/todo/todos-page/todos-page";
import { PopupComponent } from "./components/common-ui/popup/popup.component";
import { ScratchpadComponent } from "./components/scratchpad/scratchpad.component";

@Component({
  selector: 'app-root',
  imports: [CommonModule, LoaderComponent, SimpleDialogComponent, TodosPage, PopupComponent, ScratchpadComponent],
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  
}
