import { Component, effect, inject, signal } from '@angular/core';

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
  private _$options = signal<DialogOptions | null>(null);

  $options = this._$options.asReadonly();

  constructor() {
    effect(() => this._$options.set(this.service.$dialogOptions()))
  }
  
  onButtonClicked(btnAction: () => void) {
    btnAction();
    this.service.close();
  }
}
