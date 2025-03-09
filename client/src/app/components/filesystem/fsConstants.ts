import { FsItem } from "./fsitem.models";

export const ROOT: FsItem = {
    id: 'root',
    path: '/',
    type: 'directory',
    items: []
} as const;