import { Component, computed, inject, signal, ViewChild } from '@angular/core';
import { DialogWrapperComponent } from "../../../common-ui/dialog-wrapper/dialog-wrapper.component";
import { Branch, Commit } from '../../file/fsitem.models';
import { FsBranchStateService } from '../fsBranchState.service';
import { PopupService } from '../../../common-ui/popup/popup.service';
import { tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FsCommitPipe } from "../fsCommit.pipe";
import { FsBranchUtils } from '../fsBranch.utils';

@Component({
  selector: 'app-branch-merge-dialog',
  imports: [CommonModule, DialogWrapperComponent, FsCommitPipe],
  templateUrl: './branch-merge.dialog.html',
  styleUrl: './branch-merge.dialog.css'
})
export class BranchMergeDialog {
  @ViewChild('wrapper') private wrapper!: DialogWrapperComponent;

  private popup = inject(PopupService);
  private branchService = inject(FsBranchStateService);
  private _$source = signal<Branch | null>(null);
  private _$diffs = signal<{ source?: Commit, target?: Commit }[]>([]);
  
  $uncommitted = computed(() => this.branchService.$uncommitted());
  $target = computed(() => this.branchService.$selectedBranch());
  $source = this._$source.asReadonly();
  $branches = computed(() => {
    const branches = this.branchService.$branches();
    const target = this.branchService.$selectedBranch();
    
    return branches.filter(x => x.id !== target?.id);
  });
  $diffs = computed(() => {
    const source = this.$source();
    const target = this.$target();
    if(!source || !target) return null;

    return FsBranchUtils.getDiffs(source, target);
  });

  open() {
    if(!this.canOpen()) return;
    this.setSource(this.$branches()[0].id);
    this.wrapper.open();
  }

  setSource(sourceId: string) {
    const source = this.$branches().find(x => x.id === sourceId)!;
    this.branchService.loadBranch(source)
      .subscribe({
        next: x => this._$source.set(x)
      });
  }

  private canOpen() {
    const enoughBranches = this.$branches().length > 0;
    const targetSelected = !!this.$target();
    const noChanges = this.$uncommitted.length === 0;
    
    if(!enoughBranches)
      this.popup.warn(`${this.$branches().length} branches available. Cannot perform merge`);

    if(!targetSelected)
      this.popup.warn(`Target branch not selected. Cannot perform merge`);

    if(!noChanges)
      this.popup.warn(`Cannot merge with uncommitted changes`);

    return enoughBranches && targetSelected && noChanges;
  }

  close = () => this.wrapper.close();
}
