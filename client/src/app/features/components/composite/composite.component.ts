import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompositeService } from './composite.service';

@Component({
  selector: 'app-composite',
  imports: [CommonModule],
  templateUrl: './composite.component.html',
  styleUrl: './composite.component.css',
})
export class CompositeComponent implements OnInit {
  constructor(public compositeService: CompositeService) {}

  ngOnInit() {
    // Load data on initialization
    this.compositeService.getAll();
  }

  refresh() {
    this.compositeService.getAll();
  }
}
