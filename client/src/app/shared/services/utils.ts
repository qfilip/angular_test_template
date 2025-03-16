import { PopupService } from "../../components/common-ui/popup/popup.service";
import { Result } from "../models";

export class Utils {
    static makeId = () => Math.random().toString(16).substr(2, 8);

    static printErrors(service: PopupService, errors: string[]) {
        errors.forEach(x => {
            service.push({
                color: 'warn',
                header: 'Validation failed',
                text: x 
            });
        })
    }

    static deepClone<T>(x: T) {
        if(typeof x !== 'object' || x === null) return x;
    
        const clone: any = Array.isArray(x) ? [] : {};
    
        for(let key in x) {
          const value = x[key];
          clone[key] = this.deepClone(value);
        }
    
        return clone as T;
    }

    static timeSort = (a: Date, b: Date) => 
        new Date(a).getTime() > new Date(b).getTime() ? 1 : -1
}

export function makeResult<T>(errs: string[], data?: T) {
    return errs.length > 0
        ? makeErr<T>(errs)
        : makeOk<T>(data!);
}

function makeOk<T>(x: T) {
    const r: Result<T> = {
        data: x,
        errors: [] as string[]
    }

    return r;
}

function makeErr<T>(errors: string[]) {
    const r: Result<T> = {
        data: undefined,
        errors: errors
    }

    return r;
}