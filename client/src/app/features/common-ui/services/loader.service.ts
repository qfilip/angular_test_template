import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private _$isLoading = signal<boolean>(false);
  private _$message = signal<string>('');

  $isLoading = this._$isLoading.asReadonly();
  $message = this._$message.asReadonly();

  private tasks$ = new BehaviorSubject<number>(0);
  private _ = this.tasks$.subscribe({
    next: x => {
      console.log('tasks is', x);
      if(x > 0) {
        this._$isLoading.set(true);
      }
      else if(x === 0) {
        this._$isLoading.set(false);
      }
      else if(x < 0) {
        this.tasks$.next(0);
      }
    }
  });

  show(message: string = 'Working...') {
    this.tasks$.next(this.tasks$.getValue() + 1);
  }

  setMessage(message: string) {
    this._$message.set(message);
  }

  hide() {
    this.tasks$.next(this.tasks$.getValue() - 1);
  }
}