import { inject, Injectable, signal } from '@angular/core';

import { Utils } from '../../../shared/services/utils';
import { FsBranchApiService } from './fsBranchApi.service';
import { PopupService } from '../../common-ui/services/popup.service';
import { Branch, FsItemEvent, Commit } from '../models/fsitem.models';

@Injectable({
    providedIn: 'root'
})
export class FsBranchStateService {
    private popupService = inject(PopupService);
    private apiService = inject(FsBranchApiService);
    
    private _$branches = signal<Branch[]>([], { equal: _ => false});
    private _$selectedBranch = signal<Branch | null>(null, { equal: _ => false});
    private _$uncommitted = signal<FsItemEvent[]>([], { equal: _ => false});

    $branches = this._$branches.asReadonly();
    $selectedBranch = this._$selectedBranch.asReadonly();
    $uncommitted = this._$uncommitted.asReadonly();

    loadBranches() {
        this.apiService.getAll()
        .subscribe({ next: xs => {
            if(xs.length === 0) return;

            this._$branches.set(xs);
            this._$selectedBranch.set(xs[0]);
        }});
    }

    loadBranch = (b: Branch) => this.apiService.get(b);

    createBranch(b: Branch) {
        this.apiService.post(b)
        .subscribe({ next: x => {
            const xs = this._$branches().concat(x);
            this._$branches.set(xs);
            this._$selectedBranch.set(x);
        }});
    }

    selectBranch(branchId: string) {
        const branch = this.$branches().find(x => x.id === branchId);
        if(!branch) {
            this.popupService.error('Branch not found');
            return;
        }

        this._$selectedBranch.set(branch);
    }

    addEvent(event: FsItemEvent) {
        const current = this._$uncommitted()
        this._$uncommitted.set(current.concat(event));
    }

    addEvents(events: FsItemEvent[]) {
        const current = this._$uncommitted()
        this._$uncommitted.set(current.concat(events));
    }

    commit() {
        const events = this._$uncommitted();
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
                this._$uncommitted.set([]);
                this._$selectedBranch.set(b);
                this.popupService.info('Changes committed.');
            }
        });

    }

    revertTo(index: number) {
        const uncommitted = this._$uncommitted();
        const reverted = [];
        for(let i = 0; i < index; i++) {
            reverted.push(uncommitted[i]);
        }
        this._$uncommitted.set(reverted);
    }
}