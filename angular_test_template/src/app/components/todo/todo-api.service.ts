import { Injectable } from "@angular/core";
import { BaseApiService } from "../../shared/services/base-api.service";
import { TodoEvent } from "./todo.models";

@Injectable({
    providedIn: 'root'
})
export class TodoApiService extends BaseApiService {
    private path = this.apiUrl + '/todo-events';
    
    getAll = () => this.http.get<TodoEvent[]>(this.path);
    addEvent = (ev: TodoEvent) => this.http.post<TodoEvent>(this.path, ev);
}
