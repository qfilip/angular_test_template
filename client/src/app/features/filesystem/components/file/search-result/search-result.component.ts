import { Component, computed, inject } from '@angular/core';
import { FsItem } from '../../../models/fsitem.models';
import { FsItemStateService } from '../../../services/fsItemState.service';

@Component({
  standalone: true,
  selector: 'app-search-result',
  imports: [],
  templateUrl: './search-result.component.html',
  styleUrl: './search-result.component.css'
})
export class SearchResultComponent {
  private fsItemStateService = inject(FsItemStateService);
  $searchResult = computed(() => this.fsItemStateService.$searchResult());

  select(item: FsItem) {
    this.fsItemStateService.toggleSearch();
    this.fsItemStateService.setSelected(item, true);
  }
}
