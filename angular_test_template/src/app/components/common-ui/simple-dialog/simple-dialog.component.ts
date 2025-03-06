import { Component, effect, inject } from '@angular/core';
import { DialogOptions } from '../dialog-options.model';
import { DialogService } from '../dialog.service';

@Component({
  selector: 'app-simple-dialog',
  imports: [],
  templateUrl: './simple-dialog.component.html',
  styleUrl: './simple-dialog.component.css'
})
export class SimpleDialogComponent {
  private service = inject(DialogService);
  
  constructor() {
    effect(() => this.options = this.service.dialogOptions())
  }
  
  options: DialogOptions | null = null;
  
  onButtonClicked(btnAction: () => void) {
    btnAction();
    this.service.close();
  }
}
