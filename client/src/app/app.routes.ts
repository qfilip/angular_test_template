import { Routes } from '@angular/router';
import { HomePage } from './pages/home/home.page';
import { TodosPage } from './pages/todo/todos-page/todos-page';
import { ScratchpadPage } from './pages/scratchpad/scratchpad.page';

export const routes: Routes = [
    { path: '', component: HomePage },
    { path: 'todo', component: TodosPage },
    { path: 'scratch', component: ScratchpadPage }
];
