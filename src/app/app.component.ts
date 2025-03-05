import { Component } from '@angular/core';
import { ScratchpadComponent } from "./components/scratchpad/scratchpad.component";
import { LoaderComponent } from "./components/common-ui/loader/loader.component";
import { DialogWrapperComponent } from './components/common-ui/dialog-wrapper/dialog-wrapper.component';
import { SimpleDialogComponent } from './components/common-ui/simple-dialog/simple-dialog.component';

@Component({
  selector: 'app-root',
  imports: [ScratchpadComponent, LoaderComponent, SimpleDialogComponent, DialogWrapperComponent],
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  
}
