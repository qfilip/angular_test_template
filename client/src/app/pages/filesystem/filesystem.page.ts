import { Component, inject, OnInit, signal } from '@angular/core';
import { TrackerComponent } from "../../components/filesystem/tracker/tracker.component";
import { TreeComponent } from "../../components/filesystem/tree/tree.component";
import { FsToolbarComponent } from "../../components/filesystem/files/fs-toolbar/fs-toolbar.component";
import { DirsAndDocs, FsItem } from '../../components/filesystem/fsitem.models';
import { FsItemStateService } from '../../components/filesystem/fsItemState.service';
import { filter, Observable, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FsItemUtils } from '../../components/filesystem/fsitem.utils';
import { FilePreviewComponent } from "../../components/filesystem/file-preview/file-preview.component";

@Component({
  selector: 'app-filesystem',
  imports: [CommonModule, TrackerComponent, TreeComponent, FsToolbarComponent, FilePreviewComponent],
  templateUrl: './filesystem.page.html',
  styleUrl: './filesystem.page.css'
})
export class FilesystemPage implements OnInit {
  private fsItemStateService = inject(FsItemStateService);
  
  root$!: Observable<FsItem>;
  private _$items = signal<DirsAndDocs>({ dirs: [], docs: []}, { equal: _ => false});
  $items = this._$items.asReadonly();
  
  ngOnInit() {
    this.fsItemStateService.loadRoot();
    
    this.root$ = this.fsItemStateService.root$
      .pipe(
        filter(x => !!x),
        tap(x => {
          console.log('loading new root: ', x);
          this._$items.set(FsItemUtils.getDirsAndDocs(x, x))
        })
      );
  }
}
