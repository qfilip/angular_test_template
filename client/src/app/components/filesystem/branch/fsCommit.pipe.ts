import {Pipe, PipeTransform} from '@angular/core';
import { Commit, FsItemEvent } from '../file/fsitem.models';
import { FsItemUtils } from '../file/fsitem.utils';
@Pipe({
  name: 'fsCommit',
})
export class FsCommitPipe implements PipeTransform {
  transform(value: Commit | undefined): string {
    
    return value ? value.id : 'x';
  }
}