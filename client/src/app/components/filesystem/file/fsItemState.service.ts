import { effect, inject, Injectable, signal } from '@angular/core';

import { FsBranchStateService } from '../branch/fsBranchState.service';
import { FsItem } from './fsitem.models';
import { FsItemUtils } from './fsitem.utils';

@Injectable({
    providedIn: 'root'
})
export class FsItemStateService {
    private fsBranchStateService = inject(FsBranchStateService);

    private _$selected = signal<FsItem | null>(null, { equal: _ => false });
    private _$expanded = signal<string[]>([], { equal: _ => false});
    private _$root = signal<FsItem | null>(null, { equal: _ => false });

    $selected = this._$selected.asReadonly();
    $expanded = this._$expanded.asReadonly();
    $root = this._$root.asReadonly();

    constructor() {
        effect(() => {
            const branch = this.fsBranchStateService.$selectedBranch();
            const uncommited = this.fsBranchStateService.$uncommited();

            if(!branch) return;
            const commited = branch!.commits.map(x => x.events).flat();
            const events = commited.concat(uncommited);
            
            const root = FsItemUtils.mapRootFromEvents(events);
            this._$root.set(root);
            this.setSelected(root, false);
        });
    }

    setSelected(item: FsItem, expand: boolean) {
        this._$selected.set(item);
        const paths = FsItemUtils.findAllPaths(item);
        
        if(expand) {
            this._$expanded.set(paths);
        }
    }
}