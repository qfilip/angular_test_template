import { Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { DialogWrapperComponent } from "../../common-ui/dialog-wrapper/dialog-wrapper.component";
import { PopupService } from '../../common-ui/popup/popup.service';
import { FsItemUtils } from '../fsitem.utils';
import { FsItemType } from '../fsitem.models';
import { Utils } from '../../../shared/services/utils';
import { FsItemStateService } from '../fsItemState.service';

@Component({
  selector: 'app-fs-item-create-dialog',
  imports: [DialogWrapperComponent],
  templateUrl: './fs-item-create-dialog.dialog.html',
  styleUrl: './fs-item-create-dialog.dialog.css'
})
export class FsItemCreateDialog {
  @ViewChild('wrapper') private wrapper!: DialogWrapperComponent;
  @ViewChild('fsItemName') private fsItemName!: ElementRef<HTMLInputElement>;

  readonly types: FsItemType[] = ['directory', 'document'];
  private popupService = inject(PopupService);
  private fsItemStateService = inject(FsItemStateService);
  private _$fsType = signal<FsItemType>(this.types[0]);
  private parentId = '';
  
  $fsType = this._$fsType.asReadonly();

  open(parentId: string) {
    this.parentId = parentId;
    this.wrapper.open();
  };

  close = () => this.wrapper.close();

  setType = (x: string) => this._$fsType.set(x as FsItemType);

  edit() {
    debugger
    const name = this.fsItemName.nativeElement.value;
    const fsItemRes = FsItemUtils.createFsItem(this.parentId, name, this.$fsType());
    
    if(fsItemRes.errors.length > 0) {
      Utils.printErrors(this.popupService, fsItemRes.errors);
      return;
    }
    
    const addedItem = this.fsItemStateService.add(this.parentId, fsItemRes.data!);
    if(!addedItem) {
      this.popupService.push({
        color: 'red',
        header: 'Error',
        text: 'Failed to add item'
      });
    }

    this.clearDialogData();
    this.wrapper.close();
  }

  private clearDialogData() {
    this._$fsType.set('document');
    this.parentId = '';
  }
}
