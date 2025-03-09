import { Routes } from '@angular/router';
import { HomePage } from './pages/home/home.page';
import { TodosPage } from './pages/todo/todos-page/todos-page';
import { ScratchpadPage } from './pages/scratchpad/scratchpad.page';
import { FilesystemPage } from './pages/filesystem/filesystem.page';

export const routes: Routes = [
    { path: '', component: HomePage },
    { path: 'todo', component: TodosPage },
    { path: 'filesystem', component: FilesystemPage },
    { path: 'scratchpad', component: ScratchpadPage }
];
