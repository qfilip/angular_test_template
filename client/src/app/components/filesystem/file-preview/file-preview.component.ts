import { Component, inject, OnInit } from '@angular/core';
import { FsItemStateService } from '../fsItemState.service';
import { map, Observable } from 'rxjs';
import { FsDocument, FsItem } from '../fsitem.models';
import { TreeComponent } from "../tree/tree.component";
import { CommonModule } from '@angular/common';
import { FsItemUtils } from '../fsitem.utils';
import { FsItemNamePipe } from "../fsitem.pipes";

@Component({
  selector: 'app-file-preview',
  imports: [CommonModule, FsItemNamePipe],
  templateUrl: './file-preview.component.html',
  styleUrl: './file-preview.component.css'
})
export class FilePreviewComponent implements OnInit {
  private fsItemStateService = inject(FsItemStateService);
  
  preview$!: Observable<{
    previewDoc: boolean,
    content: string, 
    dirs: FsItem[],
    docs: FsItem[]
   }>;

  ngOnInit(): void {
    this.preview$ = this.fsItemStateService.selected$
      .pipe(
        map(x => {
          const previewDoc = x.item.type === 'document';
          const dirsAndDocs = FsItemUtils.getDirsAndDocs(x.item, x.root);
          return {
            previewDoc: previewDoc,
            content: (x.item as FsDocument).content,
            dirs: previewDoc ? [] : dirsAndDocs.dirs,
            docs: previewDoc ? [] : dirsAndDocs.docs 
          };
        })
      );
  }

  setSelected(x: FsItem) {
    this.fsItemStateService.setSelected(x, true);
  }
}
