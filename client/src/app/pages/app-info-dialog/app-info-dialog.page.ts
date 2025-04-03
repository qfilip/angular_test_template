import { Component, signal, ViewChild } from '@angular/core';
import { Project } from '../home/home.models';
import { Subject } from 'rxjs';
import { AppInfoDialogResult } from './app-info-dialog.models';
import { DialogWrapperComponent } from '../../features/common-ui/components/dialog-wrapper/dialog-wrapper.component';

@Component({
  selector: 'app-info-dialog',
  imports: [DialogWrapperComponent],
  templateUrl: './app-info-dialog.page.html',
  styleUrl: './app-info-dialog.page.css'
})
export class AppInfoDialog {
  @ViewChild('wrapper') private wrapper!: DialogWrapperComponent;
  
  private _$project = signal<Project>('todo');
  private _$paragraphs = signal<string[]>([]);
  private _dialogResult$ = new Subject<AppInfoDialogResult>();

  $project = this._$project.asReadonly();
  $paragraphs = this._$paragraphs.asReadonly();
  dialogResult$ = this._dialogResult$.asObservable();

  open(project: Project) {
    this._$project.set(project);
    this._$paragraphs.set(this.getParagraphs(project));
    this.wrapper.open();
  };

  close(proceed: boolean, showAgain: boolean) {
    this._dialogResult$.next({
      proceed: proceed,
      project: this.$project(),
      dontShowAgain: !showAgain
    });

    this.wrapper.close();
  }

  private getParagraphs(project: Project) {
    if(project === 'todo') {
      return [
        'Event sourced todo app that tracks changes of todos.',
        'You can complete/reactivate them, change the title or delete them forever.',
        'View History button will show all previous states of a todo.'
      ];
    }
    else if(project === 'filesystem') {
      return [

      ];
    }
    else if(project === 'scratchpad') {
      return [
        'Scratchpad is a place to test the functionality of common ui elements.'
      ];
    }
    else {
      throw 'No such project';
    }
  }
}
