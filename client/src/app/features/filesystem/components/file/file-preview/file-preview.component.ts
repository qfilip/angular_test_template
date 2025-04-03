import { CommonModule } from '@angular/common';
import { Component, effect, ElementRef, inject, signal, ViewChild } from '@angular/core';


import { FsItemRenameDialog } from "../fs-item-rename-dialog/fs-item-rename.dialog";
import { Utils } from '../../../../../shared/services/utils';
import { DialogService } from '../../../../common-ui/services/dialog.service';
import { PopupService } from '../../../../common-ui/services/popup.service';
import { ROOT } from '../../../fsConstants';
import { FsItem, DirsAndDocs, FsDocument } from '../../../models/fsitem.models';
import { FsItemNamePipe } from '../../../pipes/fsitem.pipes';
import { FsBranchStateService } from '../../../services/fsBranchState.service';
import { FsItemStateService } from '../../../services/fsItemState.service';
import { FsItemUtils } from '../../../utils/fsitem.utils';

@Component({
  standalone: true,
  selector: 'app-file-preview',
  imports: [CommonModule, FsItemNamePipe, FsItemRenameDialog],
  templateUrl: './file-preview.component.html',
  styleUrl: './file-preview.component.css'
})
export class FilePreviewComponent {
  @ViewChild('docContent') private docContent!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('renameDialog') private renameDialog!: FsItemRenameDialog;
  
  private popup = inject(PopupService);
  private dialogService = inject(DialogService);
  private fsItemStateService = inject(FsItemStateService);
  private fsBranchStateService = inject(FsBranchStateService);
  
  private _$item = signal<FsItem | null>(null);
  private _$canEdit = signal<boolean>(false);
  private _$preview = signal<{ previewDoc: boolean, content: string, dirsAndDocs: DirsAndDocs } | null>(null, { equal: _ => false});
  
  $item = this._$item.asReadonly();
  $canEdit = this._$canEdit.asReadonly();
  $preview = this._$preview.asReadonly();

   constructor() {
    effect(() => {
      const selected = this.fsItemStateService.$selected();
      const root = this.fsItemStateService.$root();
      
      if(!selected || !root) return;

      this._$item.set(selected);
      const dds = FsItemUtils.getDirsAndDocs(selected, root);
      this._$preview.set({
        previewDoc: selected.type === 'document',
        content: (selected as FsDocument).content,
        dirsAndDocs: dds.data!
      });
    })
   }

  setSelected(x: FsItem) {
    this.fsItemStateService.setSelected(x, true);
  }

  onFileContentChange(content: string) {
    const itemContent = (this._$item() as FsDocument).content;
    this._$canEdit.set(content !== itemContent);
  }

  saveChanges() {
    const clone = Utils.deepClone(this._$item()) as FsDocument;
    const newContent = this.docContent.nativeElement.value;

    clone.content = newContent;
    const event = FsItemUtils.createFsItemEvent('updated', clone as FsItem);
    this.fsBranchStateService.addEvent(event);
    this.popup.ok('File changed');
    this._$canEdit.set(false);
  }

  rename() {
    this.renameDialog.open();
  }

  delete() {
    const item = this._$item()!;

    if(item.id === ROOT.id) {
      this.dialogService.openInfo('Root directory cannot be deleted');
      return;
    }
    
    const dds = FsItemUtils.getChildren(item);
    const message = `
      This action will delete selected item and all of its children:
      directories: ${dds.dirs.length},
      documents: ${dds.docs.length},
      Do you wish to proceed?
    `;

    const execute = () => {
      const event = FsItemUtils.createFsItemEvent('deleted', item as FsItem);
      this.fsBranchStateService.addEvent(event);
      this.popup.ok('File changed');
    }

    this.dialogService.openCheck(message, () => execute());
  }
}
