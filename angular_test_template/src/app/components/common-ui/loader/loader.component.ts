import { Component, effect, inject } from '@angular/core';
import { LoaderService } from '../loader.service';

@Component({
  selector: 'app-loader',
  imports: [],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.css'
})
export class LoaderComponent {
  private service = inject(LoaderService)
  
  constructor() {
    effect(() => this.visible = this.service.isLoading());
    effect(() => this.message = this.service.message());
  }
  
  visible = false;
  message = 'Loading...';
}
