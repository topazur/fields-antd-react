import { useMemo, useRef, useState } from 'react'
import { useMemoizedFn } from 'ahooks'

import type { ISelectEvent, ISelectProps, ISelectResponse } from './types'

const selectEvent: ISelectEvent[] = ['mount', 'popup', 'search', 'scroll', 'loupe']

function createNoMoreOption(label: any): any {
  return {
    className: 'ant-select-item-option_nomore',
    style: { cursor: 'default', textAlign: 'center' },
    title: typeof label === 'string' ? label : undefined,
    disabled: true,
    value: '__NOMORE__',
    label,
  }
}

/**
 * @title 接受 request 并处理统一异步逻辑
 */
export function useSelectRequest(props: ISelectProps) {
  const { request, pickEvent, omitEvent, locale } = props

  /** 请求状态 */
  const [requestStatus, setRequestStatus] = useState<ISelectEvent | false>(false)

  /** 在 scroll 事件下是否存在未加载完毕的条目 */
  const existNextPageRef = useRef<boolean>(true)
  /** 缓存上一次请求参数，用 ref 缓存即可，组件内部用不到，保持引用即可 */
  const prevParamsRef = useRef<any>(null)

  /** 允许 event 事件列表 */
  const allowableEvents = useMemo(() => {
    const aPickEvent = pickEvent ? pickEvent.split(/[,|]/) : []
    const aOmitEvent = omitEvent ? omitEvent.split(/[,|]/) : []

    const events = aPickEvent.length > 0
      ? selectEvent.filter(item => aPickEvent.includes(item))
      : aOmitEvent.length > 0
        ? selectEvent.filter(item => !aOmitEvent.includes(item))
        : []

    const obj = selectEvent.reduce<Record<ISelectEvent, boolean>>((prev, cur) => {
      // 默认开启放大镜事件，只要传递了 props.loupeRender 就表示启用放大镜模式
      prev[cur] = events.includes(cur) || cur === 'loupe'
      return prev
    }, {} as any)

    return obj
  }, [pickEvent, omitEvent])

  // ===================================

  const onRequestHandler = useMemoizedFn(
    (type: ISelectEvent, params?: Record<string, any> | null): Promise<ISelectResponse['content']> => {
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
          .then((res: ISelectResponse) => {
            // 不管什么类型，每次请求记录上一次的请求参数
            prevParamsRef.current = res.params

            if (type === 'loupe') {
              resolve(res as any)
            }
            else if (type === 'scroll' && res.scroll?.hasNextPage) {
              // 当 scroll 事件下，并且已加载该条件下所有数据，才修改该变量为 false。
              // 并且在数据源末尾添加 `没有更多` 选项。
              existNextPageRef.current = false
              const content = (res.content || []).concat(createNoMoreOption(locale?.noMore || 'No More'))
              resolve(content)
            }
            else {
              // 其他情况恢复该变量为 true，以免不能触发滚动
              existNextPageRef.current = true
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

  return { allowableEvents, requestStatus, existNextPageRef, onRequestHandler }
}
