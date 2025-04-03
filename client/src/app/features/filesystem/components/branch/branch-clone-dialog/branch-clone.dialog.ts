import { Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { Utils } from '../../../../../shared/services/utils';
import { DialogWrapperComponent } from '../../../../common-ui/components/dialog-wrapper/dialog-wrapper.component';
import { PopupService } from '../../../../common-ui/services/popup.service';
import { FsBranchStateService } from '../../../services/fsBranchState.service';
import { FsBranchUtils } from '../../../utils/fsBranch.utils';

@Component({
  standalone: true,
  selector: 'app-branch-clone-dialog',
  imports: [DialogWrapperComponent],
  templateUrl: './branch-clone.dialog.html',
  styleUrl: './branch-clone.dialog.css'
})
export class BranchCloneDialog {
  @ViewChild('wrapper') private wrapper!: DialogWrapperComponent;
  @ViewChild('branchName') private name!: ElementRef<HTMLInputElement>;

  private popupService = inject(PopupService);
  private fsBranchStateService = inject(FsBranchStateService);

  private _$name = signal<string>('');
  $name = this._$name.asReadonly();
  
  open() {
    if(!this.canClone()) return;
    this.wrapper.open();
  }
  
  clone() {
    const name = this.name.nativeElement.value;
    const all = this.fsBranchStateService.$branches();
    const original = this.fsBranchStateService.$selectedBranch()!;
    const res = FsBranchUtils.cloneBranch(name, original, all);
    
    if(res.errors.length > 0) {
      Utils.printErrors(this.popupService, res.errors);
      return;
    }
    
    this.fsBranchStateService.createBranch(res.data!);
    this.popupService.ok('Branch cloned');
    this.close();
  }
  
  close = () => {
    this.wrapper.close();
  }

  private canClone() {
    const branch = this.fsBranchStateService.$selectedBranch();
    const changes = this.fsBranchStateService.$uncommitted();
    
    const branchSelected = !!branch;
    const noChanges = changes.length === 0; 

    if(!branchSelected)
        this.popupService.warn('No branch selected for cloning');
    else
      this._$name.set(`${branch.name}-clone`);

    if(!noChanges)
      this.popupService.warn('All changes must be committed or cleared before cloning the branch');

    return branchSelected && noChanges;
  }
}
