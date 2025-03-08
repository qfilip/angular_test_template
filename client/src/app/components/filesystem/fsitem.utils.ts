import { Utils } from "../../shared/services/utils";
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
        const fsi = {
            id: Utils.makeId(),
            name: name,
            type: type
        } as FsItem;

        return fsi;
    }

    static validate(x: FsItem) {
        const valid = !!x.name && x.name.length > 0;
        return valid ? [] : ['Name cannot be empty'];
    }
}