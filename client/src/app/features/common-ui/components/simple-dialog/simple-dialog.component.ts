import { Component, effect, ElementRef, inject, signal, ViewChild } from '@angular/core';

import { DialogOptions } from '../../models/dialog-options.model';
import { DialogService } from '../../services/dialog.service';

@Component({
  selector: 'app-simple-dialog',
  imports: [],
  templateUrl: './simple-dialog.component.html',
  styleUrl: './simple-dialog.component.css'
})
export class SimpleDialogComponent {
  @ViewChild('dialog') private dialog!: ElementRef<HTMLDialogElement>;
  private service = inject(DialogService);

  protected $options = signal<DialogOptions | null>(null);

  constructor() {
    effect(() => {
      const opts = this.service.$dialogOptions();
      this.$options.set(opts);

      if(!this.dialog) return;
      
      const action = opts !== null
        ? () => this.dialog.nativeElement.showModal()
        : () => this.dialog.nativeElement.close();

      action();
    });
  }
  
  onButtonClicked(btnAction: () => void) {
    btnAction();
    this.service.close();
  }
}
