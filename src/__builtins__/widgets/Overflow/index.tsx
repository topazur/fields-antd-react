import { useLayoutEffect, useRef, useState } from 'react'
import cls from 'classnames'
import { isFunction } from 'radash'

import { usePrefixCls } from '../../hooks'

import type { CSSProperties, FC, ReactElement, ReactNode } from 'react'

export interface IOverflowProps {
  rootClassName?: string
  className?: string
  style?: CSSProperties
  /**
   * 得到分隔下标后动态渲染
   */
  children?: ReactNode | ((index: number) => ReactNode)
  /**
   * 外部指定容器最大宽度，否则默认值是 wrapperRef 的宽度
   */
  maxWidth?: number
  /**
   * 所有 items dom 列表，用于计算宽度
   * // NOTICE: 外层最好套一层 span 元素，目的是对 item 的 margin 也可以计算在宽度内
   */
  content?: Array<ReactElement>
  /**
   * 所有可能存在的 rest item dom，同样用于计算宽度
   * //NOTICE: 如果类型是 ReactElement，表示折叠 dom 是固定宽度的。比如 <span>更多</span>。
   * //NOTICE: 如果类型是函数，表示折叠 dom 是动态宽度的，宽度取决于折叠长度。比如 <span>+1</span>、<span>+2</span>、<span>+3</span> ...
   */
  restContent?: ReactElement | ((len: number) => ReactElement[])
}

/**
 * @title 比较每个子元素宽度，超出折叠或隐藏起来
 * @param {IOverflowCSSProps} props
 * @description 放弃使用 IntersectionObserver API，该方案监听每个子元素，卡顿严重。使用传统计算宽度的方式，计算逻辑完全封装在组件内部
 */
export const Overflow: FC<IOverflowProps> = (props) => {
  const {
    rootClassName,
    className,
    style,
    maxWidth,
    content,
    restContent,
    children,
  } = props

  const calcPrefixCls = usePrefixCls('overflow', { prefixCls: 'fields' }, true)

  // 容器元素引用
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  // 超出的下标
  const [splitIndex, setSplitIndex] = useState<number>(0)

  useLayoutEffect(() => {
    const wrapperWidth = maxWidth ?? wrapperRef.current!.clientWidth

    // 仅元素节点参与计算 (API: [first|last]ElementChild 和 children 都是只获取元素节点)
    const itemList = wrapperRef.current!.firstElementChild!.children
    const restList = wrapperRef.current!.lastElementChild!.children
    const itemLen = itemList.length
    const restLen = restList.length

    // 计算 offsetWidth 的原因是会包含 border 的宽度
    const itemWidthList: number[] = Array.from(itemList).map((item: any) => item.offsetWidth)
    const restWidthList: number[] = Array.from(restList).map((item: any) => item.offsetWidth)

    // 测试 restContent 是否已超出容器宽度，若只有 restContent 都超出，则不必再往下走
    if (Math.max(...restWidthList) >= wrapperWidth) {
      setSplitIndex(0)
      return
    }

    let calcWidth = 0
    for (let i = 0; i < itemLen; i++) {
      // 计算 restContent 的宽度
      let restContentWidth = restWidthList[0]
      if (restLen > 1) {
        // 被折叠的个数 => itemLen - i
        restContentWidth = restWidthList[String(itemLen - i).length - 1]
      }

      // 累加 item 的宽度
      calcWidth += itemWidthList[i]

      // 累加结果大于容器宽度则 break 跳出循环
      if (calcWidth + restContentWidth > wrapperWidth) {
        setSplitIndex(i)
        break
      }
      // 累加到最后一项仍小于容器宽度，表明没有超出循环
      else if (i >= itemLen - 1) {
        setSplitIndex(itemLen)
        break
      }
    }
  }, [maxWidth, content, restContent])

  return (
    <div
      ref={wrapperRef}
      className={cls(calcPrefixCls, rootClassName, className)}
      style={style}
    >
      {/* 普通 item 列表，渲染目的是为了计算宽度，对用户来说是不可见 */}
      <div className={cls(`${calcPrefixCls}-item-content`)}>
        {content}
      </div>

      {/* 可见的 item 和可能出现的 rest，通过计算得来的下标动态加载 */}
      <div className={cls(`${calcPrefixCls}-container`)}>
        {isFunction(children) ? children(splitIndex) : children}
      </div>

      {/* rest item 列表，渲染目的是为了计算宽度，对用户来说是不可见 */}
      <div className={cls(`${calcPrefixCls}-rest-content`)}>
        {isFunction(restContent) ? (content?.length && restContent(content?.length)) : restContent}
      </div>
    </div>
  )
}
