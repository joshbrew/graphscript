
//thanks gpt 
export type TimeUnit =
  | 'second'
  | 'minute'
  | 'hour'
  | 'day'
  | 'week'
  | 'month'
  | 'year'
  | 'decade'
  | 'century'
  | 'millennium'
  | 'microsecond'
  | 'nanosecond';

type Plural<T extends string> = `${T}s`;

export type TimeSpecifier = `now` | `last ${string} ${Plural<TimeUnit>}` | `last ${TimeUnit}`;

export function genTimestampFromString(specifier: TimeSpecifier): number {
    const now = new Date();
  
    if(specifier === 'now') {}
    else if (specifier === 'last minute') {
        now.setMinutes(now.getMinutes() - 1);
    } else if (specifier === 'last hour') {
        now.setHours(now.getHours() - 1);
    } else if (specifier === 'last day') {
        now.setDate(now.getDate() - 1);
    } else if (specifier === 'last week') {
        now.setDate(now.getDate() - 7);
    } else if (specifier === 'last month') {
        now.setMonth(now.getMonth() - 1);
    } else if (specifier === 'last year') {
        now.setFullYear(now.getFullYear() - 1);
    } else if (specifier === 'last decade') {
        now.setFullYear(now.getFullYear() - 1 * 10);
    } else if (specifier === 'last century') {
        now.setFullYear(now.getFullYear() - 1 * 100);
    } else if (specifier === 'last millennium') {
        now.setFullYear(now.getFullYear() - 1 * 1000);
    } else if (specifier === 'last microsecond') {
        now.setMilliseconds(now.getMilliseconds() - 1);
    } else if (specifier === 'last nanosecond') {
        now.setMilliseconds(now.getMilliseconds() - 1 * 0.001);
    } else if (specifier.startsWith('last')) {
      const [, count, unit] = specifier.match(/last (\d+) (\w+)/) || [];
      if (count && unit) {
        const num = parseInt(count, 10);
        if (unit === 'minute') {
            now.setMinutes(now.getMinutes() - num);
        } else if (unit === 'hour') {
            now.setHours(now.getHours() - num);
        } else if (unit === 'day') {
            now.setDate(now.getDate() - num);
        } else if (unit === 'week') {
            now.setDate(now.getDate() - num * 7);
        } else if (unit === 'month') {
            now.setMonth(now.getMonth() - num);
        } else if (unit === 'year') {
            now.setFullYear(now.getFullYear() - num);
        } else if (unit === 'decade') {
            now.setFullYear(now.getFullYear() - num * 10);
        } else if (unit === 'century') {
            now.setFullYear(now.getFullYear() - num * 100);
        } else if (unit === 'millennium') {
            now.setFullYear(now.getFullYear() - num * 1000);
        } else if (unit === 'microsecond') {
            now.setMilliseconds(now.getMilliseconds() - num);
        } else if (unit === 'nanosecond') {
            now.setMilliseconds(now.getMilliseconds() - num * 0.001);
        }
      }
    }
  
    return now.getTime();
  }