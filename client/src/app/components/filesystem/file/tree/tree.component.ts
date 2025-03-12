import { CommonModule } from '@angular/common';
import { Component, effect, inject, Input, signal, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';

import { DirsAndDocs, FsItem } from '../fsitem.models';
import { FsItemNamePipe } from '../fsitem.pipes';
import { FsItemUtils } from '../fsitem.utils';
import { FsItemStateService } from '../fsItemState.service';

@Component({
  selector: 'app-tree',
  imports: [CommonModule, FsItemNamePipe],
  templateUrl: './tree.component.html',
  styleUrl: './tree.component.css'
})
export class TreeComponent {
  @Input({ required: true }) set fsItem(x: FsItem) {
    this._$item.set(x);
  }
  @ViewChild('fsDetails') fsDetails!: HTMLDetailsElement;
  
  private fsItemStateService = inject(FsItemStateService);
  
  private _$items = signal<DirsAndDocs>({ dirs: [], docs: [] }, {equal: _ => false });
  private _$item = signal<FsItem | null>(null);
  private _$open = signal<boolean>(false, {equal: _ => false});

  $items = this._$items.asReadonly();
  $item = this._$item.asReadonly();
  $open = this._$open.asReadonly();

  constructor() {
    effect(() => {
      const selected = this.fsItemStateService.$selected();
      const item = this.$item()!;

      if(!selected) return;
      if(selected.id !== item.id) return;

      this._$items.set(FsItemUtils.getDirsAndDocs(item, selected));
    });

    effect(() => {
      const expanded = this.fsItemStateService.$expanded();
      const item = this.$item()!;

      if(expanded.includes(item.path)) {
        console.log('setting to expand: ', item);
        this._$open.set(true);
      }
    });
  }

  selectItem = (x: FsItem, expand: boolean) => 
    this.fsItemStateService.setSelected(x, expand);
  
  selectDir(x: FsItem, ev: Event) {
    const tev = ev as ToggleEvent;
    const expand = tev.newState === 'open';
    
    this.selectItem(x, expand);
  }

  toggleOpened() {
    this._$open.set(true);
  }
}
