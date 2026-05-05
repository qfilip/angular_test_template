import { inject, Injectable } from '@angular/core';
import { Resource } from './resource.model';
import { LoaderService } from '../common-ui/services/loader.service';
import { defer, finalize, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ResourceApiService {
  private url = 'http://localhost:5000';
  private http = inject(HttpClient);

  get(showLoader = true) {
    return this.http
      .get<Resource[]>(this.url)
      .pipe(this.pageLoader(showLoader));
  }

  put(resource: Resource, showLoader = true) {
    return this.http
      .put<Resource>(this.url, resource)
      .pipe(this.pageLoader(showLoader));
  }

  protected loader = inject(LoaderService);
  protected pageLoader =
    <T>(show = true) =>
    (source: Observable<T>): Observable<T> => {
      const hide = () => {
        if (show) this.loader.hide();
      };

      return defer(() => {
        if (show) this.loader.show();
        return source.pipe(finalize(hide));
      });
    };
}
