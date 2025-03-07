import { Injectable, signal } from "@angular/core";
import { Popup } from "./popup.model";

@Injectable({
    providedIn: 'root'
})
export class PopupService {
    private _$popup = signal<{x: Popup, duration: number } | null>(null);
    $popup = this._$popup.asReadonly();

    push = (x: Popup, duration = 3000) =>
        this._$popup.set({
            x: x,
            duration: duration
        });
}