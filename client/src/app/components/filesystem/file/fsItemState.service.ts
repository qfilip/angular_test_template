import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, distinctUntilChanged, filter, map, Observable, Subject, tap } from 'rxjs';

import { FsBranchStateService } from '../branch/fsBranchState.service';
import { FsItem } from './fsitem.models';
import { FsItemUtils } from './fsitem.utils';

@Injectable({
    providedIn: 'root'
})
export class FsItemStateService {
    private fsBranchStateService = inject(FsBranchStateService);

    private _selected$ = new BehaviorSubject<FsItem | null>(null);
    private _expanded$ = new Subject<string[]>();

    selected$ = this._selected$.asObservable();
    expanded$ = this._expanded$.asObservable();

    root$: Observable<FsItem | null> = combineLatest({
        branch: this.fsBranchStateService.selectedBranch$,
        uncommited: this.fsBranchStateService.uncommited$
    }).pipe(
        filter(x => !!x.branch),
        map(x => {
            const commited = x.branch!.commits.map(x => x.events).flat();
            const events = commited.concat(x.uncommited);

            return FsItemUtils.mapRootFromEvents(events);
        }),
        tap(x => this.setSelected(x, true))
    );

    setSelected(item: FsItem, expand: boolean) {
        this._selected$.next(item);
        const paths = FsItemUtils.findAllPaths(item);
        if(expand) {
            this._expanded$.next(paths);
        }
    }
}