import { FsItem } from "./models/fsitem.models";

export const ROOT: FsItem = {
    id: 'root',
    path: '/',
    type: 'directory',
    items: []
} as const;