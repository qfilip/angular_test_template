import { PopupService } from '../../features/common-ui/services/popup.service';
import { Result } from '../models';

export class Utils {
  private static guidTemplate = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
  static generateGuid(): string {
    return this.guidTemplate.replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  static makeId = () => Math.random().toString(16).substr(2, 8);

  static printErrors(service: PopupService, errors: string[]) {
    errors.forEach((x) => {
      service.push({
        color: 'warn',
        header: 'Validation failed',
        text: x,
      });
    });
  }

  static deepClone<T>(x: T) {
    if (typeof x !== 'object' || x === null) return x;

    const clone: any = Array.isArray(x) ? [] : {};

    for (let key in x) {
      const value = x[key];
      clone[key] = this.deepClone(value);
    }

    return clone as T;
  }

  static timeSort = (a: Date, b: Date) =>
    new Date(a).getTime() > new Date(b).getTime() ? 1 : -1;
}

export function makeResult<T>(errs: string[], data?: T) {
  return errs.length > 0 ? makeErr<T>(errs) : makeOk<T>(data!);
}

function makeOk<T>(x: T) {
  const r: Result<T> = {
    data: x,
    errors: [] as string[],
  };

  return r;
}

function makeErr<T>(errors: string[]) {
  const r: Result<T> = {
    data: undefined,
    errors: errors,
  };

  return r;
}
