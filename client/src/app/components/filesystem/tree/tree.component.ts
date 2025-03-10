import { Component, inject, Input, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { FsItemUtils } from '../fsitem.utils';
import { DirsAndDocs, FsItem } from '../fsitem.models';
import { FsItemStateService } from '../fsItemState.service';
import { filter, Observable, Subject, switchMap, takeUntil, tap } from 'rxjs';
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
      filter(x => x.id === this.item.id),
      switchMap(_ => this.fsItemStateService.root$),
    ).subscribe({
      next: x => this.$items.set(FsItemUtils.getDirsAndDocs(this.item, x!))
    });

    this.fsItemStateService.expanded$.pipe(
      takeUntil(this.unsub),
      filter(x => x.includes(this.item.path)),
    ).subscribe({ next: _ => this.$open.set(true)});
  }

  ngOnDestroy(): void {
    this.unsub.next(0);
    this.unsub.complete();
  }

  setSelected(x: FsItem, ev: Event) {
    const tev = ev as ToggleEvent;
    const expand = tev.newState === 'open';
    
    this.fsItemStateService.setSelected(x, expand);
  }

  toggleOpened() {
    this.$open.set(true);
  }
}
