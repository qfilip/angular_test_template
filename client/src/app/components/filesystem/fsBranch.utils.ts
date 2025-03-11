import { makeResult, Utils } from "../../shared/services/utils";
import { Branch } from "./fsitem.models";

export class FsBranchUtils {
    static createBranch(name: string, allBranches: Branch[]) {
        const errors = this.validateName(name, allBranches);
        
        const branch: Branch = {
            id: Utils.makeId(),
            name: name,
            commits: []
        };
        
        return makeResult<Branch>(errors, branch);
    }

    private static validateName(name: string, allBranches: Branch[]) {
        if(!name) return ['Name cannot be empty'];

        const duplicateNameCheck = () => 
            allBranches.map(x => x.name).includes(name);
        
        const validators = 
        [
            () => name.length === 0 ? 'Name cannot be empty' : null,
            () => name.startsWith('/') ? 'Name cannot start with forward slash' : null,
            () => name.endsWith('/') ? 'Name cannot end with forward slash' : null,
            () => duplicateNameCheck() ? 'Name already exists in this directory' : null
        ];
        
        return validators
            .reduce((acc, fn) => acc.concat(fn()), [] as (string | null)[])
            .filter(x => !!x) as string[];
    }
}