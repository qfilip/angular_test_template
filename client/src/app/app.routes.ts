import { Routes } from '@angular/router';
import { HomePage } from './pages/home/home.page';
import { TodosPage } from './features/todo/pages/todos-page/todos-page';
import { ScratchpadPage } from './pages/scratchpad/scratchpad.page';
import { FsHomePage } from './features/filesystem/pages/fshome/fshome.page';
import { MergererPage } from './features/filesystem/pages/mergerer/mergerer.page';

export const routes: Routes = [
    { path: '', component: HomePage },
    { path: 'todo', component: TodosPage },
    {  path: 'filesystem', component: FsHomePage },
    { path: 'filesystem/mergerer', component: MergererPage },
    { path: 'scratchpad', component: ScratchpadPage }
];
