import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable, catchError, of, filter, tap, from, switchMap } from "rxjs";
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

    private ms = 1000;
    
    test() {
      const promise = from(new Promise<number>((res, rej) => {
        setTimeout(() => res(1), this.ms);
      }));

      const obs = new Observable<number>(obs => {
        setTimeout(() => obs.error('crap observable'), this.ms);
      });

      promise.pipe(
        this.withLoader(),
        switchMap(x => obs.pipe(this.withLoader()))
      ).subscribe({
        error: e => console.log('Subscribed to error: ', e)
      });
    }

    protected withLoader = <T>(alwaysHide = false) => (source: Observable<T>): Observable<T> => {
      this.loader.show();
      return source.pipe(
          catchError(err => {
              console.warn(err);
              this.loader.hide();
              return of(err);
          }),
          tap(x => {
              if (x) {
                console.log('x value: ', x);
                this.loader.hide();
              }
              // if(alwaysHide) this.loader.hide();
          })
          // filter(x => x !== null)
      );
  }
}