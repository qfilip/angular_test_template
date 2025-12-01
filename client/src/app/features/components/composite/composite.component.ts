import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompositeService } from './composite.service';

@Component({
  selector: 'app-composite',
  imports: [CommonModule],
  templateUrl: './composite.component.html',
  styleUrl: './composite.component.css',
})
export class CompositeComponent implements OnInit {
  private compositeService = inject(CompositeService);

  students = this.compositeService.students;
  loading = this.compositeService.loading;
  error = this.compositeService.error;

  ngOnInit() {
    this.compositeService.getAll();
  }

  refresh() {
    this.compositeService.getAll();
  }
}
