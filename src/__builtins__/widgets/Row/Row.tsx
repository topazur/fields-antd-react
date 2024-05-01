import { useMemo, useRef } from 'react'

import { RowContext, useResponsive, useResponsiveProps, useRow, useSize } from '../../hooks'

import type { FC, HTMLAttributes, PropsWithChildren } from 'react'
import type { Gutter, IRowItems, IRowJustify, RowContextState } from '../../hooks'

export interface RowProps extends HTMLAttributes<HTMLDivElement> {
  prefixCls?: string
  /**
   * 水平对齐的字符串枚举类型 或 响应式类型
   * @default 'start'
   */
  justify?: IRowJustify | IRowJustify[]
  /**
   * 垂直对齐的字符串枚举类型 或 响应式类型
   * @default 'top'
   */
  items?: IRowItems | IRowItems[]
  /**
   * 网格布局列间距 => 水平间距
   * @default undefined
   */
  columnGap?: Gutter
  /**
   * 网格布局行间距 => 垂直间距
   * @default undefined
   */
  rowGap?: Gutter
  /**
   * 是否换行
   * @default true
   */
  wrap?: boolean
  /**
   * 容器尺寸断点
   * @default Array(6) 最多解析6个断点尺寸
   */
  breakpoints?: number[]
}

/**
 * @title 栅格 - Row
 */
export const Row: FC<PropsWithChildren<RowProps>> = (props) => {
  const { wrap, breakpoints, children, ...restProps } = props

  // 监听容器尺寸断点
  const breakpointRef = useRef(null)
  const breakpointSize = useSize(breakpointRef)
  const { currentSize, currentIndex } = useResponsive(breakpointSize?.width, breakpoints)

  // 传递 Col 组件的相关变量
  const rowContextValue = useMemo<RowContextState>(() => {
    return { wrap, width: breakpointSize?.width, breakpointSize: currentSize, breakpointIndex: currentIndex }
  }, [wrap, breakpointSize?.width, currentSize, currentIndex])

  const breakpointProps = useResponsiveProps(
    restProps,
    currentIndex,
    'justify|items|columnGap|rowGap|wrap',
  )

  // 根据响应式结果，计算出当前断点下的类名和样式
  const { className, style } = useRow(props, breakpointProps)

  return (
    <RowContext.Provider value={rowContextValue}>
      <div
        ref={breakpointRef}
        className={className}
        style={style}
      >
        {children}
      </div>
    </RowContext.Provider>
  )
}

export default Row
