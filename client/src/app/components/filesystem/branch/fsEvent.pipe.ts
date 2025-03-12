import {Pipe, PipeTransform} from '@angular/core';
import { FsItemEvent } from '../file/fsitem.models';
import { FsItemUtils } from '../file/fsitem.utils';
@Pipe({
  name: 'fsItemEvent',
})
export class FsItemEventPipe implements PipeTransform {
  transform(value: FsItemEvent): string {
    const { path, type } = FsItemUtils.doOnEvent<{path: string, type: string}>(
        value,
        e => ({ path: e.created.path, type: e.created.type }),
        e => ({ path: e.updated.path, type: e.updated.type }),
        e => ({ path: e.deleted.path, type: e.deleted.type })
    );
    
    return `${value.type} ${type} ${path}`;
  }
}