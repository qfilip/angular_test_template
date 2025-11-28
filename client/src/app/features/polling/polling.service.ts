import { Injectable, signal } from '@angular/core';
import { delay, EMPTY, expand, from, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PollingService {
  $data = signal<string[]>([]);

  startPolling(times: number) {
    let count = 0;
    from([1,2,3])
    .pipe(
      delay(1000),
      tap(_ => count++),
      expand((x, _) => {
        if(count === times) return EMPTY;
        return of(x);
      })
    ).subscribe({
      next: (value) => this.$data.update(data => [...data, `Polled value: ${value} at ${new Date().toLocaleTimeString()}`]),
    })
  }
}
