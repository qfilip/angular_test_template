import { CommonModule } from "@angular/common";
import { Component, OnInit, ViewChild, inject, signal, effect } from "@angular/core";
import { Router } from "@angular/router";
import { DialogService } from "../../../../common-ui/services/dialog.service";
import { PopupService } from "../../../../common-ui/services/popup.service";
import { Branch, FsItemEvent } from "../../../models/fsitem.models";
import { FsItemEventPipe } from "../../../pipes/fsEvent.pipe";
import { FsBranchStateService } from "../../../services/fsBranchState.service";
import { BranchCloneDialog } from "../branch-clone-dialog/branch-clone.dialog";
import { BranchCreateDialog } from "../branch-create.dialog/branch-create.dialog";


@Component({
  standalone: true,
  selector: 'app-tracker',
  imports: [CommonModule, BranchCreateDialog, FsItemEventPipe, BranchCloneDialog],
  templateUrl: './tracker.component.html',
  styleUrl: './tracker.component.css'
})
export class TrackerComponent implements OnInit {
  @ViewChild('createDialog') createDialog!: BranchCreateDialog;
  @ViewChild('cloneDialog') cloneDialog!: BranchCloneDialog;
  
  private router = inject(Router);
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

  setBranch = (branchId: string) => this.branchService.selectBranch(branchId);

  createBranch = () => this.createDialog.open(this.$branches());

  cloneBranch = () => this.cloneDialog.open();

  merge() {
    const enoughBranches = this.$branches().length > 0;
    const noChanges = this.$uncommitted.length === 0;
    
    if(!enoughBranches)
      this.popupService.warn(`${this.$branches().length} branches available. Cannot perform merge`);

    if(!noChanges)
      this.popupService.warn(`Cannot merge with uncommitted changes`);

    if(enoughBranches && noChanges) {
      this.router.navigate(['filesystem/mergerer']);
    }
  }

  commit() {
    if(!this.$selectedBranch()) {
      this.popupService.warn('No branch selected');
      return;
    }

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
