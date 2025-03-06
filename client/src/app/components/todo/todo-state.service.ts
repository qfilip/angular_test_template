import { computed, inject, Injectable, signal } from "@angular/core";
import { TodoApiService } from "./todo-api.service";
import { TodoUtils } from "./todo.utils";
import { TodoEvent, Todo, TodoCreatedEvent, TodoUpdatedEvent, TodoDeletedEvent } from "./todo.models";

@Injectable({
    providedIn: 'root'
})
export class TodoStateService {
    private api = inject(TodoApiService);

    private $todoEvents = signal<TodoEvent[]>([]);
    
    $todos = computed(() => {
        const evs = this.$todoEvents();
        return TodoUtils.mapTodosFromEvents(evs);
    });

    getTodoEvents = () => this.$todoEvents();

    loadTodos() {
        this.api.getAll().subscribe({
            next: xs => this.$todoEvents.set(xs)
        });
    }
    
    addTodo(x: Todo) {
        const ev = TodoUtils.getCreateEvent(x);
        this.sendEvent(ev);
    }

    updateTodoTitle(x: Todo, newTitle: string) {
        const ev = TodoUtils.getUpdateEvent({...x, title: newTitle});
        this.sendEvent(ev);
    }

    toggleTodoCompleted(x: Todo) {
        const ev = TodoUtils.getUpdateEvent({...x, completed: !x.completed });
        this.sendEvent(ev);
    }

    deleteTodo(x: Todo) {
        const ev = TodoUtils.getDeleteEvent(x);
        this.sendEvent(ev);
    }

    private sendEvent = (ev: TodoEvent) => 
        this.api.addEvent(ev).subscribe({
            next: x => this.$todoEvents.update((xs) => xs.concat(x))
        });
}
