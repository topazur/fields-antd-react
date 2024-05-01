import { useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import type { FC, ReactNode } from 'react'

export interface ICreatePortalProps {
  parentCls: string
  containerCls?: string
  key?: null | string
  children: ReactNode
}

export const CreatePortal: FC<ICreatePortalProps> = (props) => {
  const { parentCls, containerCls, key, children } = props

  // 当前组件元素引用，通过 closest 查找最近的共同父元素
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [container, setContainer] = useState<Element | null>(null)

  useLayoutEffect(() => {
    // 查找最接近的具有类名为 parentCls 的祖先元素
    const parentEle = wrapperRef.current?.closest(`.${parentCls}`)
    if (!parentEle) { return }

    // 不传递 containerCls，表示即将插入的 dom 就是这个父级元素
    if (!containerCls) {
      setContainer(parentEle)
      return
    }
    // 查找待插入容器
    const container = containerCls ? parentEle.querySelector(`.${containerCls}`) : null
    setContainer(container)
  }, [])

  return (
    <div ref={wrapperRef}>
      {container && createPortal(children, container, key)}
    </div>
  )
}
