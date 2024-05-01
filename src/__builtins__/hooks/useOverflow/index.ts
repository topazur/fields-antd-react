import { useEffect, useRef, useState } from 'react'
import { useLatest } from 'ahooks'

/**
 * @title 判断内部元素是否超出容器元素的宽度
 */
export function useOverflow<
  Container extends HTMLElement,
  Content extends HTMLElement,
>(...deps: any) {
  const [overflow, setOverflow] = useState(false)

  const containerRef = useRef<Container>(null)
  const contentRef = useRef<Content>(null)
  const latestOverflowRef = useLatest(overflow)

  useEffect(() => {
    requestAnimationFrame(() => {
      if (!(containerRef.current && contentRef.current)) {
        return
      }
      const containerWidth = containerRef.current.getBoundingClientRect().width
      const contentWidth = contentRef.current.getBoundingClientRect().width

      if (contentWidth && containerWidth && containerWidth < contentWidth) {
        !latestOverflowRef.current && setOverflow(true)
        return
      }
      latestOverflowRef.current && setOverflow(false)
    })
  }, [JSON.stringify(deps)])

  return { overflow, containerRef, contentRef }
}
