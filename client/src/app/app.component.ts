import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { LoaderComponent } from './features/common-ui/components/loader/loader.component';
import { PopupComponent } from './features/common-ui/components/popup/popup.component';
import { SimpleDialogComponent } from './features/common-ui/components/simple-dialog/simple-dialog.component';
import { ResourceStateService } from './features/resource/resource-state.service';
import { Observable, Subject, Subscription, takeUntil, tap } from 'rxjs';
import { LoaderService } from './features/common-ui/services/loader.service';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    LoaderComponent,
    SimpleDialogComponent,
    RouterOutlet,
    PopupComponent,
  ],
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  router = inject(Router);
  resourceService = inject(ResourceStateService);
  private unsubscribe = new Subject<void>();

  cancelCall() {
    this.unsubscribe.next();
  }

  ngOnInit() {
    this.resourceService.get().subscribe();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  onInput(id: string) {
    const resourceId = parseInt(id, 10);

    this.resourceService
      .put(resourceId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        error: (err) => alert(err),
      });
  }
}
