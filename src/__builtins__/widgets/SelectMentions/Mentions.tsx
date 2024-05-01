import { useEffect, useMemo, useRef, useState } from 'react'
import { Mentions as AntdMentions, Spin } from 'antd'
import cls from 'classnames'
import { debounce } from 'radash'

import { useControllableValue, usePrefixCls } from '../../hooks'
import { useMentionsRequest } from './hooks'

import type { FC } from 'react'
import type { IMentionsProps } from './types'

export const Mentions: FC<IMentionsProps> = (props) => {
  const {
    // loading, // loading 通过设置 disabled option 在包装层已实现
    options,
    // showSearch, // always true
    filterOption = true,
    // ==== 调整样式的相关属性 ====
    variant = 'outlined',
    disabled = false,
    readOnly = false,
    // ==== 输入 ====
    split, // 设置触发关键字，默认值为 '@'
    prefix, // 设置选中项前后分隔符，默认值为 ' '
    onSelect,
    // ======== custom ========
    requestDelay = 500,
    request,
    locale,
    defaultValue: _0,
    pickEvent: _1,
    omitEvent: _2,
    ...restProps
  } = props

  const calcPrefixCls = usePrefixCls('select-mentions', { prefixCls: 'fields' }, true)

  /** 远程数据源 */
  const [dataSource, setDataSource] = useState<any[]>([])
  /** 请求时序控制 */
  const fetchRef = useRef(0)
  /** 自定义 hook 处理重复的异步逻辑 */
  const { allowableEvents, requestStatus: _, onRequestHandler } = useMentionsRequest(props)

  // =====================================================

  /**
   * @title 是否传递了 props.request 属性
   */
  const hasRequestProp = useMemo(() => {
    return !!request
  }, [request])

  /**
   * @title merged filterOption
   * @description 当 props.request 存在时关闭本地搜索
   */
  const mergedFilterOption = useMemo(() => {
    return (request && allowableEvents.search) ? false : (filterOption === true ? undefined : filterOption)
  }, [request, filterOption, allowableEvents.search])

  /**
   * @title merged 数据源
   * @description 当 props.request 存在时优先使用远程数据源，否则使用 options 当作数据源
   */
  const mergedDataSource = useMemo(() => {
    return request ? dataSource : options
  }, [request, dataSource, options])

  // =====================================================

  // 组件的状态既可以自己管理，也可以被外部控制
  const [controllableValue, onChange] = useControllableValue<any>(props, {
    defaultValuePropName: 'defaultValue',
    valuePropName: 'value',
    trigger: 'onChange',
  })

  // ======================================================
  // =================== Request Start ====================
  // ======================================================

  /**
   * @title 实现了防抖控制和请求时序控制的远程搜索
   * @kind 请求 <参数为输入框的值，多用于模糊搜索；响应先置空再覆盖>
   */
  const onDebounceSearch = useMemo(() => {
    if (!hasRequestProp) {
      return undefined
    }

    // EVENTS: 该事件被禁止
    if (!allowableEvents.search) { return undefined }

    const func = (inputValue: string) => {
      // NOTICE: 当按下 prefix 按键后，就应该触发搜索，此处不应该阻止空串这种情况
      // if (inputValue === '') { return }

      fetchRef.current += 1 // 请求时序加一
      const fetchId = fetchRef.current
      // setDataSource([]) // NOTICE: 此处不再设置，因为此组件的loading是通过 option 选项设置的
      onRequestHandler('search', { value: inputValue })
        .then((content) => {
          // 时序不匹配阻止 set 操作
          if (fetchId !== fetchRef.current) {
            // for fetch callback order
            return
          }
          content && setDataSource(content)
        })
    }

    return debounce({ delay: requestDelay }, func)
  }, [requestDelay, hasRequestProp, allowableEvents.search, onRequestHandler])

  useEffect(() => {
    if (!hasRequestProp) {
      return
    }

    // EVENTS: 该事件被禁止
    if (!allowableEvents.mount) { return }

    onRequestHandler('mount')
      .then((content) => {
        content && setDataSource(content)
      })
  }, [allowableEvents.mount])

  // ======================================================
  // ==================== Request End =====================
  // ======================================================

  return (
    <AntdMentions
      {...restProps}
      className={cls(calcPrefixCls)}
      loading={false}
      options={mergedDataSource}
      filterOption={mergedFilterOption}
      // ==== 调整样式的相关属性 ====
      variant={variant}
      disabled={disabled}
      readOnly={readOnly}
      // ==== value/onChange ====
      split={split}
      prefix={prefix}
      value={controllableValue}
      onChange={onChange}
      // onSelect={onSelectHandler}
      // ======= request =======
      onSearch={(value) => {
        if (onDebounceSearch) {
          setDataSource([{
            disabled: true,
            value: 'ANTD_SEARCHING',
            label: (
              <span>
                <Spin size="small" />
                <span style={{ marginLeft: '8px' }}>{locale?.search || 'Search...'}</span>
              </span>
            ),
          }])
          onDebounceSearch(value)
        }
      }}
    />
  )
}
