import { Injectable, signal } from "@angular/core";
import { Popup } from "./popup.model";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class PopupService {
    private _popup$ = new BehaviorSubject<{x: Popup, duration: number } | null>(null);
    popup$ = this._popup$.asObservable();

    push = (x: Popup, duration = 3000) =>
        this._popup$.next({
            x: x,
            duration: duration
        });
}