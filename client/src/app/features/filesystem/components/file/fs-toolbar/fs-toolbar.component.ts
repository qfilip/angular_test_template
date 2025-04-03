import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { DialogService } from '../../../../common-ui/services/dialog.service';
import { PopupService } from '../../../../common-ui/services/popup.service';
import { ROOT } from '../../../fsConstants';
import { FsItem } from '../../../models/fsitem.models';
import { FsBranchStateService } from '../../../services/fsBranchState.service';
import { FsItemStateService } from '../../../services/fsItemState.service';
import { FsItemUtils } from '../../../utils/fsitem.utils';
import { FsItemCreateDialog } from '../fs-item-create-dialog/fs-item-create-dialog.dialog';

@Component({
  standalone: true,
  selector: 'app-fs-toolbar',
  imports: [CommonModule, FsItemCreateDialog],
  templateUrl: './fs-toolbar.component.html',
  styleUrl: './fs-toolbar.component.css'
})
export class FsToolbarComponent implements OnInit, OnDestroy {
  @ViewChild('createDialog') private createDialog!: FsItemCreateDialog;
  
  private popup = inject(PopupService);
  private dialogService = inject(DialogService);
  private fsItemStateService = inject(FsItemStateService);
  private fsBranchStateService = inject(FsBranchStateService);
  
  $selected = computed(() => this.fsItemStateService.$selected());
  $searchActive = computed(() => this.fsItemStateService.$searchActive());

  private unsub$ = new Subject();
  private searchQuery$ = new Subject<string>();

  ngOnInit() {
    this.searchQuery$.pipe(
      takeUntil(this.unsub$),
      debounceTime(200),
      distinctUntilChanged(),
    ).subscribe({
      next: x => this.fsItemStateService.search(x)
    });
  }

  ngOnDestroy() {
    this.unsub$.next(1);
    this.unsub$.complete();
  }

  selectRoot() {
    this.fsItemStateService.setSelected(ROOT, true);
  }

  toggleSearch = () => this.fsItemStateService.toggleSearch();

  setQuery = (q: string) => this.searchQuery$.next(q); 

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
