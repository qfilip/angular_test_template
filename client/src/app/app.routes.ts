import { Routes } from '@angular/router';
import { HomePage } from './pages/home/home.page';
import { TodosPage } from './pages/todo/todos-page/todos-page';
import { ScratchpadPage } from './pages/scratchpad/scratchpad.page';
import { FsHomePage } from './pages/filesystem/fshome/fshome.page';
import { MergererPage } from './pages/filesystem/mergerer/mergerer.page';

export const routes: Routes = [
    { path: '', component: HomePage },
    { path: 'todo', component: TodosPage },
    {  path: 'filesystem', component: FsHomePage },
    { path: 'filesystem/mergerer', component: MergererPage },
    { path: 'scratchpad', component: ScratchpadPage }
];
