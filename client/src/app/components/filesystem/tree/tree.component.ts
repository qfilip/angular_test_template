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
    this._$item.set(x);
  }
  @ViewChild('fsDetails') fsDetails!: HTMLDetailsElement;
  
  private fsItemStateService = inject(FsItemStateService);
  private _$items = signal<DirsAndDocs>({ dirs: [], docs: [] }, {equal: _ => false });
  private _$item = signal<FsItem | null>(null);
  private _$open = signal<boolean>(false, {equal: _=> false});
  private unsub = new Subject();

  selected$!: Observable<FsItem>;
  

  $items = this._$items.asReadonly();
  $item = this._$item.asReadonly();
  $open = this._$open.asReadonly();

  ngOnInit(): void {
    this.fsItemStateService.selected$.pipe(
      takeUntil(this.unsub),
      filter(x => x.id === this.$item()!.id),
      switchMap(_ => this.fsItemStateService.root$),
    ).subscribe({
      next: x =>
        this._$items.set(FsItemUtils.getDirsAndDocs(this.$item()!, x!))
    });

    this.fsItemStateService.expanded$.pipe(
      takeUntil(this.unsub),
      filter(x => x.includes(this.$item()!.path)),
    ).subscribe({ next: _ => this._$open.set(true)});
  }

  ngOnDestroy(): void {
    this.unsub.next(0);
    this.unsub.complete();
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
