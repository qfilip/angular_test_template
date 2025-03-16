import { PopupService } from "../common-ui/popup/popup.service";
import { Todo } from "./todo.models";

export class TodoModelUtils {
    static validate(x: Todo) {
        const valid = !!x.title && x.title.length > 0;
        return valid ? [] : ['Title cannot be empty'];
    }

    static printErrors(service: PopupService, errors: string[]) {
        errors.forEach(x => {
            service.push({
                color: 'warn',
                header: 'Validation failed',
                text: x 
            });
        })
    }
}