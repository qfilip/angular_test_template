import { Injectable } from "@angular/core";
import { FsDirectory, FsItem } from "./fsitem.models";
import { FsItemUtils } from "./fsitem.utils";
import { BehaviorSubject, Subject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class FsItemStateService {
    private _root$ = new BehaviorSubject<FsItem>({
        id: '/',
        name: '/',
        type: 'directory',
        items: []
    });

    private _selected$ = new Subject<FsItem>();
    private _updated$ = new Subject<FsItem>();

    root$ = this._root$.asObservable();
    selected$ = this._selected$.asObservable();
    updated$ = this._updated$.asObservable();

    setSelected(item: FsItem) {
        this._selected$.next(item);
    }

    add(parentId: string, x: FsItem) {
        const item = this._root$.getValue();
        const addedToTree = this.addToTree(parentId, item, x);
        if(addedToTree) {
            this._root$.next(item);
            this._updated$.next(addedToTree);
        }

        return addedToTree;
    }

    private addToTree(parentId: string, parent: FsItem, x: FsItem): FsItem | null {
        if(parent.id === parentId) {
            (parent as FsDirectory).items.push(x);
            return parent;
        }

        const childDirs = FsItemUtils.getDirsAndDocs(parent).dirs;

        const updated =  childDirs
            .map(dir => this.addToTree(dir.id, dir, x))
            .filter(x => !!x);

        if(updated.length > 1) {
            console.error('more than one item updated');
        }

        return updated[0];
    }
}