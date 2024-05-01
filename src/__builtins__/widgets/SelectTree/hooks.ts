import { useMemo, useRef, useState } from 'react'

import { useMemoizedFn } from '../../hooks'

import type { ISelectTreeEvent, ISelectTreeProps, ISelectTreeResponse } from './types'

const selectTreeEvent: ISelectTreeEvent[] = ['mount', 'popup', 'search', 'load', 'loupe']

/**
 * @title 接受 request 并处理统一异步逻辑
 */
export function useSelectTreeRequest(props: ISelectTreeProps) {
  const { request, pickEvent, omitEvent } = props

  /** 请求状态 (beforeEvent 是触发 Event 之前的临界状态) */
  const [requestStatus, setRequestStatus] = useState<ISelectTreeEvent | 'beforeSearch' | false>(false)

  /** 缓存上一次请求参数，用 ref 缓存即可，组件内部用不到，保持引用即可 */
  const prevParamsRef = useRef<any>(null)

  /** 允许 event 事件列表 */
  const allowableEvents = useMemo(() => {
    const aPickEvent = pickEvent ? pickEvent.split(/[,|]/) : []
    const aOmitEvent = omitEvent ? omitEvent.split(/[,|]/) : []

    const events = aPickEvent.length > 0
      ? selectTreeEvent.filter(item => aPickEvent.includes(item))
      : aOmitEvent.length > 0
        ? selectTreeEvent.filter(item => !aOmitEvent.includes(item))
        : []

    const obj = selectTreeEvent.reduce<Record<ISelectTreeEvent, boolean>>((prev, cur) => {
      // 默认开启放大镜事件，只要传递了 props.loupeRender 就表示启用放大镜模式
      prev[cur] = events.includes(cur) || cur === 'loupe'
      return prev
    }, {} as any)

    return obj
  }, [pickEvent, omitEvent])

  // ===================================

  const onRequestHandler = useMemoizedFn(
    (type: ISelectTreeEvent, params?: Record<string, any> | null): Promise<ISelectTreeResponse['content']> => {
      // 没有传递 props.request 阻止本次请求
      if (!request) {
        prevParamsRef.current = null
        // eslint-disable-next-line node/prefer-global/process
        if (process.env.NODE_ENV !== 'production') {
          console.warn('[Select] 你是否忘记传递 props.request 属性？')
        }
        return Promise.resolve(undefined)
      }

      // 上一次还未结束的话阻止本次请求 (不包含 beforeEvent)
      if (requestStatus && !requestStatus.startsWith('before')) {
        return Promise.resolve(undefined)
      }

      setRequestStatus(type)

      return new Promise((resolve, reject) => {
        request(type, prevParamsRef.current, params)
          .then((res: ISelectTreeResponse) => {
            // 不管什么类型，每次请求记录上一次的请求参数
            prevParamsRef.current = res.params

            if (type === 'loupe') {
              resolve(res as any)
            }
            else {
              // 其他情况的 resolve 函数直接返回 res.content 即可
              resolve(res.content)
            }
          }).catch((reason) => {
            console.warn(`[Request error occurred in the component](event: ${type}): `, reason)
            reject(reason)
          }).finally(() => {
            setRequestStatus(false)
          })
      })
    },
  )

  return { allowableEvents, requestStatus, setRequestStatus, onRequestHandler }
}
