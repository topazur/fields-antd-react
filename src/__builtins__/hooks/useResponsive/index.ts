import { useMemo } from "react"
import { isNumber } from "radash"

export const responsiveEnum = ['xxl', 'xl', 'lg', 'md', 'sm', 'xs'] as const
export type IResponsiveEnum = (typeof responsiveEnum)[number]
export type IResponsiveEnumLike<T = any> = {
  [key in IResponsiveEnum]?: T
}

/**
 * @title 根据容器宽度匹配断点尺寸结果，返回值为对象格式
 * @param width 当前容器的宽度
 * @param breakpoints 容器尺寸断点
 * @returns 各断点尺寸匹配的结果，以及当前匹配的断点尺寸
 */
export function useResponsive(
  width?: number,
  breakpoints: number[] = [0, 576, 768, 992, 1200, 1600]
) {
  return useMemo(() => {
    const results: IResponsiveEnumLike<boolean> & { current?: string } = {
      xs: false,
      sm: false,
      md: false,
      lg: false,
      xl: false,
      xxl: false,
      current: undefined,
    }

    // 当 width 不存在直接返回零值对象
    if (!isNumber(width)) {
      return results
    }

    // 反向调整容器尺寸断点，按照 xxl->xs 的顺序
    // 如果 breakpoints 长度小于 6 则对应断点没值赋予 undefined，表示该断点不参与比较
    const breakpointsEnum = Array(responsiveEnum.length)
      .fill(undefined)
      .map((_item, idx) => breakpoints[(responsiveEnum.length - 1) - idx])

    for (let idx = 0; idx < responsiveEnum.length; idx++) {
      const responsiveKey = responsiveEnum[idx];
      const breakpointWidth = breakpointsEnum[idx]

      // 容器尺寸大于断点尺寸，匹配则跳出循环，保证每次仅有一个断点匹配成功
      // 值为 undefined 的表示跳过该断点，返回 false 不参与比较
      const flag = isNumber(breakpointWidth) ? width >= breakpointWidth : false
      if (flag) {
        results[responsiveKey] = flag
        results.current = responsiveKey
        break
      }
    }

    return results
  }, [width, JSON.stringify(breakpoints)])
}
