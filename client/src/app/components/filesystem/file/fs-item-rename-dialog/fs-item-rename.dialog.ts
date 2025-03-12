import { Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { DialogWrapperComponent } from '../../../common-ui/dialog-wrapper/dialog-wrapper.component';
import { LoaderService } from '../../../common-ui/loader/loader.service';
import { PopupService } from '../../../common-ui/popup/popup.service';
import { FsBranchStateService } from '../../branch/fsBranchState.service';
import { FsItemStateService } from '../fsItemState.service';
import { FsItemUtils } from '../fsitem.utils';
import { ROOT } from '../../fsConstants';
import { Utils } from '../../../../shared/services/utils';
import { FsItem } from '../fsitem.models';

@Component({
  selector: 'app-fs-item-rename-dialog',
  imports: [DialogWrapperComponent],
  templateUrl: './fs-item-rename.dialog.html',
  styleUrl: './fs-item-rename.dialog.css'
})
export class FsItemRenameDialog {
  @ViewChild('wrapper') private wrapper!: DialogWrapperComponent;
  @ViewChild('fsItemName') private fsItemName!: ElementRef<HTMLInputElement>;
  
  private popupService = inject(PopupService);
  private fileService = inject(FsItemStateService);
  private branchService = inject(FsBranchStateService);

  private _$name = signal<string>('');
  $name = this._$name.asReadonly();

  open() {
    if(!this.canRename()) return;
    this.wrapper.open();
  };
  
  rename() {
    const name = this.fsItemName.nativeElement.value;
    const root = this.fileService.$root()!;
    const selected = this.fileService.$selected()!;
    const parent = FsItemUtils.getParent(selected, root)!;
    const fsItemRes = FsItemUtils.createFsItem(root, parent, name, selected.type);
    
    if(fsItemRes.errors.length > 0) {
      Utils.printErrors(this.popupService, fsItemRes.errors);
      return;
    }

    const updatedClone = FsItemUtils.cloneWithUpdatedChildPaths(selected, fsItemRes.data!.path);
    const event = FsItemUtils.createFsItemEvent('updated', updatedClone);
    this.branchService.addEvent(event);
    this.popupService.ok('Item renamed');
    this.wrapper.close();
  }

  close = () => {
    this.fsItemName.nativeElement.value = '';
    this.wrapper.close();
  }

  private canRename() {
    const selected = this.fileService.$selected()!;
    const canRename = selected.id !== ROOT.id;
    if(canRename) {
      const name = FsItemUtils.getName(selected.path);
      this._$name.set(name);
    }
    else {
      this.popupService.warn('Root directory cannot be renamed');
    }

    return canRename;
  }
}
