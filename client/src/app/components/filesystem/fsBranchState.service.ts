import { inject, Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Branch } from "./fsitem.models";
import { FsBranchApiService } from "./fsBranchApi.service";

@Injectable({
    providedIn: 'root'
})
export class FsBranchStateService {
    private fsBranchApiService = inject(FsBranchApiService);
    
    private _branches$ = new BehaviorSubject<Branch[]>([]);
    private _selectedBranch$ = new BehaviorSubject<Branch | null>(null);

    branches$ = this._branches$.asObservable();
    selectedBranch$ = this._selectedBranch$.asObservable();

    loadBranches() {
        this.fsBranchApiService.getAll()
        .subscribe({ next: xs => this._branches$.next(xs)});
    }

    createBranch(b: Branch) {
        this.fsBranchApiService.post(b)
        .subscribe({ next: x => {
            const xs = this._branches$.getValue().concat(x);
            this._branches$.next(xs);
        }});
    }
}