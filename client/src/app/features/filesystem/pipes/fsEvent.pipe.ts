import {Pipe, PipeTransform} from '@angular/core';
import { FsItemEvent } from '../models/fsitem.models';
import { FsItemUtils } from '../utils/fsitem.utils';
@Pipe({
  standalone: true,
  name: 'fsItemEvent',
})
export class FsItemEventPipe implements PipeTransform {
  transform(value: FsItemEvent): string {
    const { path, type, icon } = FsItemUtils.doOnEvent<{path: string, type: string, icon: string}>(
        value,
        e => ({ path: e.created.path, type: e.created.type === 'directory' ? '📁' : '📃', icon: '➕' }),
        e => ({ path: e.updated.path, type: e.updated.type === 'directory' ? '📁' : '📃', icon: '🎭' }),
        e => ({ path: e.deleted.path, type: e.deleted.type === 'directory' ? '📁' : '📃', icon: '💀' })
    );
    
    return `${icon} ${type} ${path}`;
  }
}