import { Component, signal } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-dialog-wrapper',
  imports: [],
  templateUrl: './dialog-wrapper.component.html',
  styleUrl: './dialog-wrapper.component.css'
})
export class DialogWrapperComponent {
  private _$visible = signal<boolean>(false);
  $visible = this._$visible.asReadonly();
  
  open() {
    this._$visible.set(true);
  }

  close() {
    this._$visible.set(false);
  }
}
