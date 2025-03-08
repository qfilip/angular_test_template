import { Component, inject, OnInit } from '@angular/core';
import { TrackerComponent } from "../../components/filesystem/tracker/tracker.component";
import { TreeComponent } from "../../components/filesystem/tree/tree.component";
import { FsToolbarComponent } from "../../components/filesystem/fs-toolbar/fs-toolbar.component";
import { FsItem } from '../../components/filesystem/fsitem.models';
import { FsItemStateService } from '../../components/filesystem/fsItemState.service';
import { Observable, tap } from 'rxjs';
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
  items = { dirs: [] as FsItem[], docs: [] as FsItem[] };
  
  ngOnInit(): void {
    this.root$ = this.fsItemStateService.root$
      .pipe(
        tap(x => this.items = FsItemUtils.getDirsAndDocs(x))
      );
  }
}
