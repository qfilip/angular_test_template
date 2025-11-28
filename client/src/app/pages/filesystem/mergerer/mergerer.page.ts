import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PopupService } from '../../../components/common-ui/popup/popup.service';
import { FsBranchUtils } from '../../../components/filesystem/branch/fsBranch.utils';
import { FsBranchStateService } from '../../../components/filesystem/branch/fsBranchState.service';
import { Branch, Commit, FsItemEvent } from '../../../components/filesystem/file/fsitem.models';
import { CommonModule } from '@angular/common';
import { FsCommitPipe } from "../../../components/filesystem/branch/fsCommit.pipe";
import { Utils } from '../../../shared/services/utils';
import { TreeComponent } from "../../../components/filesystem/file/tree/tree.component";
import { FsItemUtils } from '../../../components/filesystem/file/fsitem.utils';

@Component({
  standalone: true,
  selector: 'app-mergerer',
  imports: [CommonModule, RouterLink, FsCommitPipe, TreeComponent],
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
  $newRoot = computed(() => {
    const events = this.$mergeBase();
    return FsItemUtils.mapRootFromEvents(events);
  });
  
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
      this._$resolved.update(x => x + 1);
      return;
    }

    const baseEvents = this.$mergeBase();
    const baseRoot = FsItemUtils.mapRootFromEvents(baseEvents);

    try {
      FsItemUtils.mapRootFromEvents(commit.events, baseRoot);
      this._$mergeBase.update(xs => xs.concat(commit.events))
      this._$resolved.set(this._$resolved() + 1);
    }
    catch (error) {
      this.popup.error(`Could not add commit ${commit.id}`);
      this.popup.error(`Error: ${error}`);
    }
  }
}
