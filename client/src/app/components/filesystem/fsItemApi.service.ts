import { Injectable } from "@angular/core";
import { BaseApiService } from "../../shared/services/base-api.service";
import { FsItem } from "./fsitem.models";
import { ROOT } from "./fsConstants";

@Injectable({
    providedIn: 'root'
})
export class FsItemApiService extends BaseApiService {
    private url = this.apiUrl + '/filesystem';

    getRoot() {
        return this.http.get<FsItem>(`${this.url}/${ROOT.id}`);
    }

    updateRoot(fsi: FsItem) {
        return this.http.put<FsItem>(`${this.url}/${ROOT.id}`, fsi);
    }
}