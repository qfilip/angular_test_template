import { computed, effect, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  
  private callCount$ = signal<number>(0);
  private _$isLoading = signal<boolean>(false);
  protected $message = signal<string>('');
  $isLoading = this._$isLoading.asReadonly();

  constructor() {
    effect(() => {
      const cc = this.callCount$();
      
      if(cc > 0) {
        this._$isLoading.set(true);
      }
      else if(cc === 0) {
        this._$isLoading.set(false);
      }
      else if(cc < 0) {
        this.callCount$.set(0);
      }
    });
  }

  show(message: string = 'Working...') {
    this.callCount$.update(x => x + 1);
  }

  hide() {
    this.callCount$.update(x => x - 1);
  }
}