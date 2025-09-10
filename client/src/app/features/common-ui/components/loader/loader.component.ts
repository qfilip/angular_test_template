import { Component, effect, inject, signal } from '@angular/core';

import { LoaderService } from '../../services/loader.service';

@Component({
  standalone: true,
  selector: 'app-loader',
  imports: [],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.css'
})
export class LoaderComponent {
  private service = inject(LoaderService);
  private _$message = signal<string>('loading...');

  $visible = this.service.$isLoading();
  $message = this._$message.asReadonly();
}
