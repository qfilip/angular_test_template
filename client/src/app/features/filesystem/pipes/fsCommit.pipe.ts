import { Pipe, PipeTransform } from '@angular/core';
import { Commit } from '../models/fsitem.models';
@Pipe({
  name: 'fsCommit',
})
export class FsCommitPipe implements PipeTransform {
  transform(value: Commit | undefined): string {
    
    return value ? value.id : 'x';
  }
}