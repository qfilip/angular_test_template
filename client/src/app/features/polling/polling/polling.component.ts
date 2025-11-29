import { Component, effect, inject, OnDestroy, OnInit } from '@angular/core';
import { PollingService } from '../polling.service';
import { PopupService } from '../../common-ui/services/popup.service';

@Component({
  selector: 'app-polling',
  imports: [],
  templateUrl: './polling.component.html',
  styleUrl: './polling.component.css'
})
export class PollingComponent implements OnDestroy {
  service = inject(PollingService);
  popup = inject(PopupService);

  constructor() {
    effect(() => {
      const time = this.service.$time();
      if(!time) return;
      this.popup.info(`time is: ${time}`);
    })
  }
  
  start() {
    this.popup.ok(`We're polling`, 'Started');
    this.service.startPolling(1000);
  }
  end() {
    this.popup.warn(`We're not polling`, 'Ended');
    this.service.stopPolling();
  }

  ngOnDestroy(): void {
    this.service.stopPolling();
  }
}
