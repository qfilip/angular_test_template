import { Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { FsItemStateService } from '../fsItemState.service';
import { BehaviorSubject, filter, map, Observable, switchMap, tap } from 'rxjs';
import { DirsAndDocs, FsDocument, FsItem } from '../fsitem.models';
import { CommonModule } from '@angular/common';
import { FsItemUtils } from '../fsitem.utils';
import { FsItemNamePipe } from "../fsitem.pipes";
import { Utils } from '../../../../shared/services/utils';
import { FsBranchStateService } from '../../branch/fsBranchState.service';

@Component({
  selector: 'app-file-preview',
  imports: [CommonModule, FsItemNamePipe],
  templateUrl: './file-preview.component.html',
  styleUrl: './file-preview.component.css'
})
export class FilePreviewComponent implements OnInit {
  @ViewChild('docContent') private docContent!: ElementRef<HTMLTextAreaElement>;
  private fsItemStateService = inject(FsItemStateService);
  private fsBranchStateService = inject(FsBranchStateService);
  
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
        filter(x => !!x),
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
    const clone = Utils.deepClone(this.item) as FsDocument;
    const newContent = this.docContent.nativeElement.value;

    clone.content = newContent;
    const event = FsItemUtils.createFsItemEvent('updated', clone as FsItem);
    this.fsBranchStateService.addEvent(event);
  }
}
