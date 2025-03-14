import { Component, effect, inject, OnInit, signal, ViewChild } from '@angular/core';
import { FsBranchStateService } from '../fsBranchState.service';
import { CommonModule } from '@angular/common';
import { BranchCreateDialog } from "../branch-create.dialog/branch-create.dialog";
import { Branch, FsItemEvent } from '../../file/fsitem.models';
import { PopupService } from '../../../common-ui/popup/popup.service';
import { FsItemEventPipe } from "../fsEvent.pipe";
import { DialogService } from '../../../common-ui/simple-dialog/dialog.service';
import { BranchCloneDialog } from "../branch-clone-dialog/branch-clone.dialog";
import { BranchMergeDialog } from "../branch-merge-dialog/branch-merge.dialog";

@Component({
  selector: 'app-tracker',
  imports: [CommonModule, BranchCreateDialog, FsItemEventPipe, BranchCloneDialog, BranchMergeDialog],
  templateUrl: './tracker.component.html',
  styleUrl: './tracker.component.css'
})
export class TrackerComponent implements OnInit {
  @ViewChild('createDialog') createDialog!: BranchCreateDialog;
  @ViewChild('cloneDialog') cloneDialog!: BranchCloneDialog;
  @ViewChild('mergeDialog') mergeDialog!: BranchMergeDialog;
  
  private popupService = inject(PopupService);
  private dialogService = inject(DialogService);
  private branchService = inject(FsBranchStateService);

  
  private _$branches = signal<Branch[]>([]);
  private _$selectedBranch = signal<Branch | null>(null);
  private _$uncommitted = signal<FsItemEvent[]>([]);

  $branches = this._$branches.asReadonly();
  $selectedBranch = this._$selectedBranch.asReadonly();
  $uncommitted = this._$uncommitted.asReadonly();

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
      const x = this.branchService.$uncommitted();
      this._$uncommitted.set(x);
    });
  }
  ngOnInit(): void {
    this.branchService.loadBranches();
  }

  createBranch = () => this.createDialog.open(this.$branches());

  cloneBranch = () => this.cloneDialog.open();

  merge = () => this.mergeDialog.open(); 

  commit() {
    const numOfChanges = this.$uncommitted().length;
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
