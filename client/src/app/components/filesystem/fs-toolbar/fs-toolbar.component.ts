import { Component, Input, input, ViewChild } from '@angular/core';
import { FsItem } from '../fsitem.models';
import { FsItemCreateDialog } from "../fs-item-create-dialog/fs-item-create-dialog.dialog";

@Component({
  selector: 'app-fs-toolbar',
  imports: [FsItemCreateDialog],
  templateUrl: './fs-toolbar.component.html',
  styleUrl: './fs-toolbar.component.css'
})
export class FsToolbarComponent {
  @ViewChild('createDialog') private createDialog!: FsItemCreateDialog;
  @Input({ required: true }) fsItem!: FsItem;

  openCreateDialog() {
    this.createDialog.open(this.fsItem.id);
  }
}
