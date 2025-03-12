import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Branch } from '../fsitem.models';
import { FsBranchStateService } from '../fsBranchState.service';
import { CommonModule } from '@angular/common';
import { BranchCreateDialog } from "../branch-create.dialog/branch-create.dialog";

@Component({
  selector: 'app-tracker',
  imports: [CommonModule, BranchCreateDialog],
  templateUrl: './tracker.component.html',
  styleUrl: './tracker.component.css'
})
export class TrackerComponent implements OnInit {
  @ViewChild('createDialog') createDialog!: BranchCreateDialog;
  
  private branchService = inject(FsBranchStateService);

  private $branches = signal<Branch[]>([]);
  branches$!: Observable<Branch[]>;
  selectedBranch$!: Observable<Branch | null>;

  ngOnInit(): void {
    this.branches$ = this.branchService.branches$
    .pipe(
      tap(xs => this.$branches.set(xs))
    );

    this.selectedBranch$ = this.branchService.selectedBranch$;
  }

  createBranch() {
    this.createDialog.open(this.$branches());
  }

  cloneBranch() {
    
  }

  pull() {
    
  }

  commit() {
    
  }
}
