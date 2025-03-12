import { inject, Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { FsBranchApiService } from "./fsBranchApi.service";
import { Branch, FsItemEvent } from "../file/fsitem.models";

@Injectable({
    providedIn: 'root'
})
export class FsBranchStateService {
    private fsBranchApiService = inject(FsBranchApiService);
    
    private _branches$ = new BehaviorSubject<Branch[]>([]);
    private _selectedBranch$ = new BehaviorSubject<Branch | null>(null);
    private _uncommited$ = new BehaviorSubject<FsItemEvent[]>([]);

    branches$ = this._branches$.asObservable();
    selectedBranch$ = this._selectedBranch$.asObservable();
    uncommited$ = this._uncommited$.asObservable();

    loadBranches() {
        this.fsBranchApiService.getAll()
        .subscribe({ next: xs => {
            if(xs.length === 0) return;

            this._branches$.next(xs);
            this._selectedBranch$.next(xs[0]);
        }});
    }

    createBranch(b: Branch) {
        this.fsBranchApiService.post(b)
        .subscribe({ next: x => {
            const xs = this._branches$.getValue().concat(x);
            this._branches$.next(xs);
            this._selectedBranch$.next(x);
        }});
    }
}