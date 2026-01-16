import { computed, effect, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  
  private callCount$ = signal<number>(0);
  protected $message = signal<string>('');
  readonly $isLoading = signal<boolean>(false);

  constructor() {
    effect(() => {
      const cc = this.callCount$();
      
      if(cc > 0) {
        this.$isLoading.set(true);
      }
      else if(cc === 0) {
        this.$isLoading.set(false);
      }
      else if(cc < 0) {
        console.log('oops');
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