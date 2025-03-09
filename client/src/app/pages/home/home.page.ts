import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LocalstorageCacheService } from '../../shared/services/cache/local-storage-cache.service';
import { fs_show_project_info, scratch_show_project_info, todo_show_project_info } from '../../shared/cache.keys';
import { filter, firstValueFrom, Observable, of } from 'rxjs';
import { AppInfoDialog } from "../app-info-dialog/app-info-dialog.page";
import { AppInfoDialogResult } from '../app-info-dialog/app-info-dialog.models';
import { CacheFunctions } from '../../shared/services/cache/cache.models';
import { Project } from './home.models';

@Component({
  selector: 'app-home',
  imports: [AppInfoDialog],
  templateUrl: './home.page.html',
  styleUrl: './home.page.css'
})
export class HomePage implements OnInit, AfterViewInit {
  @ViewChild('infoDialog') private infoDialog!: AppInfoDialog;
  
  private router = inject(Router)
  private cacheService = inject(LocalstorageCacheService);
  
  private fsCache!: CacheFunctions<boolean>;
  private todoCache!: CacheFunctions<boolean>;
  private scratchCache!: CacheFunctions<boolean>;
  
  ngOnInit(): void {
    this.fsCache = this.cacheService.register<boolean>(fs_show_project_info, () => {
      return of(window.localStorage.getItem(fs_show_project_info)! === 'true' ? true : false);
    }, undefined, true);

    this.todoCache = this.cacheService.register<boolean>(todo_show_project_info, () => {
      return of(window.localStorage.getItem(todo_show_project_info)! === 'true' ? true : false);
    }, undefined, true);

    this.scratchCache = this.cacheService.register<boolean>(scratch_show_project_info, () => {
      return of(window.localStorage.getItem(scratch_show_project_info)! === 'true' ? true : false);
    }, undefined, true);
  }

  ngAfterViewInit(): void {
    this.infoDialog.dialogResult$
      .subscribe({ next: (x) => this.onDialogClosed(x) })
  }

  async goto(project: Project) {
    const cacheMap: { [id: string]: () => Observable<boolean> } = {
      'todo': this.todoCache.retrieve,
      'filesystem': this.fsCache.retrieve,
      'scratchpad': this.scratchCache.retrieve,
    }

    const getCacheFn = cacheMap[project];
    const showDialog = await firstValueFrom(getCacheFn());
    
    if(showDialog) {
      this.infoDialog.open(project);
    }
    else {
      this.router.navigate([project]);
    }
  }

  private onDialogClosed(result: AppInfoDialogResult) {
    if(!result.proceed) {
      return;
    }
    
    switch (result.project) {
      case 'todo':
        this.todoCache.setCache<boolean>(!result.dontShowAgain);
        break;
      case 'filesystem':
        this.fsCache.setCache<boolean>(!result.dontShowAgain);
        break;
      case 'scratchpad':
          this.scratchCache.setCache<boolean>(!result.dontShowAgain);
          break;
      default: throw `Cannot open project ${result.project}`
    }
    
    this.router.navigate([result.project]);
  }
}
