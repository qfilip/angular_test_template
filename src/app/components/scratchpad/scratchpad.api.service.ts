import { Injectable } from "@angular/core";
import { BaseApiService } from "../../shared/services/base-api.service";

@Injectable({
    providedIn: 'root'
})
export class ScratchpadApiService extends BaseApiService {
    testApi() {
        return this.http.get(this.apiUrl);
    }
}