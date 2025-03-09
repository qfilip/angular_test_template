import { Component, inject, Input, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { FsItemUtils } from '../fsitem.utils';
import { DirsAndDocs, FsItem } from '../fsitem.models';
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
  
  $items = signal<DirsAndDocs>({ dirs: [], docs: [] }, {equal: _ => false });
  item!: FsItem;
  $open = signal<boolean>(false, {equal: _=> false});

  ngOnInit(): void {
    this.fsItemStateService.selected$.pipe(
      takeUntil(this.unsub),
      filter(x => x.item.id === this.item.id),
      tap(x => this.$items.set(FsItemUtils.getDirsAndDocs(x.item, x.root)))
    ).subscribe();

    this.fsItemStateService.expanded$.pipe(
      takeUntil(this.unsub),
      filter(x => x.paths.includes(this.item.path)),
      tap(_ => {
        this.$open.set(true);
      })
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
    this.$open.set(true);
  }
}
