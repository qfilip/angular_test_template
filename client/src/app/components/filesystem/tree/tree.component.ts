import { Component, computed, effect, inject, input, Input, OnInit, signal } from '@angular/core';
import { FsItemUtils } from '../fsitem.utils';
import { FsItem, FsItemType } from '../fsitem.models';
import { FsItemStateService } from '../fsItemState.service';
import { filter, map, Observable, tap } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tree',
  imports: [CommonModule],
  templateUrl: './tree.component.html',
  styleUrl: './tree.component.css'
})
export class TreeComponent implements OnInit {
  @Input({ required: true }) fsItem!: FsItem;
  private fsItemStateService = inject(FsItemStateService);
  selected$!: Observable<FsItem>;
  
  items: {dirs: FsItem[], docs: FsItem[]} = { dirs: [], docs: [] };

  ngOnInit(): void {
    this.fsItemStateService.selected$.pipe(
      filter(x => x.id == this.fsItem.id),
      tap(x => {
        console.log('tap');
        this.items = FsItemUtils.getDirsAndDocs(x);
      })
    ).subscribe();
  }

  log(ev: Event, dt: any) {
    console.log(dt);
    const tev = ev as ToggleEvent;
    if(tev.newState === 'open') {

    }
  }
}
