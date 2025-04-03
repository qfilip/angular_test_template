import { Component, inject } from '@angular/core';
import { DialogOptions } from '../../features/common-ui/models/dialog-options.model';
import { DialogService } from '../../features/common-ui/services/dialog.service';
import { LoaderService } from '../../features/common-ui/services/loader.service';
import { PopupService } from '../../features/common-ui/services/popup.service';

@Component({
  selector: 'app-scratchpad',
  imports: [],
  templateUrl: './scratchpad.page.html',
  styleUrl: './scratchpad.page.css'
})
export class ScratchpadPage {
  private popupService = inject(PopupService);
  private dialogService = inject(DialogService);
  private spinnerService = inject(LoaderService);

  openDialog() {
    this.dialogService.open({
      header: 'Hello',
      message: 'Testing dialog'
    } as DialogOptions);
  }

  showSpinner() {
    this.spinnerService.show('working...');
    const x = setTimeout(() => {
      this.spinnerService.hide();
      clearTimeout(x);
    }, 5000)
  }

  addPopup() {
    this.popupService.info('Blue jeans.');
    this.popupService.ok('Green aliens.');
    this.popupService.warn('Orange Trump.');
    this.popupService.error('Red alert.');
  }
}
