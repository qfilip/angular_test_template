import { Injectable, signal } from '@angular/core';
import { Observable, Subject, switchMap, takeUntil, timer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PollingService {
  $time = signal<Date | null>(null);
  private unsubscribe$ = new Subject();

  startPolling(timeInterval: number) {
    return timer(0, timeInterval)
    .pipe(
      switchMap(() => this.callTimeApiService()),
      takeUntil(this.unsubscribe$),
    )
    .subscribe({
      next: (x) => this.$time.set(x)
    });
  }

  stopPolling() {
    this.unsubscribe$.next(1);
  }

  private callTimeApiService() {
    return new Observable<Date>(obs => {
      const fakeDelay = setTimeout(() => {
        obs.next(new Date());
        obs.complete();
        clearTimeout(fakeDelay);
      }, Math.random() * 1000);
    });
  }
}
