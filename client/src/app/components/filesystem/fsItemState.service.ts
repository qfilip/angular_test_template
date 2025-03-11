import { inject, Injectable } from "@angular/core";
import { FsDirectory, FsDocument, FsItem } from "./fsitem.models";
import { FsItemUtils } from "./fsitem.utils";
import { BehaviorSubject, Subject } from "rxjs";
import { FsItemApiService } from "./fsItemApi.service";
import { FsBranchStateService } from "./fsBranchState.service";

@Injectable({
    providedIn: 'root'
})
export class FsItemStateService {
    private fsItemApiService = inject(FsItemApiService);
    private fsBranchStateService = inject(FsBranchStateService);

    rooot$ = this.fsBranchStateService.selectedBranch$
        .pipe(
            map(sb => )
        )

    private _root$ = new BehaviorSubject<FsItem | null>(null);
    private _selected$ = new Subject<FsItem>();
    private _expanded$ = new Subject<string[]>();

    root$ = this._root$.asObservable();
    selected$ = this._selected$.asObservable();
    expanded$ = this._expanded$.asObservable();

    loadRoot() {
        this.fsItemApiService.getRoot()
            .subscribe({ next: root => {
                this._root$.next(root);
                this._selected$.next(root);
            }
        })
    }

    setSelected(item: FsItem, expand: boolean) {
        this._selected$.next(item);
        const paths = FsItemUtils.findAllPaths(item);
        if(expand) {
            this._expanded$.next(paths);
        }
    }

    add(parent: FsItem, x: FsItem) {
        const root = this._root$.getValue();
        if(!root) {
            throw 'Root not loaded during add operation';
        }
        const addedToTree = this.addToTree(parent.id, root, x, root);
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

    updateContent(doc: FsItem, newContent: string) {
        const root = this._root$.getValue()!;
        const foundDoc = FsItemUtils.findChildDoc(doc.id, root);
        (foundDoc as FsDocument).content = newContent;

        this.fsItemApiService.updateRoot(root).subscribe({
            next: updatedRoot => {
                this._root$.next(updatedRoot);
            }
        });
    }

    private addToTree(parentId: string, parent: FsItem, x: FsItem, root: FsItem): FsItem | null {
        if(parent.id === parentId) {
            (parent as FsDirectory).items.push(x);
            return x;
        }

        const childDirs = FsItemUtils.getDirsAndDocs(parent, root).dirs;

        const updated = childDirs
            .map(dir => this.addToTree(parentId, dir, x, root))
            .filter(x => !!x);

        if(updated.length > 1) {
            console.error('more than one item updated');
        }

        return updated[0];
    }
}