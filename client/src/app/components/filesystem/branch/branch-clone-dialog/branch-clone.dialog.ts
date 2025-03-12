import { Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { DialogWrapperComponent } from "../../../common-ui/dialog-wrapper/dialog-wrapper.component";
import { LoaderService } from '../../../common-ui/loader/loader.service';
import { PopupService } from '../../../common-ui/popup/popup.service';
import { FsBranchStateService } from '../fsBranchState.service';
import { FsBranchUtils } from '../fsBranch.utils';
import { Utils } from '../../../../shared/services/utils';

@Component({
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
    const branches = this.fsBranchStateService.$branches();
    const name = this.name.nativeElement.value;
    const res = FsBranchUtils.createBranch(name, branches);
    
    if(res.errors.length > 0) {
      Utils.printErrors(this.popupService, res.errors);
      return;
    }
    
    this.fsBranchStateService.createBranch(res.data!);

    this.popupService.push({
      color: 'green',
      header: 'Ok',
      text: 'Branch cloned'
    });
    
    this.close();
  }
  
  close = () => {
    this.wrapper.close();
  }

  private canClone() {
    const branch = this.fsBranchStateService.$selectedBranch();
    const changes = this.fsBranchStateService.$uncommited();
    
    const branchSelected = !!branch;
    const noChanges = changes.length === 0; 

    if(!branchSelected)
        this.popupService.warn('No branch selected for cloning');
    else
      this._$name.set(`${branch.name}-clone`);

    if(!noChanges)
      this.popupService.warn('All changes must be commited or cleared before cloning the branch');

    return branchSelected && noChanges;
  }
}
