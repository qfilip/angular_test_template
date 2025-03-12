import { Injectable, signal } from "@angular/core";
import { Popup } from "./popup.model";
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

    warn(message: string, header = 'Warning') {
        this._popup$.next({
            x: {
                color: 'orange',
                header: header,
                text: message
            },
            duration: this.defaultDuration
        });
    }
}