import { Component, inject } from '@angular/core';
import { LoaderService } from '../../components/common-ui/loader/loader.service';
import { PopupService } from '../../components/common-ui/popup/popup.service';
import { DialogOptions } from '../../components/common-ui/simple-dialog/dialog-options.model';
import { DialogService } from '../../components/common-ui/simple-dialog/dialog.service';

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
    this.popupService.push({
      color: 'blue',
      header: 'Test',
      text: 'Popup works',
    })
  }
}
