import { makeResult, Utils } from "../../shared/services/utils";
import { root } from "./fsConstants";
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

    static createFsItem(name: string, type: FsItemType) {
        if(!name) return makeResult<FsItem>(['Name cannot be empty']);
        const errors = this.validateName(name);
        const fsi: FsItem = {
            id: name + '/',
            type: type,
            content: '',
            items: []
        };
        
        return makeResult<FsItem>(errors, fsi);
    }

    static getName(id: string) {
        if(id === root.id)
            return id;
        
        const arr = id.match(/[^\/]+\/?|\//g)?.filter(x => !!x) as string[];
        const last = arr[arr.length - 1];
        
        return last.substring(0, last.length - 1);
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
}