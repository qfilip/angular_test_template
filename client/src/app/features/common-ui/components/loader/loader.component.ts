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

  $visible = this.service.$isLoading;
  protected $message = signal<string>('loading...');
}
