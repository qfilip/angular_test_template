import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Example } from './example.model';

@Injectable({
  providedIn: 'root',
})
export class CrudService {
  private readonly apiUrl = 'http://localhost:5000/data';

  private httpClient = inject(HttpClient);

  private itemsSignal = signal<Example[]>([]);
  items = this.itemsSignal.asReadonly();

  loading = signal<boolean>(false);

  error = signal<string | null>(null);

  getAll() {
    this.loading.set(true);
    this.error.set(null);

    this.httpClient.get<Example[]>(this.apiUrl).subscribe({
      next: (items) => {
        this.itemsSignal.set(items);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to fetch items');
        this.loading.set(false);
        console.error('Error fetching items:', err);
      },
    });
  }

  create(item: Omit<Example, 'id'>) {
    this.loading.set(true);
    this.error.set(null);

    this.httpClient.post<Example>(this.apiUrl, item).subscribe({
      next: (newItem) => {
        this.itemsSignal.update((items) => [...items, newItem]);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to create item');
        this.loading.set(false);
        console.error('Error creating item:', err);
      },
    });
  }

  update(id: number, item: Partial<Example>) {
    this.loading.set(true);
    this.error.set(null);

    this.httpClient
      .put<Example>(`${this.apiUrl}/${id}`, { ...item, id })
      .subscribe({
        next: (updatedItem) => {
          this.itemsSignal.update((items) =>
            items.map((i) => (i.id === id ? updatedItem : i))
          );
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set('Failed to update item');
          this.loading.set(false);
          console.error('Error updating item:', err);
        },
      });
  }

  delete(id: number) {
    this.loading.set(true);
    this.error.set(null);

    this.httpClient.delete(`${this.apiUrl}/${id}`).subscribe({
      next: () => {
        this.itemsSignal.update((items) => items.filter((i) => i.id !== id));
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to delete item');
        this.loading.set(false);
        console.error('Error deleting item:', err);
      },
    });
  }
}
