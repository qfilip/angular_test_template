import { inject, Injectable, signal } from '@angular/core';
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
    
    private _branches$ = signal<Branch[]>([], { equal: _ => false});
    private _selectedBranch$ = signal<Branch | null>(null, { equal: _ => false});
    private _uncommited$ = signal<FsItemEvent[]>([], { equal: _ => false});

    branches$ = this._branches$.asReadonly();
    selectedBranch$ = this._selectedBranch$.asReadonly();
    uncommited$ = this._uncommited$.asReadonly();

    loadBranches() {
        this.apiService.getAll()
        .subscribe({ next: xs => {
            if(xs.length === 0) return;

            console.log('setting branch')
            this._branches$.set(xs);
            this._selectedBranch$.set(xs[0]);
        }});
    }

    createBranch(b: Branch) {
        this.apiService.post(b)
        .subscribe({ next: x => {
            const xs = this._branches$().concat(x);
            this._branches$.set(xs);
            this._selectedBranch$.set(x);
        }});
    }

    addEvent(event: FsItemEvent) {
        const current = this._uncommited$()
        this._uncommited$.set(current.concat(event));
    }

    commit() {
        const events = this._uncommited$();
        if(events.length === 0) {
            this.popupService.info('No changes present. Nothing to commit.');
            return;
        }

        const branch = this._selectedBranch$();
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
                const xs = this._branches$()
                    .filter(x => x.id !== b.id)
                    .concat(b);

                this._branches$.set(xs);
                this._uncommited$.set([]);
                this._selectedBranch$.set(b);
                this.popupService.info('Changes commited.');
            }
        });

    }

    revertTo(index: number) {
        const uncommited = this._uncommited$();
        const next = uncommited.slice(0, index);
        this._uncommited$.set(next);
    }
}