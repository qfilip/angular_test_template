import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, OnInit, Signal, signal } from '@angular/core';
import { filter, Observable, tap } from 'rxjs';

import { TrackerComponent } from '../../components/filesystem/branch/tracker/tracker.component';
import { FilePreviewComponent } from '../../components/filesystem/file/file-preview/file-preview.component';
import { FsToolbarComponent } from '../../components/filesystem/file/fs-toolbar/fs-toolbar.component';
import { DirsAndDocs, FsItem } from '../../components/filesystem/file/fsitem.models';
import { FsItemStateService } from '../../components/filesystem/file/fsItemState.service';
import { TreeComponent } from '../../components/filesystem/file/tree/tree.component';
import { FsItemUtils } from '../../components/filesystem/file/fsitem.utils';

@Component({
  selector: 'app-filesystem',
  imports: [CommonModule, TrackerComponent, TreeComponent, FsToolbarComponent, FilePreviewComponent],
  templateUrl: './filesystem.page.html',
  styleUrl: './filesystem.page.css'
})
export class FilesystemPage {
  private fsItemStateService = inject(FsItemStateService);
  
  private _$items = signal<DirsAndDocs>({ dirs: [], docs: []}, { equal: _ => false});
  $items = this._$items.asReadonly();
  
  $root = computed(() => {
    return this.fsItemStateService.$root();
  });
  
  constructor() {
    effect(() => {
      const root = this.fsItemStateService.$root();
      if(!!root) {
        const dds = FsItemUtils.getDirsAndDocs(root, root)
        this._$items.set(dds);
      }
    })
  }
}
