import type { HTMLAttributes } from 'react'

/**
 * @title 挑选出 data- 开头的属性
 */
export function pickDataAttrs(props: any = {}) {
  const results: HTMLAttributes<any> = {}

  for (const key in props) {
    if (key.includes('data-')) {
      results[key] = props[key]
    }
  }

  return results
}

export function parseDomLength(len: any): string | undefined {
  if (len == null) {
    return undefined
  }

  const num = Number(len)
  if (Number.isFinite(num)) {
    return `${num}px`
  }

  return len
}

export function parseDomFlex(flex: any): string | undefined {
  if (flex == null) {
    return undefined
  }

  const num = Number(flex)
  if (Number.isFinite(num)) {
    return `${flex} ${flex} auto`
  }

  // eslint-disable-next-line regexp/no-unused-capturing-group
  if (/^\d+(\.\d+)?(px|em|rem|%)$/.test(flex)) {
    return `0 0 ${flex}`
  }

  return flex
}
