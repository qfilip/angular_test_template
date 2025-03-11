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

export type DirsAndDocs = { dirs: FsItem[], docs: FsItem[] };

type FsEvent = { createdAt: Date }

export type FsItemCreatedEvent = { created: FsItem } & FsEvent;
export type FsItemUpdatedEvent = { updated: FsItem } & FsEvent;
export type FsItemDeletedEvent = { deleted: FsItem } & FsEvent;

export type FsItemEvent = FsItemCreatedEvent | FsItemUpdatedEvent | FsItemDeletedEvent;

export type Commit = {
    id: string;
    events: FsItemEvent[];
    createdAt: Date;
}

export type Branch = {
    id: string;
    name: string;
    commits: Commit[];
}