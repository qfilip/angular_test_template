import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, defer, finalize } from 'rxjs';
import { LoaderService } from '../../features/common-ui/services/loader.service';
import { PopupService } from '../../features/common-ui/services/popup.service';

@Injectable({
  providedIn: 'root',
})
export class BaseApiService {
  protected apiUrl = 'http://localhost:5000';
  protected http = inject(HttpClient);
  protected popup = inject(PopupService);
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
