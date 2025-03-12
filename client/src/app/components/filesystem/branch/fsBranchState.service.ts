import { inject, Injectable, signal } from '@angular/core';

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
    
    private _$branches = signal<Branch[]>([], { equal: _ => false});
    private _$selectedBranch = signal<Branch | null>(null, { equal: _ => false});
    private _$uncommited = signal<FsItemEvent[]>([], { equal: _ => false});

    $branches = this._$branches.asReadonly();
    $selectedBranch = this._$selectedBranch.asReadonly();
    $uncommited = this._$uncommited.asReadonly();

    loadBranches() {
        this.apiService.getAll()
        .subscribe({ next: xs => {
            if(xs.length === 0) return;

            this._$branches.set(xs);
            this._$selectedBranch.set(xs[0]);
        }});
    }

    createBranch(b: Branch) {
        this.apiService.post(b)
        .subscribe({ next: x => {
            const xs = this._$branches().concat(x);
            this._$branches.set(xs);
            this._$selectedBranch.set(x);
        }});
    }

    addEvent(event: FsItemEvent) {
        const current = this._$uncommited()
        this._$uncommited.set(current.concat(event));
    }

    addEvents(events: FsItemEvent[]) {
        const current = this._$uncommited()
        this._$uncommited.set(current.concat(events));
    }

    commit() {
        const events = this._$uncommited();
        if(events.length === 0) {
            this.popupService.info('No changes present. Nothing to commit.');
            return;
        }

        const branch = this._$selectedBranch();
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
                const xs = this._$branches()
                    .filter(x => x.id !== b.id)
                    .concat(b);

                this._$branches.set(xs);
                this._$uncommited.set([]);
                this._$selectedBranch.set(b);
                this.popupService.info('Changes commited.');
            }
        });

    }

    revertTo(index: number) {
        const uncommited = this._$uncommited();
        const reverted = [];
        for(let i = 0; i < index; i++) {
            reverted.push(uncommited[i]);
        }
        this._$uncommited.set(reverted);
    }
}