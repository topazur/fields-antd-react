import { createContext, useContext, useMemo } from 'react'
import cls from 'classnames'

import { parseDomFlex } from '../../utils'
import { useConfigContext, usePrefixCls } from '../usePrefixCls'

import type { CSSProperties } from 'react'
import type { LiteralUnion } from '../../types'
import type { IResponsiveEnum } from './useResponsive'

export const RowJustify = [
  'start',
  'center',
  'end',
  'between',
  'around',
  'evenly',
  'stretch',
] as const
export type IRowJustify = (typeof RowJustify)[number]

export const RowItems = [
  'start',
  'center',
  'end',
  'baseline',
  'stretch',
] as const
export type IRowItems = (typeof RowItems)[number]

// ============================== RowContext ==============================

export interface RowContextState {
  wrap?: boolean
  width?: number
  breakpointSize?: IResponsiveEnum
  breakpointIndex?: number
}

export const RowContext = createContext<RowContextState>({})
export const useRowContext = () => useContext(RowContext)

// ============================== Hook: useRow ==============================

export type Gutter = number | number[]

export interface IUseRowParams {
  justify?: IRowJustify
  items?: IRowItems
  columnGap?: number
  rowGap?: number
  wrap?: boolean
}

/**
 * @title 计算 Row 组件的类名和样式 (支持响应式)
 * @param props 用到了 prefixCls、className、style 等属性
 * @param params 用到了响应式相关属性
 */
export function useRow(props: any, params: IUseRowParams) {
  const { justify = 'start', items = 'top', columnGap = 0, rowGap = 0, wrap = true } = params

  const rowPrefixCls = usePrefixCls('row', props)
  const { direction } = useConfigContext()

  return useMemo(() => {
    // ================ 计算 类名
    const calcClassName = cls(
      rowPrefixCls,
      {
        [`${rowPrefixCls}-nowrap`]: wrap === false,
        [`${rowPrefixCls}-rtl`]: direction === 'rtl',
        [`${rowPrefixCls}-justify-${justify}`]: !!justify,
        [`${rowPrefixCls}-items-${items}`]: !!items,
      },
      props.className,
    )

    // ================ 计算 style
    const calcStyle: CSSProperties = {}
    const gutterH = columnGap != null && columnGap > 0 ? columnGap / 2 : undefined

    // 水平间距通过 css.padding 实现，而没有使用 css.columnGap 实现
    // 为了保留左右两侧的间距，而不仅仅是相邻之间的间距
    if (gutterH) {
      // 通过 cssvar 传递给 Col 组件的水平间距变量
      calcStyle['--col-padding-left'] = `${gutterH}px`
      calcStyle['--col-padding-right'] = `${gutterH}px`
      // 由于给了 Col 组件 padding-x，因此在 Row 组件需要设置负的 margin-x 以抵消
      calcStyle.marginLeft = `-${gutterH}px`
      calcStyle.marginRight = `-${gutterH}px`
    }

    // 垂直间距使用 css.rowGap 实现
    if (rowGap) {
      calcStyle.rowGap = rowGap
    }

    return { className: calcClassName, style: { ...calcStyle, ...props.style } }
  }, [justify, items, columnGap, rowGap, rowPrefixCls, direction, props.className, props.style])
}

// ============================== Hook: useCol ==============================

export type FlexType = number | LiteralUnion<'none' | 'auto'>
export type ColSpanType = number | string

export interface IUseColParams {
  flex?: FlexType
  span?: ColSpanType
  order?: ColSpanType
  offset?: ColSpanType
  pull?: ColSpanType
  push?: ColSpanType
}

/**
 * @title 计算 Col 组件的类名和样式 (支持响应式)
 * @param props 用到了 prefixCls、className、style 等属性
 * @param params 用到了响应式相关属性
 */
export function useCol(props: any, params: IUseColParams) {
  const { flex, span, order = 0, offset = 0, pull = 0, push = 0 } = params

  const colPrefixCls = usePrefixCls('col', props)
  const { direction } = useConfigContext()

  // 获取 Row 传递的变量
  const { wrap } = useRowContext()

  return useMemo(() => {
    // ================ 计算 类名
    const calcClassName = cls(
      colPrefixCls,
      {
        [`${colPrefixCls}-rtl`]: direction === 'rtl',
        [`${colPrefixCls}-${span}`]: span !== undefined,
        [`${colPrefixCls}-offset-${offset}`]: offset || offset === 0,
        [`${colPrefixCls}-pull-${pull}`]: pull || pull === 0,
        [`${colPrefixCls}-push-${push}`]: push || push === 0,
      },
      props.className,
    )

    // ================ 计算 style
    const calcStyle: CSSProperties = {}

    // Horizontal gutter use padding
    calcStyle.paddingLeft = 'var(--col-padding-left, 0px)'
    calcStyle.paddingRight = 'var(--col-padding-right, 0px)'

    if (order || order === 0) {
      calcStyle.order = order
    }

    if (flex) {
      calcStyle.flex = parseDomFlex(flex)
      if (wrap === false && !calcStyle.minWidth) {
        calcStyle.minWidth = 0
      }
    }

    return { className: calcClassName, style: { ...calcStyle, ...props.style } }
  }, [flex, span, order, offset, pull, push, colPrefixCls, direction, props.className, props.style])
}
