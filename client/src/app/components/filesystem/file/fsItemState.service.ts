import { effect, inject, Injectable, signal } from '@angular/core';

import { FsBranchStateService } from '../branch/fsBranchState.service';
import { FsItem, FsItemEvent } from './fsitem.models';
import { FsItemUtils } from './fsitem.utils';
import { ROOT } from '../fsConstants';

@Injectable({
    providedIn: 'root'
})
export class FsItemStateService {
    private fsBranchStateService = inject(FsBranchStateService);

    private _$rootCache = signal<FsItem>(ROOT, { equal: _ => false });
    private _$selected = signal<FsItem | null>(null, { equal: _ => false });
    private _$expanded = signal<string[]>([], { equal: _ => false});
    private _$root = signal<FsItem | null>(null, { equal: _ => false });

    $selected = this._$selected.asReadonly();
    $expanded = this._$expanded.asReadonly();
    $root = this._$root.asReadonly();

    constructor() {
        effect(() => {
            const branch = this.fsBranchStateService.$selectedBranch();
            if(!branch) return;

            const events = branch.commits.map(x => x.events).flat();
            const root = FsItemUtils.mapRootFromEvents(events);
            this._$rootCache.set(root);
        });

        effect(() => {
            const branch = this.fsBranchStateService.$selectedBranch();
            const events = this.fsBranchStateService.$uncommited();
            if(!branch) return;

            const rootCache = this._$rootCache();
            const root = FsItemUtils.mapRootFromEvents(events, rootCache);
            this._$root.set(root);

            events.length > 0
            ? this.toggleDirectory(events[events.length - 1], root)
            : this.setSelected(root, false);
        });
    }

    setSelected(item: FsItem, expand: boolean) {
        this._$selected.set(item);
        const paths = FsItemUtils.findAllPaths(item);
        
        if(expand) {
            this._$expanded.set(paths);
        }
    }

    private toggleDirectory(lastEvent: FsItemEvent, root: FsItem) {
        const updateSelected = (fsi: FsItem) => {
            if(fsi.id === ROOT.id) return;

            const parent = FsItemUtils.getParent(fsi, root);
            this.setSelected(parent!, true);
        }

        FsItemUtils.doOnEvent(
            lastEvent,
            e => updateSelected(e.created),
            e => updateSelected(e.updated),
            e => updateSelected(e.deleted)
        );
    }
}