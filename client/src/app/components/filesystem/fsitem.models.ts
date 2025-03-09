export type FsItemType = 'directory' | 'document';

export type FsDirectory = {
    items: FsItem[];
}

export type FsDocument = {
    content: string;
}

export type FsItem = {
    id: string,
    type: FsItemType,
    path: string
} & (FsDirectory | FsDocument);

export type Commit = {
    id: string;
}

export type Branch = {
    id: string;
    name: string;
    commits: Commit[];
}