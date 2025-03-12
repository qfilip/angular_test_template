import { CommonModule } from '@angular/common';
import { Component, computed, inject, ViewChild } from '@angular/core';

import { ROOT } from '../../fsConstants';
import { FsItemCreateDialog } from '../fs-item-create-dialog/fs-item-create-dialog.dialog';
import { FsItem } from '../fsitem.models';
import { FsItemStateService } from '../fsItemState.service';
import { FsItemUtils } from '../fsitem.utils';
import { DialogService } from '../../../common-ui/simple-dialog/dialog.service';
import { FsBranchStateService } from '../../branch/fsBranchState.service';
import { PopupService } from '../../../common-ui/popup/popup.service';

@Component({
  selector: 'app-fs-toolbar',
  imports: [CommonModule, FsItemCreateDialog],
  templateUrl: './fs-toolbar.component.html',
  styleUrl: './fs-toolbar.component.css'
})
export class FsToolbarComponent {
  @ViewChild('createDialog') private createDialog!: FsItemCreateDialog;
  
  private popup = inject(PopupService);
  private dialogService = inject(DialogService);
  private fsItemStateService = inject(FsItemStateService);
  private fsBranchStateService = inject(FsBranchStateService);
  
  $selected = computed(() => this.fsItemStateService.$selected());
  
  selectRoot() {
    this.fsItemStateService.setSelected(ROOT, true);
  }

  async openCreateDialog(fsi: FsItem) {
    const root = this.fsItemStateService.$root();
    this.createDialog.open(fsi, root!);
  }

  delete() {
    const item = this.$selected()!;

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
