import { Component, computed, effect, ElementRef, inject, Renderer2, ViewChild } from '@angular/core';
import { Popup } from './popup.model';
import { PopupService } from './popup.service';

@Component({
  selector: 'app-popup',
  imports: [],
  templateUrl: './popup.component.html',
  styleUrl: './popup.component.css'
})
export class PopupComponent {
  @ViewChild('popupContainer') private popupContainer!: ElementRef<HTMLElement>;

  private renderer = inject(Renderer2);
  private service = inject(PopupService);

  constructor() {
    effect(() => {
      const payload = this.service.$popup();
      payload ? this.render(payload.x, payload.duration) : () => { };
    })
  }

  private render(x: Popup, duration: number) {
    const header = this.renderer.createElement('h1');
    const headerText = this.renderer.createText(x.header);
    this.renderer.appendChild(header, headerText);

    const text = this.renderer.createElement('p');
    const messageText = this.renderer.createText(x.text);
    this.renderer.appendChild(text, messageText);

    const box = this.renderer.createElement('section');
    this.renderer.addClass(box, x.color);
    this.renderer.appendChild(box, header);
    this.renderer.appendChild(box, text);

    const div = this.renderer.createElement('div');
    this.renderer.appendChild(div, box);

    this.renderer.appendChild(this.popupContainer.nativeElement, div);

    setTimeout(() => {
      this.renderer.setStyle(div, 'opacity', '0');
      setTimeout(() => {
        this.renderer.removeChild(this.popupContainer.nativeElement, div);
      }, duration / 3);
    }, duration);
  }
}