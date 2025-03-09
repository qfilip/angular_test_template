import { Component, inject, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FsItemUtils } from '../fsitem.utils';
import { FsItem } from '../fsitem.models';
import { FsItemStateService } from '../fsItemState.service';
import { filter, Observable, Subject, takeUntil, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FsItemNamePipe } from '../fsitem.pipes';

@Component({
  selector: 'app-tree',
  imports: [CommonModule, FsItemNamePipe],
  templateUrl: './tree.component.html',
  styleUrl: './tree.component.css'
})
export class TreeComponent implements OnInit, OnDestroy {
  @Input({ required: true }) set fsItem(x: FsItem) {
    this.item = x;
  }
  @ViewChild('fsDetails') fsDetails!: HTMLDetailsElement;
  
  private fsItemStateService = inject(FsItemStateService);
  private unsub = new Subject();

  selected$!: Observable<FsItem>;
  
  items: {dirs: FsItem[], docs: FsItem[]} = { dirs: [], docs: [] };
  item!: FsItem;
  open = false;

  ngOnInit(): void {
    this.fsItemStateService.selected$.pipe(
      takeUntil(this.unsub),
      filter(x => x.id === this.item.id),
      tap(x => this.items = FsItemUtils.getDirsAndDocs(x))
    ).subscribe();

    this.fsItemStateService.shouldOpen$.pipe(
      takeUntil(this.unsub),
      filter(xs => xs.includes(this.fsItem.id)),
      tap(_ => this.open = true)
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.unsub.next(0);
    this.unsub.complete();
  }

  setSelected(x: FsItem) {
    this.fsItemStateService.setSelected(x);
  }

  toggleOpened() {
    this.open = true;
  }
}
