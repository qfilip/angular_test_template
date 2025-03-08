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

  private popupService = inject(PopupService);
  private fsItemStateService = inject(FsItemStateService);
  private _$fsType = signal<FsItemType>('document');
  private parentId = '';
  readonly types: FsItemType[] = ['directory', 'document'];
  
  $fsType = this._$fsType.asReadonly();

  open(parentId: string) {
    this.parentId = parentId;
    this.wrapper.open();
  };

  close = () => this.wrapper.close();

  setType = (x: string) => this._$fsType.set(x as FsItemType);

  edit() {
    const name = this.fsItemName.nativeElement.value;
    const fsItem = FsItemUtils.createFsItem(name, 'directory');
    const errors = FsItemUtils.validate(fsItem);
    
    if(errors.length > 0) {
      Utils.printErrors(this.popupService, errors);
      return;
    }

    const addedToTree = this.fsItemStateService.add(this.parentId, fsItem);
    this.wrapper.close();
  }
}
