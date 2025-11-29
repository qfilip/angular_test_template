import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable, catchError, of, filter, tap } from "rxjs";
import { LoaderService } from "../../features/common-ui/services/loader.service";
import { PopupService } from "../../features/common-ui/services/popup.service";
import { Popup } from "../../features/common-ui/models/popup.model";

@Injectable({
    providedIn: 'root'
})
export class BaseApiService {
    protected apiUrl = 'http://localhost:5000';
    protected http = inject(HttpClient);
    protected popup = inject(PopupService);
    protected loader = inject(LoaderService);

    protected withLoader = <T>(alwaysHide = false) => (source: Observable<T>): Observable<T> => {
      this.loader.show();
      return source.pipe(
          catchError(err => {
              if(err instanceof HttpErrorResponse) {
                const e = err as HttpErrorResponse;
                this.loader.hide();
                if(e.status >= 400 && e.status < 500) {
                  this.popup.warn(e.statusText)
                } else if(e.status > 500) {
                  this.popup.error(e.statusText)
                }
              }
              return of(null);
          }),
          tap(x => {
              if (x) this.loader.hide();
              if(alwaysHide) this.loader.hide();
          }),
          filter(x => x !== null)
      );
  }
}