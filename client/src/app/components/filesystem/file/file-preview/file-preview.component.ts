import { CommonModule } from '@angular/common';
import { Component, effect, ElementRef, inject, signal, ViewChild } from '@angular/core';

import { Utils } from '../../../../shared/services/utils';
import { FsBranchStateService } from '../../branch/fsBranchState.service';
import { DirsAndDocs, FsDocument, FsItem } from '../fsitem.models';
import { FsItemNamePipe } from '../fsitem.pipes';
import { FsItemUtils } from '../fsitem.utils';
import { FsItemStateService } from '../fsItemState.service';

@Component({
  selector: 'app-file-preview',
  imports: [CommonModule, FsItemNamePipe],
  templateUrl: './file-preview.component.html',
  styleUrl: './file-preview.component.css'
})
export class FilePreviewComponent {
  @ViewChild('docContent') private docContent!: ElementRef<HTMLTextAreaElement>;
  private fsItemStateService = inject(FsItemStateService);
  private fsBranchStateService = inject(FsBranchStateService);
  
  private $item = signal<FsItem | null>(null);
  private _$canEdit = signal<boolean>(false);
  private _$preview = signal<{ previewDoc: boolean, content: string, dirsAndDocs: DirsAndDocs } | null>(null, { equal: _ => false});
  
  $canEdit = this._$canEdit.asReadonly();
  $preview = this._$preview.asReadonly();

   constructor() {
    effect(() => {
      const item = this.$item();
      const root = this.fsItemStateService.$root();
      
      if(!item || !root) return;

      const dds = FsItemUtils.getDirsAndDocs(item, root);
      this._$preview.set({
        previewDoc: item.type === 'document',
        content: (item as FsDocument).content,
        dirsAndDocs: dds
      });
    })
   }

  setSelected(x: FsItem) {
    this.fsItemStateService.setSelected(x, true);
  }

  onFileContentChange(content: string) {
    const itemContent = (this.$item() as FsDocument).content;
    this._$canEdit.set(content !== itemContent);
  }

  saveChanges() {
    const clone = Utils.deepClone(this.$item()) as FsDocument;
    const newContent = this.docContent.nativeElement.value;

    clone.content = newContent;
    const event = FsItemUtils.createFsItemEvent('updated', clone as FsItem);
    this.fsBranchStateService.addEvent(event);
  }
}
