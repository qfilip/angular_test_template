import { Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { FsBranchStateService } from '../fsBranchState.service';
import { Utils } from '../../../../shared/services/utils';
import { DialogWrapperComponent } from '../../../common-ui/dialog-wrapper/dialog-wrapper.component';
import { LoaderService } from '../../../common-ui/loader/loader.service';
import { PopupService } from '../../../common-ui/popup/popup.service';
import { Branch } from '../../file/fsitem.models';
import { FsBranchUtils } from '../fsBranch.utils';

@Component({
  selector: 'app-branch-create-dialog',
  imports: [DialogWrapperComponent],
  templateUrl: './branch-create.dialog.html',
  styleUrl: './branch-create.dialog.css'
})
export class BranchCreateDialog {
  @ViewChild('wrapper') private wrapper!: DialogWrapperComponent;
  @ViewChild('branchName') private name!: ElementRef<HTMLInputElement>;

  private popupService = inject(PopupService);
  private loaderService = inject(LoaderService);
  private fsBranchStateService = inject(FsBranchStateService);

  private $branches = signal<Branch[]>([]);
  
  open(allBranches: Branch[]) {
    if(this.fsBranchStateService.$uncommitted().length > 0) {
      this.popupService.warn('Cannot create new branch until all changes are committed');
      return;
    }

    this.$branches.set(allBranches);
    this.wrapper.open();
  }
  
  edit() {
    this.loaderService.show();
    
    const name = this.name.nativeElement.value;
    const res = FsBranchUtils.createBranch(name, this.$branches());
    
    if(res.errors.length > 0) {
      this.loaderService.hide();
      Utils.printErrors(this.popupService, res.errors);
      return;
    }
    
    this.fsBranchStateService.createBranch(res.data!);

    this.loaderService.hide();
    this.popupService.push({
      color: 'green',
      header: 'Ok',
      text: 'Branch created'
    });
    
    this.close();
  }
  
  close = () => {
    this.wrapper.close();
  }
}
