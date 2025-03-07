import { Component, inject } from '@angular/core';
import { DialogOptions } from '../common-ui/simple-dialog/dialog-options.model';
import { LoaderService } from '../common-ui/loader/loader.service';
import { DialogService } from '../common-ui/simple-dialog/dialog.service';
import { PopupService } from '../common-ui/popup/popup.service';

@Component({
  selector: 'app-scratchpad',
  imports: [],
  templateUrl: './scratchpad.component.html',
  styleUrl: './scratchpad.component.css'
})
export class ScratchpadComponent {
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
      text: 'This is working',
    })
  }
}
