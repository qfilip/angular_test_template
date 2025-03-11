import { Component, inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Branch } from '../fsitem.models';
import { FsBranchStateService } from '../fsBranchState.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tracker',
  imports: [CommonModule],
  templateUrl: './tracker.component.html',
  styleUrl: './tracker.component.css'
})
export class TrackerComponent implements OnInit {
  private branchService = inject(FsBranchStateService);

  branches$!: Observable<Branch[]>;
  selectedBranch$!: Observable<Branch | null>;

  ngOnInit(): void {
    this.branches$ = this.branchService.branches$;
    this.selectedBranch$ = this.branchService.selectedBranch$;
  }
}
