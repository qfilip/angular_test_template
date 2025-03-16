import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, Input, OnInit, signal, ViewChild } from '@angular/core';
import { map, Observable, tap } from 'rxjs';

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
export class TreeComponent implements OnInit {
  @Input({ required: true }) set fsItem(x: FsItem) {
    this._$item.set(x);
  }
  @ViewChild('fsDetails') fsDetails!: HTMLDetailsElement;
  
  private fsItemStateService = inject(FsItemStateService);
  
  private _$items = signal<DirsAndDocs>({ dirs: [], docs: [] }, {equal: _ => false });
  private _$item = signal<FsItem | null>(null);

  $items = this._$items.asReadonly();
  $item = this._$item.asReadonly();
  $searchActive = computed(() => this.fsItemStateService.$searchActive());
  
  expanded$!: Observable<boolean>;
  
  ngOnInit(): void {
    this.expanded$ = this.fsItemStateService.expanded$
      .pipe(
        map(paths => {
          const item = this.$item()!;
          
          if(paths.length === 1) {
            return false;
          }

          return paths.includes(item.path);
        }),
        tap(expanded => {
          if(expanded) {
            const item = this.$item()!;
            const root = this.fsItemStateService.$root()!;
            const dds = FsItemUtils.getDirsAndDocs(item, root);
            this._$items.set(dds);
          }
        })
      );
  }

  constructor() {
    effect(() => {
      const selected = this.fsItemStateService.$selected();
      const item = this.$item()!;

      if(!selected) return;
      if(selected.id !== item.id) return;

      this._$items.set(FsItemUtils.getDirsAndDocs(item, selected));
    });
  }

  selectItem = (x: FsItem, expanded: boolean) => {
    this.fsItemStateService.setSelected(x, !expanded);
  }
}
