import { Component, effect, inject, OnInit, signal, ViewChild } from '@angular/core';
import { FsBranchStateService } from '../fsBranchState.service';
import { CommonModule } from '@angular/common';
import { BranchCreateDialog } from "../branch-create.dialog/branch-create.dialog";
import { Branch, FsItemEvent } from '../../file/fsitem.models';
import { PopupService } from '../../../common-ui/popup/popup.service';
import { FsItemEventPipe } from "../fsEvent.pipe";
import { DialogService } from '../../../common-ui/simple-dialog/dialog.service';
import { BranchCloneDialog } from "../branch-clone-dialog/branch-clone.dialog";

@Component({
  selector: 'app-tracker',
  imports: [CommonModule, BranchCreateDialog, FsItemEventPipe, BranchCloneDialog],
  templateUrl: './tracker.component.html',
  styleUrl: './tracker.component.css'
})
export class TrackerComponent implements OnInit {
  @ViewChild('createDialog') createDialog!: BranchCreateDialog;
  @ViewChild('cloneDialog') cloneDialog!: BranchCloneDialog;
  
  private popupService = inject(PopupService);
  private dialogService = inject(DialogService);
  private branchService = inject(FsBranchStateService);

  
  private _$branches = signal<Branch[]>([]);
  private _$selectedBranch = signal<Branch | null>(null);
  private _$uncommited = signal<FsItemEvent[]>([]);

  $branches = this._$branches.asReadonly();
  $selectedBranch = this._$selectedBranch.asReadonly();
  $uncommited = this._$uncommited.asReadonly();

  constructor() {
    effect(() => {
      const x = this.branchService.$branches();
      this._$branches.set(x);
    });

    effect(() => {
      const x = this.branchService.$selectedBranch();
      this._$selectedBranch.set(x);
    });

    effect(() => {
      const x = this.branchService.$uncommited();
      this._$uncommited.set(x);
    });
  }
  ngOnInit(): void {
    this.branchService.loadBranches();
  }

  createBranch(uncommited: FsItemEvent[]) {
    if(uncommited.length > 0) {
      this.popupService.warn('Cannot create new branch until all changes are commited');
      return;
    }
    this.createDialog.open(this.$branches());
  }

  cloneBranch = () => this.cloneDialog.open();

  pull() {
    
  }

  commit(numOfChanges: number) {
    this.dialogService.openCheck(
      `Commit ${numOfChanges} changes?`,
      () => this.branchService.commit()
    );
  }

  revertTo(idx: number) {
    this.dialogService.openCheck(
      'All changes after (including this one) will be lost. Continue?',
      () => this.branchService.revertTo(idx)
    );
  }
}
