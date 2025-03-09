import { inject, Injectable } from "@angular/core";
import { FsDirectory, FsItem } from "./fsitem.models";
import { FsItemUtils } from "./fsitem.utils";
import { BehaviorSubject, Subject } from "rxjs";
import { FsItemApiService } from "./fsItemApi.service";

@Injectable({
    providedIn: 'root'
})
export class FsItemStateService {
    private fsItemApiService = inject(FsItemApiService);

    private _root$ = new BehaviorSubject<FsItem | null>(null);
    private _selected$ = new Subject<FsItem>();
    private _shouldOpen$ = new Subject<string[]>();

    root$ = this._root$.asObservable();
    selected$ = this._selected$.asObservable();
    shouldOpen$ = this._shouldOpen$.asObservable();

    loadRoot() {
        this.fsItemApiService.getRoot()
            .subscribe({ next: root => {
                console.log(root);
                this._root$.next(root);
                this._selected$.next(root);
            }
        })
    }

    setSelected(item: FsItem) {
        this._selected$.next(item);
        const paths = FsItemUtils.findAllPaths(item);
        this._shouldOpen$.next(paths);
    }

    add(parent: FsItem, x: FsItem) {
        const root = this._root$.getValue();
        if(!root) {
            throw 'Root not loaded during add operation';
        }
        const addedToTree = this.addToTree(parent.id, root, x);
        if(addedToTree) {
            this.fsItemApiService.updateRoot(root).subscribe({
                next: updatedRoot => {
                    this._root$.next(updatedRoot);
                }
            });
        }

        return addedToTree;
    }

    private addToTree(parentId: string, parent: FsItem, x: FsItem): FsItem | null {
        if(parent.id === parentId) {
            (parent as FsDirectory).items.push(x);
            return x;
        }

        const childDirs = FsItemUtils.getDirsAndDocs(parent).dirs;

        const updated =  childDirs
            .map(dir => this.addToTree(parentId, dir, x))
            .filter(x => !!x);

        if(updated.length > 1) {
            console.error('more than one item updated');
        }

        return updated[0];
    }
}