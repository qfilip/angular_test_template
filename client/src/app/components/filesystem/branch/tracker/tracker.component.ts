import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { FsBranchStateService } from '../fsBranchState.service';
import { CommonModule } from '@angular/common';
import { BranchCreateDialog } from "../branch-create.dialog/branch-create.dialog";
import { Branch, FsItemEvent } from '../../file/fsitem.models';
import { PopupService } from '../../../common-ui/popup/popup.service';

@Component({
  selector: 'app-tracker',
  imports: [CommonModule, BranchCreateDialog],
  templateUrl: './tracker.component.html',
  styleUrl: './tracker.component.css'
})
export class TrackerComponent implements OnInit {
  @ViewChild('createDialog') createDialog!: BranchCreateDialog;
  
  private popupService = inject(PopupService);
  private branchService = inject(FsBranchStateService);

  private $branches = signal<Branch[]>([]);
  
  branches$!: Observable<Branch[]>;
  selectedBranch$!: Observable<Branch | null>;
  uncommited$!: Observable<FsItemEvent[]>;

  ngOnInit(): void {
    this.branchService.loadBranches();
    
    this.branches$ = this.branchService.branches$
    .pipe(
      tap(xs => this.$branches.set(xs))
    );

    this.selectedBranch$ = this.branchService.selectedBranch$;
    this.uncommited$ = this.branchService.uncommited$;
  }

  createBranch(uncommited: FsItemEvent[]) {
    if(uncommited.length > 0) {
      this.popupService.warn('Cannot create new branch until all changes are commited');
      return;
    }
    this.createDialog.open(this.$branches());
  }

  cloneBranch() {
    
  }

  pull() {
    
  }

  commit() {
    
  }
}
