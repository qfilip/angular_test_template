export type Id = { id: string }

export type Todo = {
    title: string;
    completed: boolean;
} & Id;

export type TodoHistory = {
    createdOn: Date;
} & Todo;

export type AppEventType = 'create' | 'update' | 'delete';

type AppEvent = {
    type: AppEventType;
    createdOn: Date;
} & Id;

export type TodoCreatedEvent = { todo: Todo; } & AppEvent;
export type TodoUpdatedEvent = { updatedTodo: Todo; } & AppEvent;
export type TodoDeletedEvent = { todoId: string; } & AppEvent;

export type TodoEvent = TodoCreatedEvent | TodoUpdatedEvent | TodoDeletedEvent;