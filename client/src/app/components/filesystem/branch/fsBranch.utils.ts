import { makeResult, Utils } from "../../../shared/services/utils";
import { Branch, Commit, FsItemCreatedEvent } from "../file/fsitem.models";
import { ROOT } from "../fsConstants";

export class FsBranchUtils {
    static createBranch(name: string, allBranches: Branch[]) {
        const errors = this.validateName(name, allBranches);
        
        const now = new Date();
        const createRootDirectoryEvent: FsItemCreatedEvent = {
            type: 'created',
            created: ROOT,
            createdAt: now
        };

        const branch: Branch = {
            id: Utils.makeId(),
            name: name,
            commits: [
                {
                    id: Utils.makeId(),
                    createdAt: new Date(),
                    events: [createRootDirectoryEvent]
                }
            ]
        };
        
        return makeResult<Branch>(errors, branch);
    }

    static cloneBranch(name: string, original: Branch, all: Branch[]) {
        const errors = this.validateName(name, all);
        
        const branch: Branch = {
            id: Utils.makeId(),
            name: name,
            commits: Utils.deepClone(original.commits)
        };

        return makeResult<Branch>(errors, branch);
    }

    static getDiffs(a: Branch, b: Branch) {
        const diffs: { aCommit?: Commit, bCommit?: Commit }[] = [];
        const aLen = a.commits.length;
        const bLen = b.commits.length;
        const len = aLen > bLen ? aLen : bLen;
    
        for(let i = 0; i < len; i++) {
          let ac: Commit | undefined = undefined;
          let bc: Commit | undefined = undefined;
    
          if(aLen > i)
            ac = a.commits[i];
    
          if(bLen > i)
            bc = b.commits[i];
    
          diffs.push({ aCommit: ac, bCommit: bc });
        }
    
        return diffs;
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
            () => duplicateNameCheck() ? 'Branch with the same name already exists' : null
        ];
        
        return validators
            .reduce((acc, fn) => acc.concat(fn()), [] as (string | null)[])
            .filter(x => !!x) as string[];
    }
}