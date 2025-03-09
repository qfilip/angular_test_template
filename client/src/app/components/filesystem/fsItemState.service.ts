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
    private _selected$ = new Subject<{ item: FsItem, root: FsItem }>();
    private _expanded$ = new Subject<{ paths: string[], root: FsItem }>();

    root$ = this._root$.asObservable();
    selected$ = this._selected$.asObservable();
    expanded$ = this._expanded$.asObservable();

    loadRoot() {
        this.fsItemApiService.getRoot()
            .subscribe({ next: root => {
                this._root$.next(root);
                this._selected$.next({ item: root, root: root });
            }
        })
    }

    setSelected(item: FsItem, expand: boolean) {
        this._selected$.next({ item: item, root: this._root$.getValue()!});
        const paths = FsItemUtils.findAllPaths(item);
        if(expand) {
            this._expanded$.next({ paths: paths, root: this._root$.getValue()! });
        }
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
                    this.setSelected(parent, true);
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

        const childDirs = FsItemUtils.getDirsAndDocs(parent, this._root$.getValue()!).dirs;

        const updated = childDirs
            .map(dir => this.addToTree(parentId, dir, x))
            .filter(x => !!x);

        if(updated.length > 1) {
            console.error('more than one item updated');
        }

        return updated[0];
    }
}