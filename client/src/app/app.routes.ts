import { Routes } from '@angular/router';
import { BoxesComponent } from './features/signalR/boxes/boxes.component';
import { HomeComponent } from './features/components/home/home.component';
import { CrudExampleComponent } from './features/components/crud-example/crud-example.component';
import { CompositeComponent } from './features/components/composite/composite.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'boxes', component: BoxesComponent },
  { path: 'crud-example', component: CrudExampleComponent },
  { path: 'composite', component: CompositeComponent },
];
