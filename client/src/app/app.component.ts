import { Component, inject } from '@angular/core';
import { LoaderComponent } from "./components/common-ui/loader/loader.component";
import { SimpleDialogComponent } from './components/common-ui/simple-dialog/simple-dialog.component';
import { CommonModule } from '@angular/common';
import { PopupComponent } from "./components/common-ui/popup/popup.component";
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [CommonModule, LoaderComponent, SimpleDialogComponent, RouterOutlet, PopupComponent],
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  router = inject(Router);
}
