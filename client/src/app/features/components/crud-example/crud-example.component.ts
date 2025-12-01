import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CrudService } from './crud.service';
import { Example } from './example.model';

@Component({
  selector: 'app-crud-example',
  imports: [CommonModule, FormsModule],
  templateUrl: './crud-example.component.html',
  styleUrl: './crud-example.component.css',
})
export class CrudExampleComponent implements OnInit {
  private crudService = inject(CrudService);

  items = this.crudService.items;
  loading = this.crudService.loading;
  error = this.crudService.error;

  editingItem = signal<Example | null>(null);
  itemName = signal<string>('');
  isEditMode = signal<boolean>(false);
  showForm = signal<boolean>(false);

  ngOnInit() {
    this.crudService.getAll();
  }

  startCreate() {
    this.resetForm();
    this.isEditMode.set(false);
    this.showForm.set(true);
  }

  startEdit(item: Example) {
    this.editingItem.set(item);
    this.itemName.set(item.name);
    this.isEditMode.set(true);
    this.showForm.set(true);
  }

  saveItem() {
    const name = this.itemName().trim();

    if (!name) {
      return;
    }

    if (this.isEditMode()) {
      const item = this.editingItem();
      if (item) {
        this.crudService.update(item.id, { name });
      }
    } else {
      this.crudService.create({ name });
    }

    this.resetForm();
  }

  deleteItem(id: number) {
    if (confirm('Are you sure you want to delete this item?')) {
      this.crudService.delete(id);
      if (this.editingItem()?.id === id) {
        this.resetForm();
      }
    }
  }

  cancelEdit() {
    this.resetForm();
  }

  private resetForm() {
    this.editingItem.set(null);
    this.itemName.set('');
    this.isEditMode.set(false);
    this.showForm.set(false);
  }

  refresh() {
    this.crudService.getAll();
  }
}
