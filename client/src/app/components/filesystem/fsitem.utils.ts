import { makeResult, Utils } from "../../shared/services/utils";
import { FsDirectory, FsItem, FsItemType } from "./fsitem.models";

export class FsItemUtils {
    static getDirsAndDocs = (item: FsItem) => {
        let dirs: FsItem[] = [];
        let docs: FsItem[] = [];
        
        if(item.type === 'document') {
            return { dirs, docs }
        }
        
        const dir = item as FsDirectory;
        dirs = dir.items.filter(x => x.type === 'directory');
        docs = dir.items.filter(x => x.type === 'document');
    
        return { dirs, docs };
      }

    static createFsItem(parent: FsItem, name: string, type: FsItemType) {
        if(!name) return makeResult<FsItem>(['Name cannot be empty']);
        
        const errors = this.validateName(name);
        const fsi: FsItem = {
            id: Utils.makeId(),
            type: type,
            path: `${parent.path}${name}/`,
            content: '',
            items: []
        };
        
        return makeResult<FsItem>(errors, fsi);
    }

    static getName(path: string) {
        const arr = this.getPathParts(path);
        const last = arr[arr.length - 1];
        
        return last.substring(0, last.length - 1);
    }

    static findAllPaths(item: FsItem) {
        const arr = this.getPathParts(item.path);
        return arr.reduce((acc, x) => {
            const last = acc[acc.length - 1];
            return last
            ? acc.concat(last + x)
            : [x];
        }, [] as string[]);
    }

    private static validateName(name: string) {
        if(!name) return ['Name cannot be empty'];
        
        const validators = 
        [
            () => name.length === 0 ? 'Name cannot be empty' : null,
            () => name.startsWith('/') ? 'Name cannot start with forward slash' : null,
            () => name.endsWith('/') ? 'Name cannot end with forward slash' : null
        ];
        
        return validators
            .reduce((acc, fn) => acc.concat(fn()), [] as (string | null)[])
            .filter(x => !!x) as string[];
    }

    private static getPathParts(path: string) {
        const pathRegex = /[^\/]+\/?|\//g;
        return path.match(pathRegex)?.filter(x => !!x) as string[];
    }
}