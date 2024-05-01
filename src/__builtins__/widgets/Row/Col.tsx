import { useCol, useResponsiveProps, useRowContext } from '../../hooks'

import type { FC, HTMLAttributes, PropsWithChildren } from 'react'
import type { ColSpanType, FlexType } from '../../hooks'

export interface ColProps extends HTMLAttributes<HTMLDivElement> {
  prefixCls?: string
  /**
   * flex 布局属性
   */
  flex?: FlexType | FlexType[]
  /**
   * 栅格占位格数，为 0 时相当于 display: none
   */
  span?: ColSpanType | ColSpanType[]
  /**
   * 栅格顺序
   * @default 0
   */
  order?: ColSpanType | ColSpanType[]
  /**
   * 栅格左侧的间隔格数，间隔内不可以有栅格
   * @default 0
   */
  offset?: ColSpanType | ColSpanType[]
  /**
   * 栅格向左移动格数
   * @default 0
   */
  pull?: ColSpanType | ColSpanType[]
  /**
   * 栅格向右移动格数
   * @default 0
   */
  push?: ColSpanType | ColSpanType[]
}

/**
 * @title 栅格 - Col
 * @description 对于 flex 和 order 属性直接通过 style 设置样式
 */
export const Col: FC<PropsWithChildren<ColProps>> = ({ children, ...props }) => {
  // 获取 Row 传递的变量
  const { breakpointIndex } = useRowContext()
  // 监听容器尺寸断点
  const breakpointProps = useResponsiveProps(
    props,
    breakpointIndex,
    'flex|span|order|offset|pull|push',
  )
  // 根据响应式结果，计算出当前断点下的类名和样式
  const { className, style } = useCol(props, breakpointProps)

  return (
    <div
      className={className}
      style={style}
    >
      {children}
    </div>
  )
}

export default Col
