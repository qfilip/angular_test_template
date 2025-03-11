import { Injectable } from "@angular/core";
import { BaseApiService } from "../../shared/services/base-api.service";
import { Branch } from "./fsitem.models";

@Injectable({
    providedIn: 'root'
})
export class FsBranchApiService extends BaseApiService {
    private url = this.apiUrl + '/branches';

    getAll = () => this.http.get<Branch[]>(this.url);
    post = (b: Branch) => this.http.post<Branch>(this.url, b);
}