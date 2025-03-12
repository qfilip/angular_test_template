import { Component, inject, OnInit, signal } from '@angular/core';
import { filter, Observable, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { TreeComponent } from '../../components/filesystem/file/tree/tree.component';
import { TrackerComponent } from '../../components/filesystem/branch/tracker/tracker.component';
import { FilePreviewComponent } from '../../components/filesystem/file/file-preview/file-preview.component';
import { FsToolbarComponent } from '../../components/filesystem/file/fs-toolbar/fs-toolbar.component';
import { FsItem, DirsAndDocs } from '../../components/filesystem/file/fsitem.models';
import { FsItemUtils } from '../../components/filesystem/file/fsitem.utils';
import { FsItemStateService } from '../../components/filesystem/file/fsItemState.service';

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
