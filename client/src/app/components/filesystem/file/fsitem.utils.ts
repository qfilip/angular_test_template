import { makeResult, Utils } from '../../../shared/services/utils';
import { ROOT } from '../fsConstants';
import {
    DirsAndDocs,
    FsDirectory,
    FsDocument,
    FsEventType,
    FsItem,
    FsItemCreatedEvent,
    FsItemDeletedEvent,
    FsItemEvent,
    FsItemType,
    FsItemUpdatedEvent,
} from './fsitem.models';

export class FsItemUtils {
    static mapRootFromEvents(events: FsItemEvent[], root?: FsItem) {
        if(events.length === 0) return Utils.deepClone(root ?? ROOT);

        const sorted = events.sort((a, b) => Utils.timeSort(a.createdAt, b.createdAt));

        const onCreated = (ev: FsItemCreatedEvent, root: FsItem) => {
            if(ev.created.id === ROOT.id) return;
            
            const parent = this.getParent(ev.created, root);
            if(!parent) {
                throw `Parent not found for ${ev.created.id} - ${ev.created.path}`
            }
            
            (parent as FsDirectory).items.push(ev.created);
        }

        const onUpdated = (ev: FsItemUpdatedEvent, root: FsItem) => {
            const updated = this.updateChild(ev.updated.id, root, ev.updated)
            if(!updated) {
                throw `Child not found for ${ev.updated.id} - ${ev.updated.path}`
            }
        }

        const onDeleted = (ev: FsItemDeletedEvent, root: FsItem) => {
            const parent = this.getParent(ev.deleted, root);
            if(!parent) {
                throw `Parent not found for ${ev.deleted.id} - ${ev.deleted.path}`
            }

            const dir = (parent as FsDirectory);
            dir.items = dir.items.filter(x => x.id !== ev.deleted.id);
        }

        const initial = Utils.deepClone(root ?? ROOT);
        return sorted.reduce((root, ev) => {
            const clonedEv = Utils.deepClone(ev);
            this.doOnEvent(
                clonedEv,
                e => onCreated(e, root),
                e => onUpdated(e, root),
                e => onDeleted(e, root));
            
            return root;
        }, initial);
    }

    static getParent(fsi: FsItem, root: FsItem) {
        const parentPath = this.getPathParts(fsi.path)
            .slice(0, -1)
            .reduce((acc, x) => acc + x, '');
        
        return this.findChildDir(parentPath, root);
    }

    static getDirsAndDocs(item: FsItem, root: FsItem) {
        if(item.type === 'document') {
            const dds: DirsAndDocs = { dirs: [], docs: [] }
            return dds;
        }
        
        const target = this.findChildDir(item.path, root);
        
        if(!target) {
            throw 'Child directory not found';
        }

        return this.getChildren(target);
    }

    static cloneWithUpdatedChildPaths(fsi: FsItem, newPath: string) {
        const clone = Utils.deepClone(fsi);
        clone.path = newPath;
        if(clone.type === 'document') return clone;

        const dir = (clone as FsDirectory);
        dir.items = dir.items.map(x => {
            const name = this.getName(x.path);
            const newChildPath = newPath + name;
            return this.cloneWithUpdatedChildPaths(x, newChildPath);
        })

        return clone;
    }

    static updateChild(targetId: string, current: FsItem, newVersion: FsItem): boolean {
        if(targetId === current.id) {
            Object.assign(current, newVersion);
            return true;
        }

        let updated = false;
        if(current.type === 'directory') {
            const dir = current as FsDirectory;
            dir.items.forEach(dir => {
                const res = this.updateChild(targetId, dir, newVersion);
                updated = updated || res; 
            });
        }

        return updated;
    }

    static findChildDoc(targetId: string, root: FsItem): FsItem {
        if(targetId === root.id) {
            return root;
        }
        const { dirs, docs } = this.getChildren(root);
        const idx = docs.findIndex(x => x.id === targetId);
        
        if(idx !== -1) {
            return docs[idx];
        }

        const children = dirs
            .map(x => this.findChildDoc(targetId, x))
            .filter(x => !!x);

        if(children.length === 0) {
            throw `No child found at: ${root.path}`;
        }

        return children[0];
    }

    private static findChildDir(childPath: string, root: FsItem): FsItem | undefined {
        if(childPath === root.path) {
            return root;
        }

        const children = this.getChildren(root).dirs;
        
        return children
            .map(x => this.findChildDir(childPath, x))
            .filter(x => !!x)
            .find(x => x.path === childPath);
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

    static createFsItemEvent(type: FsEventType, fsi: FsItem) {
        const now = new Date();
        const fsic = Utils.deepClone(fsi);
        
        if(type === 'created') {
            const r: FsItemCreatedEvent = { created: fsic, type: type, createdAt: now }
            return r;
        }
        else if(type === 'updated') {
            const r: FsItemUpdatedEvent = { updated: fsic, type: type, createdAt: now }
            return r;
        }
        else if(type === 'deleted') {
            const r: FsItemDeletedEvent = { deleted: fsic, type: type, createdAt: now }
            return r;
        }
        else {
            throw `Unsupported FsEvent of type ${type}`;
        }
    }

    static getName(path: string) {
        const arr = this.getPathParts(path);
        const last = arr[arr.length - 1];
        const name = last.substring(0, last.length - 1);
        
        return name.length === 0 ? ROOT.path : name;
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

    static getChildren = (item: FsItem) => {
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

    static doOnEvent<T>(
        ev: FsItemEvent,
        forCreated: (e: FsItemCreatedEvent) => T,
        forUpdated: (e: FsItemUpdatedEvent) => T,
        forDeleted: (e: FsItemDeletedEvent) => T) {
            switch(ev.type) {
                case 'created': return forCreated(ev as FsItemCreatedEvent);
                case 'updated': return forUpdated(ev as FsItemUpdatedEvent);
                case 'deleted': return forDeleted(ev as FsItemDeletedEvent);
                default: throw `Event of type ${ev.type} not handled`
            }
        }
}