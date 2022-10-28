import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search',
})
export class SearchPipe implements PipeTransform {
  transform(value: any, args: any): any {
    if (args === '' || args.length < 3) return value;

    const results = [];
    for (const schedule of value) {
      if (schedule.name.toLowerCase().indexOf(args.toLowerCase()) > -1) {
        results.push(schedule);
      }
    }
    return results;
  }
}
