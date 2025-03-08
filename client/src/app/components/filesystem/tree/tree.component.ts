import { Component, computed, effect, inject, input, Input, OnInit, signal, ViewChild } from '@angular/core';
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
  @Input({ required: true }) set fsItem(x: FsItem) {
    this.name = FsItemUtils.getName(x.id);
    this.item = x;
  }
  @ViewChild('fsDetails') fsDetails!: HTMLDetailsElement;
  
  private fsItemStateService = inject(FsItemStateService);
  selected$!: Observable<FsItem>;
  
  items: {dirs: FsItem[], docs: FsItem[]} = { dirs: [], docs: [] };
  name!: string;
  item!: FsItem;

  ngOnInit(): void {
    this.fsItemStateService.selected$.pipe(
      filter(x => x.id === this.item.id),
      tap(x => {
        console.log(x);
        this.items = FsItemUtils.getDirsAndDocs(x);
      })
    ).subscribe();
  }

  setSelected(x: FsItem) {
    this.fsItemStateService.setSelected(x);
  }
}
