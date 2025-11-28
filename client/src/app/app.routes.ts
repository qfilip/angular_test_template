import { Routes } from '@angular/router';
import { BoxesComponent } from './features/signalR/boxes/boxes.component';
import { PollingComponent } from './features/polling/polling/polling.component';

export const routes: Routes = [
    { path: '', component: BoxesComponent }
];
