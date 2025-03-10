import { Component, inject, OnInit } from '@angular/core';
import { FsItemStateService } from '../fsItemState.service';
import { map, Observable, switchMap, tap } from 'rxjs';
import { DirsAndDocs, FsDocument, FsItem } from '../fsitem.models';
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
  
  private item!: FsItem;

  preview$!: Observable<{
    previewDoc: boolean,
    content: string, 
    dirsAndDocs: DirsAndDocs
   }>;

  ngOnInit(): void {
    this.preview$ = this.fsItemStateService.selected$
      .pipe(
        tap(x => this.item = x),
        switchMap(_ => this.fsItemStateService.root$),
        map(x => {
          const previewDoc = this.item.type === 'document';
          const dirsAndDocs = FsItemUtils.getDirsAndDocs(this.item, x!);
          return {
            previewDoc: previewDoc,
            content: (this.item as FsDocument).content,
            dirsAndDocs: dirsAndDocs
          };
        })
      );
  }

  setSelected(x: FsItem) {
    this.fsItemStateService.setSelected(x, true);
  }

  log(msg: string) {
    console.log(msg);
  }
}
