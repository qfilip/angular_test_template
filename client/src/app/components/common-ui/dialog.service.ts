import { Injectable, signal } from "@angular/core";
import { DialogOptions } from "./dialog-options.model";

@Injectable({
    providedIn: 'root'
})
export class DialogService {
    private _$dialogOptions = signal<DialogOptions | null>(null);
    $dialogOptions = this._$dialogOptions.asReadonly();

    open(options: DialogOptions) {
        const o = this.setDefaultOptions(options);
        this._$dialogOptions.set(o);
    }

    close() {
        this._$dialogOptions.set(null);
    }

    private setDefaultOptions(options: DialogOptions) {
        if (options.buttons && options.buttons.length > 0) {
            options.buttons.forEach(x => {
                if (!x.action) {
                    x.action = () => { }
                }
            });
        }
        const o: DialogOptions = {
            header: options.header ?? 'Info',
            message: options.message ?? 'Do you wish to proceed?',
            type: options.type ?? 'info',
            buttons: options.buttons ?? [
                { label: 'Ok', action: () => { } }
            ]
        };

        return o;
    }
}