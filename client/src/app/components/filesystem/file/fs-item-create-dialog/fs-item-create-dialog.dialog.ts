import { Component, ElementRef, inject, signal, ViewChild } from '@angular/core';

import { Utils } from '../../../../shared/services/utils';
import { DialogWrapperComponent } from '../../../common-ui/dialog-wrapper/dialog-wrapper.component';
import { LoaderService } from '../../../common-ui/loader/loader.service';
import { PopupService } from '../../../common-ui/popup/popup.service';
import { FsBranchStateService } from '../../branch/fsBranchState.service';
import { FsItem, FsItemType } from '../fsitem.models';
import { FsItemUtils } from '../fsitem.utils';

@Component({
  standalone: true,
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
  private loaderService = inject(LoaderService);
  private fsBranchStateService = inject(FsBranchStateService);
  
  private _$fsType = signal<FsItemType>(this.types[0]);
  private parent!: FsItem;
  private root!: FsItem;
  
  $fsType = this._$fsType.asReadonly();

  open(parent: FsItem, root: FsItem) {
    if(parent.type === 'document') {
      this.popupService.warn('Directory cannot be created while document is selected.');
      return;
    }

    this.parent = parent;
    this.root = root;
    this.wrapper.open();
  };
  
  setType = (x: string) => this._$fsType.set(x as FsItemType);
  
  edit() {
    this.loaderService.show();
    const name = this.fsItemName.nativeElement.value;
    const fsItemRes = FsItemUtils.createFsItem(this.root, this.parent, name, this.$fsType());
    
    if(fsItemRes.errors.length > 0) {
      this.loaderService.hide();
      Utils.printErrors(this.popupService, fsItemRes.errors);
      return;
    }
    
    const event = FsItemUtils.createFsItemEvent('created', fsItemRes.data!);
    this.fsBranchStateService.addEvent(event);

    this.loaderService.hide();
    this.close();
  }
  
  close = () => {
    this._$fsType.set(this.types[0]);
    this.fsItemName.nativeElement.value = '';
    this.wrapper.close();
  }
}
