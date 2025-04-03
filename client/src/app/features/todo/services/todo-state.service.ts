import { computed, inject, Injectable, signal } from '@angular/core';

import { TodoApiService } from './todo-api.service';
import { PopupService } from '../../common-ui/services/popup.service';
import { TodoEvent, Todo } from '../models/todo.models';
import { TodoUtils } from '../utils/todo.utils';

@Injectable({
    providedIn: 'root'
})
export class TodoStateService {
    private api = inject(TodoApiService);
    private popup = inject(PopupService);

    private _$todoEvents = signal<TodoEvent[]>([]);
    
    $todos = computed(() => {
        const evs = this._$todoEvents();
        return TodoUtils.mapTodosFromEvents(evs);
    });

    getTodoEvents = () => this._$todoEvents();

    loadTodos() {
        this.api.getAllEvents().subscribe({
            next: xs => this._$todoEvents.set(xs)
        });
    }
    
    addTodo(x: Todo) {
        const ev = TodoUtils.getCreateEvent(x);
        this.postEvent(ev, 'Todo added', 'Failed to add todo');
    }

    updateTodoTitle(x: Todo, newTitle: string) {
        const ev = TodoUtils.getUpdateEvent({...x, title: newTitle});
        this.postEvent(ev, 'Todo title updated', 'Failed to update todo title');
    }

    toggleTodoCompleted(x: Todo) {
        const ev = TodoUtils.getUpdateEvent({...x, completed: !x.completed });
        this.postEvent(ev, 'Todo state toggled', 'Failed to toggle todo state');
    }

    deleteTodo(x: Todo) {
        const ev = TodoUtils.getDeleteEvent(x);
        this.postEvent(ev, 'Todo deleted', 'Failed to delete todo');
    }

    private postEvent = (ev: TodoEvent, okMessage: string, errMessage: string) => 
        this.api.postEvent(ev).subscribe({
            next: x => {
                this._$todoEvents.update((xs) => xs.concat(x));
                this.popup.push({
                    color: 'ok',
                    header: 'Ok',
                    text: okMessage
                })
            },
            error: _ => this.popup.push({
                color: 'error',
                header: 'Error',
                text: errMessage
            })
        });
}
