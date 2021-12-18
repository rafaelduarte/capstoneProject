import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'commaSeperator',
})
export class CommaSeperatorPipe implements PipeTransform {
  transform(value: any): number {
    let result: number = 0;
    return value.length;
  }
}
