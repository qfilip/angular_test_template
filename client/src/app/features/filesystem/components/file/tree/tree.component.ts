import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, Input, signal, ViewChild } from '@angular/core';

import { DirsAndDocs, FsItem } from '../../../models/fsitem.models';
import { FsItemNamePipe } from '../../../pipes/fsitem.pipes';
import { FsItemStateService } from '../../../services/fsItemState.service';
import { FsItemUtils } from '../../../utils/fsitem.utils';

@Component({
  standalone: true,
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
  
  private _$expanded = signal<boolean>(false, { equal: _ => false });
  private _$items = signal<DirsAndDocs>({ dirs: [], docs: [] }, {equal: _ => false });
  private _$item = signal<FsItem | null>(null);

  $items = this._$items.asReadonly();
  $item = this._$item.asReadonly();
  $expanded = this._$expanded.asReadonly();
  $searchActive = computed(() => this.fsItemStateService.$searchActive());

  constructor() {
    effect(() => {
      const item = this.$item()!;
      const expanded = this.fsItemStateService.$expanded();

      if(expanded.length === 1) {
        this._$expanded.set(false);
        return;
      }

      const expand = expanded.includes(item.path);
      if(!expand) return;
      
      const root = this.fsItemStateService.$root()!;
      const dds = FsItemUtils.getDirsAndDocs(item, root);
      if(dds.data) {
        this._$items.set(dds.data);
        this._$expanded.set(true);
      }
    });
  }

  selectItem = (x: FsItem, expanded: boolean) => {
    this.fsItemStateService.setSelected(x, !expanded);
  }
}
