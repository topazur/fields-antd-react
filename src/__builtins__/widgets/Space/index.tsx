import { Children, createElement, useMemo } from 'react'
import cls from 'classnames'
import { get, uid } from 'radash'

import { useConfigContext, usePrefixCls } from '../../hooks'
import { parseDomLength } from '../../utils'

import type { CSSProperties, FC, HTMLAttributes, PropsWithChildren } from 'react'
import type { IRowItems } from '../../hooks'

export interface SpaceProps extends HTMLAttributes<HTMLDivElement> {
  prefixCls?: string
  rootClassName?: string
  className?: string
  style?: CSSProperties
  /**
   * 布局方向: 水平 or 垂直；不支持 wrap换行，要想更复杂的布局请使用 Row/Col 组件替代。
   */
  direction?: 'horizontal' | 'vertical'
  /**
   * css.align-items
   */
  items?: IRowItems
  /**
   * 水平间距 or 垂直间距
   */
  gap?: number //
  /**
   * 相邻组件分隔符 (仅支持水平布局)
   */
  split?: React.ReactNode
  /**
   * 透传给子元素 size 属性，若其支持可以统一大小
   * TODO: 暂不支持
   */
  // size?: SizeType
}

/**
 * @title 间距 - Space
 */
export const Space: FC<PropsWithChildren<SpaceProps>> = (props) => {
  const {
    rootClassName,
    className,
    style,
    direction = 'horizontal',
    items,
    gap = 8,
    split,
    children,
  } = props

  const spacePrefixCls = usePrefixCls('space', { prefixCls: 'fields' }, true)
  const { direction: rtlDirection } = useConfigContext()

  // 计算类名
  const classes = useMemo(() => {
    return cls(
      spacePrefixCls,
      `${spacePrefixCls}-${direction}`,
      {
        [`${spacePrefixCls}-rtl`]: rtlDirection === 'rtl',
        [`${spacePrefixCls}-items-${items}`]: !!items,
        [`${spacePrefixCls}-compact`]: gap === 0,
      },
      className,
      rootClassName,
    )
  }, [spacePrefixCls, direction, items, gap, spacePrefixCls, rtlDirection])

  // 计算样式 (间距)
  const styles = useMemo(() => {
    if (gap === 0) { return style }

    return {
      columnGap: direction === 'horizontal' ? parseDomLength(gap) : undefined,
      rowGap: direction === 'vertical' ? parseDomLength(gap) : undefined,
      ...style,
    }
  }, [style, direction, gap])

  // 使用 toArray 处理 children，并做包装
  const childNodes = useMemo(() => {
    const createSplitDom = (key: string) => createElement('span', { key, className: `${spacePrefixCls}-item-split` }, split)

    const nodes = Children.toArray(children)
    const nodesDom = nodes.map((node, idx) => {
      const key = get(node, 'key', uid(8, '*'))

      const classes = cls(`${spacePrefixCls}-item`, {
        [`${spacePrefixCls}-first-item`]: idx === 0,
        [`${spacePrefixCls}-last-item`]: idx === nodes.length - 1,
      })
      const dom = createElement('div', { key, className: classes }, node)

      // 当 gap 等于 0 间隔插入分隔符，最后一项不插入
      return [dom, idx !== nodes.length - 1 && gap !== 0 && createSplitDom(`${key}_split`)]
    })

    return nodesDom
  }, [direction, gap, children, spacePrefixCls])

  return (
    <div className={classes} style={styles}>
      {childNodes}
    </div>
  )
}
