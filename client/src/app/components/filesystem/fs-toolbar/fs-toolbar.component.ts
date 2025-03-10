import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';

import { FsItemCreateDialog } from '../fs-item-create-dialog/fs-item-create-dialog.dialog';
import { ROOT } from '../fsConstants';
import { FsItem } from '../fsitem.models';
import { FsItemNamePipe } from '../fsitem.pipes';
import { FsItemStateService } from '../fsItemState.service';

@Component({
  selector: 'app-fs-toolbar',
  imports: [CommonModule, FsItemCreateDialog, FsItemNamePipe],
  templateUrl: './fs-toolbar.component.html',
  styleUrl: './fs-toolbar.component.css'
})
export class FsToolbarComponent {
  @ViewChild('createDialog') private createDialog!: FsItemCreateDialog;
  
  private fsItemStateService = inject(FsItemStateService);
  
  selected$!: Observable<FsItem>;

  ngOnInit(): void {
    this.selected$ = this.fsItemStateService.selected$;
  }

  selectRoot() {
    this.fsItemStateService.setSelected(ROOT, true);
  }

  async openCreateDialog(fsi: FsItem) {
    const root = await firstValueFrom(this.fsItemStateService.root$);
    this.createDialog.open(fsi, root!);
  }
}
