import { Routes } from '@angular/router';
import { HomeComponent } from './features/components/home/home.component';
import { CrudExampleComponent } from './features/components/crud-example/crud-example.component';
import { CompositeComponent } from './features/components/composite/composite.component';
import { BoxesComponent } from './features/components/signalR/boxes/boxes.component';
import { PollingComponent } from './features/components/polling/polling/polling.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'boxes', component: BoxesComponent },
  { path: 'polling', component: PollingComponent },
  { path: 'crud-example', component: CrudExampleComponent },
  { path: 'composite', component: CompositeComponent },
];
