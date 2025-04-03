import { makeResult, Utils } from "../../../shared/services/utils";
import { ROOT } from "../fsConstants";
import { Branch, FsItemCreatedEvent, Commit } from "../models/fsitem.models";

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

    static zipDiffs(a: Branch, b: Branch) {
        const diffs: { aCommit?: Commit, bCommit?: Commit; first: 0 | 1 | 2 }[] = [];
        const aLen = a.commits.length;
        const bLen = b.commits.length;
        const len = aLen > bLen ? aLen : bLen;

        for (let i = 0; i < len; i++) {
            let ac: Commit | undefined = undefined;
            let bc: Commit | undefined = undefined;
            let first: 0 | 1 | 2 = 0;

            if (aLen > i)
                ac = a.commits[i];

            if (bLen > i)
                bc = b.commits[i];

            if(ac?.id === bc?.id)
                continue;

            if (ac && bc) {
                const d1 = new Date(ac.createdAt).getTime();
                const d2 = new Date(bc.createdAt).getTime();
                first = d1 === d2 ? 0 : d1 < d2 ? 1 : 2;
            }
            else if(ac && !bc)
                first = 1;
            else if(!ac && bc)
                first = 2;

            diffs.push({ aCommit: ac, bCommit: bc, first: first });
        }
        
        return diffs;
    }

    static zipEquals(src: Branch, targ: Branch) {
        const final: Commit[] = [];
    
        const aLen = src.commits.length;
        const bLen = targ.commits.length;
        const len = aLen < bLen ? aLen : bLen;
    
        for(let i = 0; i < len; i++) {
          if(src.commits[i].id !== targ.commits[i].id)
            break;
    
          final.push(targ.commits[i]);
        }
    
        return final;
    }

    private static validateName(name: string, allBranches: Branch[]) {
        if (!name) return ['Name cannot be empty'];

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