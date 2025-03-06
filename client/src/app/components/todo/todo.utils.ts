import { Todo, TodoCreatedEvent, TodoDeletedEvent, TodoEvent, TodoHistory, TodoUpdatedEvent } from './todo.models';

export class TodoUtils {

    static createTodo(title: string) {
        const todo: Todo = {
            id: this.makeId(),
            title: title,
            completed: false
        };

        return todo;
    }

    static getCreateEvent(todo: Todo) {
        const ev: TodoCreatedEvent = {
            id: this.makeId(),
            type: 'create',
            todo: todo,
            createdOn: new Date()
        }

        return ev;
    }

    static getUpdateEvent(todo: Todo) {
        const ev: TodoUpdatedEvent = {
            id: this.makeId(),
            type: 'update',
            updatedTodo: todo,
            createdOn: new Date()
        }
        
        return ev;
    }

    static getDeleteEvent(todo: Todo) {
        const ev: TodoDeletedEvent = {
            id: this.makeId(),
            type: 'delete',
            todoId: todo.id,
            createdOn: new Date()
        }
        
        return ev;
    }

    static mapTodosFromEvents(evs: TodoEvent[]) {
        const reducer = (xs: Todo[], ev: TodoEvent) => {
            return this.doOnEvent<Todo[]>(ev,
                c => xs.concat(c.todo),
                u => xs.filter(x => x.id !== u.updatedTodo.id).concat(u.updatedTodo),
                d => xs.filter(x => x.id !== d.todoId)
            );
        }

        return evs
            .sort((a, b) => this.timeSort(a.createdOn, b.createdOn))
            .reduce((acc, x) => reducer(acc, x), [] as Todo[]);
    }

    static mapTodoHistoryFromEvents(evs: TodoEvent[], todo: Todo) {
        return evs
            .filter(ev =>
                this.doOnEvent<boolean>(ev,
                    c => c.todo.id === todo.id,
                    u => u.updatedTodo.id === todo.id,
                    d => d.todoId === todo.id
                ))
            .sort((a, b) => this.timeSort(a.createdOn, b.createdOn))
            .reduce((acc, ev) =>
                this.doOnEvent<TodoHistory[]>(ev,
                    c => acc.concat({... c.todo, createdOn: c.createdOn }),
                    u => acc.concat({... u.updatedTodo, createdOn: u.createdOn }),
                    _ => acc),
                [] as TodoHistory[]);
    }

    private static makeId = () => Math.random().toString(16).substr(2, 8);
    
    private static timeSort = (a: Date, b: Date) => 
        new Date(a).getTime() > new Date(b).getTime() ? 1 : -1
    
    private static doOnEvent<T>(
        ev: TodoEvent,
        forCreated: (e: TodoCreatedEvent) => T,
        forUpdated: (e: TodoUpdatedEvent) => T,
        forDeleted: (e: TodoDeletedEvent) => T) {
            switch(ev.type) {
                case 'create': return forCreated(ev as TodoCreatedEvent);
                case 'update': return forUpdated(ev as TodoUpdatedEvent);
                case 'delete': return forDeleted(ev as TodoDeletedEvent);
                default: throw `Event of type ${ev.type} not handled`
            }
        }
}