import { isArray } from 'radash'

export function toArr(val: any): any[] {
  return (isArray(val) ? val : val ? [val] : [])
};
