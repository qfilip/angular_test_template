import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Utils } from '../../../shared/services/utils';
import { PopupService } from '../../common-ui/popup/popup.service';
import { Branch, Commit, FsItemEvent } from '../file/fsitem.models';
import { FsBranchApiService } from './fsBranchApi.service';

@Injectable({
    providedIn: 'root'
})
export class FsBranchStateService {
    private popupService = inject(PopupService);
    private apiService = inject(FsBranchApiService);
    
    private _branches$ = new BehaviorSubject<Branch[]>([]);
    private _selectedBranch$ = new BehaviorSubject<Branch | null>(null);
    private _uncommited$ = new BehaviorSubject<FsItemEvent[]>([]);

    branches$ = this._branches$.asObservable();
    selectedBranch$ = this._selectedBranch$.asObservable();
    uncommited$ = this._uncommited$.asObservable();

    loadBranches() {
        this.apiService.getAll()
        .subscribe({ next: xs => {
            if(xs.length === 0) return;

            this._branches$.next(xs);
            this._selectedBranch$.next(xs[0]);
        }});
    }

    createBranch(b: Branch) {
        this.apiService.post(b)
        .subscribe({ next: x => {
            const xs = this._branches$.getValue().concat(x);
            this._branches$.next(xs);
            this._selectedBranch$.next(x);
        }});
    }

    addEvent(event: FsItemEvent) {
        const current = this._uncommited$.getValue();
        this._uncommited$.next(current.concat(event));
    }

    commit() {
        const events = this._uncommited$.getValue();
        if(events.length === 0) {
            this.popupService.info('No changes present. Nothing to commit.');
            return;
        }

        const branch = this._selectedBranch$.getValue();
        if(!branch) {
            this.popupService.warn('Branch must be selected before commiting changes');
            return;
        }

        const clone = Utils.deepClone(branch) as Branch;
        
        const commit: Commit = {
            id: Utils.makeId(),
            createdAt: new Date(),
            events: events
        };

        clone.commits.push(commit);

        this.apiService.put(clone).subscribe({
            next: b => {
                const xs = this._branches$
                    .getValue()
                    .filter(x => x.id !== b.id)
                    .concat(b);

                this._branches$.next(xs);
                this._selectedBranch$.next(b);
            }
        });

    }
}