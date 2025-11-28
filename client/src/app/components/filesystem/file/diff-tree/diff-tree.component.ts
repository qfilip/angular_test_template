import { Component, computed, input } from '@angular/core';
import { FsItem } from '../fsitem.models';
import { FsItemUtils } from '../fsitem.utils';

@Component({
  selector: 'app-diff-tree',
  imports: [],
  templateUrl: './diff-tree.component.html',
  styleUrl: './diff-tree.component.css'
})
export class DiffTreeComponent {
  $root = input.required<FsItem>();
  $old = input.required<FsItem>();
  $new = input.required<FsItem>();

  $diffs = computed(() => {
    const root = this.$root();
    const o = FsItemUtils.getDirsAndDocs(this.$old(), root).data!;
    const n = FsItemUtils.getDirsAndDocs(this.$new(), root).data!;


  });
}
