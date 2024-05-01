import { useMemo, useRef, useState } from 'react'
import { useMemoizedFn } from 'ahooks'

import type { IAutoCompleteEvent, IAutoCompleteProps, IAutoCompleteResponse } from './types'

const autoCompleteEvent: IAutoCompleteEvent[] = ['mount', 'popup', 'search']

/**
 * @title 接受 request 并处理统一异步逻辑
 */
export function useAutoCompleteRequest(props: IAutoCompleteProps) {
  const { request, pickEvent, omitEvent } = props

  /** 请求状态 */
  const [requestStatus, setRequestStatus] = useState<IAutoCompleteEvent | false>(false)

  /** 缓存上一次请求参数，用 ref 缓存即可，组件内部用不到，保持引用即可 */
  const prevParamsRef = useRef<any>(null)

  /** 允许 event 事件列表 */
  const allowableEvents = useMemo(() => {
    const aPickEvent = pickEvent ? pickEvent.split(/[,|]/) : []
    const aOmitEvent = omitEvent ? omitEvent.split(/[,|]/) : []

    const events = aPickEvent.length > 0
      ? autoCompleteEvent.filter(item => aPickEvent.includes(item))
      : aOmitEvent.length > 0
        ? autoCompleteEvent.filter(item => !aOmitEvent.includes(item))
        : []

    const obj = autoCompleteEvent.reduce<Record<IAutoCompleteEvent, boolean>>((prev, cur) => {
      prev[cur] = events.includes(cur)
      return prev
    }, {} as any)

    return obj
  }, [pickEvent, omitEvent])

  // ===================================

  const onRequestHandler = useMemoizedFn(
    (type: IAutoCompleteEvent, params?: Record<string, any> | null): Promise<IAutoCompleteResponse['content']> => {
      // 没有传递 props.request 阻止本次请求
      if (!request) {
        prevParamsRef.current = null
        // eslint-disable-next-line node/prefer-global/process
        if (process.env.NODE_ENV !== 'production') {
          console.warn('[Select] 你是否忘记传递 props.request 属性？')
        }
        return Promise.resolve(undefined)
      }

      // 上一次还未结束的话阻止本次请求
      if (requestStatus) {
        return Promise.resolve(undefined)
      }

      setRequestStatus(type)

      return new Promise((resolve, reject) => {
        request(type, prevParamsRef.current, params)
          .then((res: IAutoCompleteResponse) => {
            // 不管什么类型，每次请求记录上一次的请求参数
            prevParamsRef.current = res.params
            // resolve 函数直接返回 res.content 即可
            resolve(res.content)
          }).catch((reason) => {
            console.warn(`[Request error occurred in the component](event: ${type}): `, reason)
            reject(reason)
          }).finally(() => {
            setRequestStatus(false)
          })
      })
    },
  )

  return { allowableEvents, requestStatus, onRequestHandler }
}
