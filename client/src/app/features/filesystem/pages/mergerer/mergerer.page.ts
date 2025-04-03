import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Utils } from '../../../../shared/services/utils';
import { PopupService } from '../../../common-ui/services/popup.service';
import { Branch, FsItemEvent, Commit } from '../../models/fsitem.models';
import { FsCommitPipe } from '../../pipes/fsCommit.pipe';
import { FsBranchStateService } from '../../services/fsBranchState.service';
import { FsBranchUtils } from '../../utils/fsBranch.utils';

@Component({
  standalone: true,
  selector: 'app-mergerer',
  imports: [CommonModule, RouterLink, FsCommitPipe],
  templateUrl: './mergerer.page.html',
  styleUrl: './mergerer.page.css'
})
export class MergererPage implements OnInit {
  private popup = inject(PopupService);
  private branchService = inject(FsBranchStateService);
  private _$source = signal<Branch | null>(null);
  private _$mergeBase = signal<FsItemEvent[]>([], { equal: _ => false});
  private _$resolved = signal(0, { equal: _ => false });

  $uncommitted = computed(() => this.branchService.$uncommitted());
  $target = computed(() => Utils.deepClone(this.branchService.$selectedBranch()));
  $source = this._$source.asReadonly();
  $mergeBase = this._$mergeBase.asReadonly();
  $resolved = this._$resolved.asReadonly();
  
  $branches = computed(() => {
    const branches = this.branchService.$branches();
    const target = this.branchService.$selectedBranch();

    return branches.filter(x => x.id !== target?.id);
  });

  $diffs = computed(() => {
    const source = this.$source();
    const target = this.$target();
    if (!source || !target) return null;

    return FsBranchUtils.zipDiffs(source, target);
  });

  ngOnInit(): void {
    const source = this.$branches()![0];
    const target = this.branchService.$selectedBranch()!;
    const equals = FsBranchUtils.zipEquals(source, target);

    this._$source.set(Utils.deepClone(source));
    this._$mergeBase.set(Utils.deepClone(equals.map(x => x.events).flat()));
  }

  setSource(sourceId: string) {
    const source = this.$branches().find(x => x.id === sourceId)!;
    this.branchService.loadBranch(source)
      .subscribe({
        next: x => this._$source.set(Utils.deepClone(x))
      });
  }

  useCommit(commit: Commit | undefined) {
    if(!commit) {
      this._$resolved.set(this._$resolved() + 1);
      return;
    }

    // const branchForUpdate = Utils.deepClone(this._$final()!);
    // branchForUpdate.commits.push(commit);
    
    // this._$final.set(branchForUpdate);
    this._$resolved.set(this._$resolved() + 1);
  }
}
