import { inject, Injectable, signal } from '@angular/core';
import { Resource } from './resource.model';
import { ResourceApiService } from './resource-api.service';
import { debounce, delay, Observable, of, Subject, takeUntil, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ResourceStateService {
  private apiService = inject(ResourceApiService);
  private _$resources = signal<Resource[]>([]);
  $resources = this._$resources.asReadonly();

  get(showLoader = true) {
    return this.apiService
      .get(showLoader)
      .pipe(tap((xs) => this._$resources.set(xs)));
  }

  put(id: number, showLoader = true) {
    return this.apiService
      .put({ id } satisfies Resource, showLoader)
      .pipe(tap((x) => this._$resources.update((xs) => xs.concat(x))));
  }
}
