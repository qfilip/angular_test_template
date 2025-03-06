import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class BaseApiService {
    protected apiUrl = 'http://localhost:5000';
    protected http = inject(HttpClient);
}