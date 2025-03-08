import { Component, inject, Input, ViewChild } from '@angular/core';
import { FsItem } from '../fsitem.models';
import { FsItemCreateDialog } from "../fs-item-create-dialog/fs-item-create-dialog.dialog";
import { FsItemStateService } from '../fsItemState.service';
import { map, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FsItemUtils } from '../fsitem.utils';
import { root } from '../fsConstants';

@Component({
  selector: 'app-fs-toolbar',
  imports: [CommonModule, FsItemCreateDialog],
  templateUrl: './fs-toolbar.component.html',
  styleUrl: './fs-toolbar.component.css'
})
export class FsToolbarComponent {
  @ViewChild('createDialog') private createDialog!: FsItemCreateDialog;
  
  private fsItemStateService = inject(FsItemStateService);
  
  selected$!: Observable<{ item: FsItem, name: string }>;

  ngOnInit(): void {
    this.selected$ = this.fsItemStateService.selected$
      .pipe(
        map(x => ({ item: x, name: FsItemUtils.getName(x.id) }))
      );
  }

  selectRoot() {
    this.fsItemStateService.setSelected(root);
  }

  openCreateDialog(fsi: FsItem) {
    this.createDialog.open(fsi.id);
  }
}
