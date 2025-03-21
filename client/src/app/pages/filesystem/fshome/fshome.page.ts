import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { TrackerComponent } from '../../../components/filesystem/branch/tracker/tracker.component';
import { FilePreviewComponent } from '../../../components/filesystem/file/file-preview/file-preview.component';
import { FsToolbarComponent } from '../../../components/filesystem/file/fs-toolbar/fs-toolbar.component';
import { DirsAndDocs } from '../../../components/filesystem/file/fsitem.models';
import { FsItemUtils } from '../../../components/filesystem/file/fsitem.utils';
import { FsItemStateService } from '../../../components/filesystem/file/fsItemState.service';
import { SearchResultComponent } from '../../../components/filesystem/file/search-result/search-result.component';
import { TreeComponent } from '../../../components/filesystem/file/tree/tree.component';

@Component({
  standalone: true,
  selector: 'app-fshome',
  imports: [CommonModule, TrackerComponent, TreeComponent, FsToolbarComponent, FilePreviewComponent, SearchResultComponent],
  templateUrl: './fshome.page.html',
  styleUrl: './fshome.page.css'
})
export class FsHomePage {
  private fsItemStateService = inject(FsItemStateService);

  private _$items = signal<DirsAndDocs>({ dirs: [], docs: [] }, { equal: _ => false });
  $items = this._$items.asReadonly();
  $searchActive = computed(() => this.fsItemStateService.$searchActive());

  $root = computed(() => {
    return this.fsItemStateService.$root();
  });

  constructor() {
    effect(() => {
      const root = this.fsItemStateService.$root();
      if (root) {
        const dds = FsItemUtils.getDirsAndDocs(root, root);
        if(dds.data) {
          this._$items.set(dds.data);
        }
      }
    })
  }
}
