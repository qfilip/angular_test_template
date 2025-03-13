import { Component, computed, inject, signal, ViewChild } from '@angular/core';
import { DialogWrapperComponent } from "../../../common-ui/dialog-wrapper/dialog-wrapper.component";
import { Branch } from '../../file/fsitem.models';
import { FsBranchStateService } from '../fsBranchState.service';
import { PopupService } from '../../../common-ui/popup/popup.service';

@Component({
  selector: 'app-branch-merge-dialog',
  imports: [DialogWrapperComponent],
  templateUrl: './branch-merge.dialog.html',
  styleUrl: './branch-merge.dialog.css'
})
export class BranchMergeDialog {
  @ViewChild('wrapper') private wrapper!: DialogWrapperComponent;

  private popup = inject(PopupService);
  private branchService = inject(FsBranchStateService);
  private _$source = signal<Branch | null>(null);
  private _$diffs = signal<string[]>([]);
  
  $uncommited = computed(() => this.branchService.$uncommited());
  $target = computed(() => this.branchService.$selectedBranch());
  $source = this._$source.asReadonly();
  $branches = computed(() => {
    const branches = this.branchService.$branches();
    const target = this.branchService.$selectedBranch();
    
    return branches.filter(x => x.id !== target?.id);
  });
  $diffs = this._$diffs.asReadonly();

  open() {
    if(!this.canOpen()) return;
    this.getConflicts();
    this.wrapper.open();
  }

  getConflicts() {
    const src = this.$source()!.commits;
    const tgt = this.$target()!.commits;
  }

  setSource(sourceId: string) {
    const source = this.$branches().find(x => x.id === sourceId)!;
    this._$source.set(source);
  }

  private canOpen() {
    const enoughBranches = this.$branches().length > 0;
    const targetSelected = !!this.$target();
    const noChanges = this.$uncommited.length === 0;
    
    if(!enoughBranches)
      this.popup.warn(`${this.$branches().length} branches available. Cannot perform merge`);

    if(!targetSelected)
      this.popup.warn(`Target branch not selected. Cannot perform merge`);

    if(!noChanges)
      this.popup.warn(`Cannot merge with uncommited changes`);

    return enoughBranches && targetSelected && noChanges;
  }

  close = () => this.wrapper.close();
}
