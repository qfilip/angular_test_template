import { Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { FsItemStateService } from '../fsItemState.service';
import { map, Observable, switchMap, tap } from 'rxjs';
import { DirsAndDocs, FsDocument, FsItem } from '../fsitem.models';
import { TreeComponent } from "../tree/tree.component";
import { CommonModule } from '@angular/common';
import { FsItemUtils } from '../fsitem.utils';
import { FsItemNamePipe } from "../fsitem.pipes";
import { Utils } from '../../../../shared/services/utils';

@Component({
  selector: 'app-file-preview',
  imports: [CommonModule, FsItemNamePipe],
  templateUrl: './file-preview.component.html',
  styleUrl: './file-preview.component.css'
})
export class FilePreviewComponent implements OnInit {
  @ViewChild('docContent') private docContent!: ElementRef<HTMLTextAreaElement>;
  private fsItemStateService = inject(FsItemStateService);
  
  private item!: FsItem;
  private _$canEdit = signal<boolean>(false);
  
  $canEdit = this._$canEdit.asReadonly();
  preview$!: Observable<{
    previewDoc: boolean,
    content: string, 
    dirsAndDocs: DirsAndDocs
   }>;

  ngOnInit(): void {
    this.preview$ = this.fsItemStateService.selected$
      .pipe(
        tap(x => {
          this.item = x;
          this._$canEdit.set(false);
        }),
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

  onFileContentChange(content: string) {
    const itemContent = (this.item as FsDocument).content;
    this._$canEdit.set(content !== itemContent);
  }

  saveChanges() {
    const clone = Utils.deepClone(this.item) as FsItem;
    const newContent = this.docContent.nativeElement.value;

    this.fsItemStateService.updateContent(clone, newContent);
  }
}
