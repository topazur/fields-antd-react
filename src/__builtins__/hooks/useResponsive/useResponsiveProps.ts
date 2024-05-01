import { useMemo } from 'react'
import { isArray } from 'radash'

/**
 * @title 根据当前属性是否配置为数组及尺寸断点的下标获取值
 */
function calcFactor<T = any>(value: T | T[], breakpointIndex: number = 0): T {
  // 原样返回
  if (value == null) { return value }

  // 非数组，即不参与断点计算，原样返回
  if (!isArray(value)) { return value }

  return value[breakpointIndex]
}

/**
 * @title 计算出容器尺寸断点对应的属性的具体值
 * @examples breakpoints=[0, 576, 768]; props['labelAlign'] = ['left', 'right', 'left'];
 *  那么当 idx 等于 1 时，labelAlign的具体是 right。
 */
export function useResponsiveProps(
  props: any,
  breakpointIndex?: number,
  breakpointkeys?: string,
) {
  return useMemo(() => {
    if (!breakpointkeys) { return props }

    const aBreakpointkeys = breakpointkeys.split('|').filter(Boolean)
    const bProps = aBreakpointkeys.reduce<Record<string, any>>((prev, cur) => {
      prev[cur] = calcFactor(props[cur], breakpointIndex)
      return prev
    }, {})
    return { ...props, ...bProps }
  }, [props, breakpointIndex, breakpointkeys])
}
