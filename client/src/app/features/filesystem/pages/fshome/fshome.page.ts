import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { TrackerComponent } from '../../components/branch/tracker/tracker.component';
import { FilePreviewComponent } from '../../components/file/file-preview/file-preview.component';
import { FsToolbarComponent } from '../../components/file/fs-toolbar/fs-toolbar.component';
import { SearchResultComponent } from '../../components/file/search-result/search-result.component';
import { TreeComponent } from '../../components/file/tree/tree.component';
import { DirsAndDocs } from '../../models/fsitem.models';
import { FsItemStateService } from '../../services/fsItemState.service';
import { FsItemUtils } from '../../utils/fsitem.utils';

@Component({
  standalone: true,
  selector: 'app-fshome',
  imports: [CommonModule, TrackerComponent, TreeComponent, FsToolbarComponent, FilePreviewComponent, SearchResultComponent],
  templateUrl: './fshome.page.html',
  styleUrl: './fshome.page.css'
})
export class FsHomePage {
  private fsItemStateService = inject(FsItemStateService);

  $searchActive = computed(() => this.fsItemStateService.$searchActive());
  
  $root = computed(() => {
    return this.fsItemStateService.$root();
  });
  
  $items = computed(() => {
    const root = this.fsItemStateService.$root();
      if(!root) {
        return { dirs: [], docs: [] };
      }
      const dds = FsItemUtils.getDirsAndDocs(root, root);
      const data = dds.data ? dds.data : { dirs: [], docs: [] };
      
      return data;
  });
}
