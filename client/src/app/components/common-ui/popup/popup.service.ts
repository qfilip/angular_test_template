import { Injectable, signal } from "@angular/core";
import { Popup, PopupColor } from "./popup.model";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class PopupService {
    private defaultDuration = 3000;
    private _popup$ = new BehaviorSubject<{x: Popup, duration: number } | null>(null);
    popup$ = this._popup$.asObservable();

    push = (x: Popup, duration = this.defaultDuration) =>
        this._popup$.next({
            x: x,
            duration: duration
        });

    info = (message: string, header = 'Info') =>
        this.pushItem(message, 'blue', header);

    ok = (message: string, header = 'Ok') =>
        this.pushItem(message, 'green', header);

    warn = (message: string, header = 'Warning') =>
        this.pushItem(message, 'orange', header); 

    error = (message: string, header = 'Error') =>
        this.pushItem(message, 'red', header); 

    private pushItem(message: string, color: PopupColor, header: string) {
        this._popup$.next({
            x: {
                color: color,
                header: header,
                text: message
            },
            duration: this.defaultDuration
        });
    }
}