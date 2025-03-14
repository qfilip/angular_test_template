import { Injectable } from "@angular/core";
import { BaseApiService } from "../../../shared/services/base-api.service";
import { Branch } from "../file/fsitem.models";

@Injectable({
    providedIn: 'root'
})
export class FsBranchApiService extends BaseApiService {
    private url = this.apiUrl + '/branches';

    getAll = () => this.http.get<Branch[]>(this.url);
    get = (b: Branch) => this.http.get<Branch>(`${this.url}/${b.id}`);
    post = (b: Branch) => this.http.post<Branch>(this.url, b);
    put = (b: Branch) => this.http.put<Branch>(`${this.url}/${b.id}`, b);

}