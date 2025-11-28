import { Component, effect, inject, OnDestroy, OnInit } from '@angular/core';
import { PollingService } from '../polling.service';
import { PopupService } from '../../common-ui/services/popup.service';

@Component({
  selector: 'app-polling',
  imports: [],
  templateUrl: './polling.component.html',
  styleUrl: './polling.component.css'
})
export class PollingComponent implements OnInit, OnDestroy {
  service = inject(PollingService);
  popup = inject(PopupService);

  constructor() {
    this.service.startPolling(1000);
    effect(() => {
      const time = this.service.$time();
      this.popup.info(`time is: ${time}`);
    })
  }
  
  ngOnInit(): void {
    
  }

  ngOnDestroy(): void {
    this.service.stopPolling();
  }
}
