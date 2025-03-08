import { PopupService } from "../../components/common-ui/popup/popup.service";
import { Result } from "../models";

export class Utils {
    static makeId = () => Math.random().toString(16).substr(2, 8);

    static printErrors(service: PopupService, errors: string[]) {
        console.log(errors);
        errors.forEach(x => {
            service.push({
                color: 'orange',
                header: 'Validation failed',
                text: x 
            });
        })
    }
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