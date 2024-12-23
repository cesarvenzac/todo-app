import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  standalone: true,
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], criteria: any): any[] {
    if (!items || !criteria) {
      return items;
    }
    return items.filter((item) => {
      for (let key in criteria) {
        if (item[key] !== criteria[key]) {
          return false;
        }
      }
      return true;
    });
  }
}
