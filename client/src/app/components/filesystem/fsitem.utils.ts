import { makeResult, Utils } from "../../shared/services/utils";
import { DirsAndDocs, FsDirectory, FsDocument, FsItem, FsItemType } from "./fsitem.models";

export class FsItemUtils {
    // always start this function from root for fresh data
    static getDirsAndDocs(item: FsItem, root: FsItem) {
        if(item.type === 'document') {
            const dds: DirsAndDocs = { dirs: [], docs: [] }
            return dds;
        }
        
        const target = this.findChildDir(item, root);
        
        if(target.length !== 1) {
            throw 'Child directory not found';
        }

        return this.getChildren(target[0]);
    }

    static findChildDoc(targetId: string, root: FsItem): FsItem {
        if(targetId === root.id) {
            return root;
        }
        const { dirs, docs } = this.getChildren(root);
        const foundDoc = docs.find(x => x.id === targetId);
        
        if(foundDoc) {
            return foundDoc;
        }

        const children = dirs
            .map(x => this.findChildDoc(targetId, x))
            .filter(x => !!x);

        if(children.length === 0) {
            console.error('No child found at: ', root.path);
        }

        return children[0];
    }

    private static findChildDir(target: FsItem, root: FsItem): FsItem[] {
        if(target.id === root.id) {
            return [root];
        }

        const children = this.getChildren(root).dirs;
        const found = children.map(x => this.findChildDir(target, x))

        return found.flat();
    }

    static createFsItem(root: FsItem, parent: FsItem, name: string, type: FsItemType) {
        if(!name) return makeResult<FsItem>(['Name cannot be empty']);
        
        const errors = this.validateName(name, root, parent);
        
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

    private static validateName(name: string, root: FsItem, parent: FsItem) {
        if(!name) return ['Name cannot be empty'];

        const duplicateNameCheck = () => {
            const dds = this.getDirsAndDocs(parent, root);
            const sameNameItem = dds.dirs.concat(dds.docs).find(x => this.getName(x.path) === name);
            
            return !!sameNameItem;
        }
        
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

    private static getPathParts(path: string) {
        const pathRegex = /[^\/]+\/?|\//g;
        return path.match(pathRegex)?.filter(x => !!x) as string[];
    }

    private static getChildren = (item: FsItem) => {
        let dds: DirsAndDocs = {
            dirs: [],
            docs: []
        }
        
        if(item.type === 'document') {
            return dds;
        }
        
        const dir = item as FsDirectory;
        dds.dirs = dir.items.filter(x => x.type === 'directory');
        dds.docs = dir.items.filter(x => x.type === 'document');
    
        return dds;
    }
}