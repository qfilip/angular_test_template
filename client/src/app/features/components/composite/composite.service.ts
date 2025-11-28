import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, switchMap } from 'rxjs';
import { Student, Address } from './composite.model';

@Injectable({
  providedIn: 'root',
})
export class CompositeService {
  private readonly apiUrl = 'http://localhost:5000';

  private studentsSignal = signal<Student[]>([]);

  students = this.studentsSignal.asReadonly();

  loading = signal<boolean>(false);

  error = signal<string | null>(null);

  constructor(private http: HttpClient) {}

  getAll() {
    this.loading.set(true);
    this.error.set(null);

    this.http
      .get<Student[]>(`${this.apiUrl}/students`)
      .pipe(
        switchMap((students) => {
          const addressRequests = students.map((student) =>
            this.http.get<Address>(`${this.apiUrl}/addresses/${student.id}`)
          );

          return forkJoin(addressRequests).pipe(
            switchMap((addresses) => {
              const studentsWithAddresses = students.map((student, index) => ({
                ...student,
                address: addresses[index],
              }));

              return [studentsWithAddresses];
            })
          );
        })
      )
      .subscribe({
        next: (studentsWithAddresses) => {
          this.studentsSignal.set(studentsWithAddresses);
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set('Failed to fetch students and addresses');
          this.loading.set(false);
          console.error('Error fetching data:', err);
        },
      });
  }
}
