import { Component, computed, inject, OnDestroy, OnInit } from '@angular/core';
import { BoxService } from '../box.service';

@Component({
  selector: 'app-boxes',
  imports: [],
  templateUrl: './boxes.component.html',
  styleUrl: './boxes.component.css'
})
export class BoxesComponent implements OnInit, OnDestroy {
  private service = inject(BoxService);

  $boxes = computed(() => this.service.$boxes());
  $id = computed(() => this.service.$id());
  
  move(event: MouseEvent) {
    console.log(event.x, event.y);
    const target = this.$boxes().find(b => b.id === this.$id());
    if(!target) return;
    const box = {... target, targetX: event.x, targetY: event.y };
    this.service.move(box);
  }

  ngOnInit(): void {
    this.service.connect();
  }

  ngOnDestroy(): void {
    this.service.disconnect();
  }
}
