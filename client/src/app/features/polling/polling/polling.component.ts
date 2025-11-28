import { Component, effect, inject, OnInit } from '@angular/core';
import { PollingService } from '../polling.service';
import { PopupService } from '../../common-ui/services/popup.service';

@Component({
  selector: 'app-polling',
  imports: [],
  templateUrl: './polling.component.html',
  styleUrl: './polling.component.css'
})
export class PollingComponent {
  service = inject(PollingService);
  popup = inject(PopupService);
  constructor() {
    this.service.startPolling(3);
    effect(() => {
      const x = this.service.$data();
      // this.popup.showInfo(`Polled data updated. Total items: ${x.length}`);
    })
  }
}
