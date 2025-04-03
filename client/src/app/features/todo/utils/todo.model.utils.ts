import { PopupService } from "../../common-ui/services/popup.service";
import { Todo } from "../models/todo.models";

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