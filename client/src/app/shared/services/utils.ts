import { PopupService } from "../../components/common-ui/popup/popup.service";

export class Utils {
    static makeId = () => Math.random().toString(16).substr(2, 8);

    static printErrors(service: PopupService, errors: string[]) {
        errors.forEach(x => {
            service.push({
                color: 'orange',
                header: 'Validation failed',
                text: x 
            });
        })
    }
}