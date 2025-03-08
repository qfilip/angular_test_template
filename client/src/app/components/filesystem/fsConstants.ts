import { FsItem } from "./fsitem.models";

export const root: FsItem = {
    id: '/',
    type: 'directory',
    items: []
} as const;