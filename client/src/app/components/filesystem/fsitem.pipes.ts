import { Pipe, PipeTransform } from '@angular/core';
import { FsItemUtils } from './fsitem.utils';

@Pipe({
  name: 'fsItemName',
})
export class FsItemNamePipe implements PipeTransform {
  transform(value: string): string {
    return FsItemUtils.getName(value);
  }
}