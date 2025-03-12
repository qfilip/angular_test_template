import { CommonModule } from '@angular/common';
import { Component, computed, inject, ViewChild } from '@angular/core';

import { ROOT } from '../../fsConstants';
import { FsItemCreateDialog } from '../fs-item-create-dialog/fs-item-create-dialog.dialog';
import { FsItem } from '../fsitem.models';
import { FsItemStateService } from '../fsItemState.service';

@Component({
  selector: 'app-fs-toolbar',
  imports: [CommonModule, FsItemCreateDialog],
  templateUrl: './fs-toolbar.component.html',
  styleUrl: './fs-toolbar.component.css'
})
export class FsToolbarComponent {
  @ViewChild('createDialog') private createDialog!: FsItemCreateDialog;
  
  private fsItemStateService = inject(FsItemStateService);
  
  $selected = computed(() => this.fsItemStateService.$selected());
  
  selectRoot() {
    this.fsItemStateService.setSelected(ROOT, true);
  }

  async openCreateDialog(fsi: FsItem) {
    const root = this.fsItemStateService.$root();
    this.createDialog.open(fsi, root!);
  }
}
