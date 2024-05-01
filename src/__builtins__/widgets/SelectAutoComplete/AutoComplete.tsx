import { createElement, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AutoComplete as AntdAutoComplete, Empty } from 'antd'
import cls from 'classnames'
import { debounce } from 'radash'

import { useControllableValue, usePrefixCls } from '../../hooks'
import { LoadingIcon } from '../../widgets'
import { useAutoCompleteRequest } from './hooks'

import type { FC } from 'react'
import type { IAutoCompleteProps } from './types'

export const AutoComplete: FC<IAutoCompleteProps> = (props) => {
  const {
    options,
    // showSearch, // always true
    filterOption = true,
    notFoundContent,
    suffixIcon,
    // ==== 调整样式的相关属性 ====
    variant = 'outlined',
    size = 'middle',
    disabled = false,
    readOnly = false,
    // ======== custom ========
    requestDelay = 500,
    request,
    locale,
    defaultValue: _0,
    pickEvent: _1,
    omitEvent: _2,
    ...restProps
  } = props

  const calcPrefixCls = usePrefixCls('select-auto-complete', { prefixCls: 'fields' }, true)

  /** 远程数据源 */
  const [dataSource, setDataSource] = useState<any[]>([])
  /** 请求时序控制 */
  const fetchRef = useRef(0)
  /** 自定义 hook 处理重复的异步逻辑 */
  const { allowableEvents, requestStatus, onRequestHandler } = useAutoCompleteRequest(props)

  // =====================================================

  /**
   * @title 是否传递了 props.request 属性
   */
  const hasRequestProp = useMemo(() => {
    return !!request
  }, [request])

  /**
   * @title merged 数据源
   * @description 当 props.request 存在时优先使用远程数据源，否则使用 options 当作数据源
   */
  const mergedDataSource = useMemo(() => {
    return request ? dataSource : options
  }, [request, dataSource, options])

  /**
   * @title 通过修改 suffixIcon 实现 loading 属性
   * @description merged loading (优先级: 请求 > 外部 prop 属性)
   */
  const mergedSuffixIcon = useMemo(() => {
    const mergedLoading = !!requestStatus
    return mergedLoading ? <LoadingIcon /> : suffixIcon
  }, [requestStatus, suffixIcon])

  /**
   * @title merged filterOption
   * @description 当 props.request 存在时关闭本地搜索
   */
  const mergedFilterOption = useMemo(() => {
    return (request && allowableEvents.search) ? false : filterOption
  }, [filterOption, request, allowableEvents.search])

  // =====================================================

  // 组件的状态既可以自己管理，也可以被外部控制
  const [dropdownVisible, onDropdownVisibleChange] = useControllableValue<boolean>(props, {
    defaultValuePropName: 'defaultOpen',
    valuePropName: 'open',
    trigger: 'onDropdownVisibleChange',
  })

  // 组件的状态既可以自己管理，也可以被外部控制
  const [controllableValue, onChange] = useControllableValue<any>(props, {
    defaultValuePropName: 'defaultValue',
    valuePropName: 'value',
    trigger: 'onChange',
  })

  // ======================================================

  /**
   * @title 自定义下拉列表为空时显示的内容
   */
  const notFoundElement = useMemo(() => {
    if (notFoundContent) {
      return createElement(notFoundContent as any, { type: requestStatus })
    }

    // 触发 onSearch 时显示搜索中，而不是无数据，体验感更加友好
    if (requestStatus === 'search') {
      return (
        <Empty
          className="ant-empty-small"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={locale?.search || 'Search...'}
        />
      )
    }

    // 使用内置的空状态组件
    return undefined
  }, [notFoundContent, locale?.search, requestStatus])

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
      // 在存在搜索关键词时关闭弹窗，也会触发一次 onSearch，此时 inputValue 为空串，应该阻止这种情况
      if (inputValue === '') { return }

      fetchRef.current += 1 // 请求时序加一
      const fetchId = fetchRef.current
      setDataSource([])
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

  /**
   * @title 展开/关闭下拉菜单的回调
   * @kind 请求 <参数为下拉框将要变化的值；响应直接覆盖>
   */
  const onVisibleSearch = useCallback((open: boolean) => {
    // 响应下拉框变化
    onDropdownVisibleChange(open)

    if (!hasRequestProp) {
      return
    }

    // EVENTS: 该事件被禁止
    if (!allowableEvents.popup) { return }

    onRequestHandler('popup', { open })
      .then((content) => {
        content && setDataSource(content)
      })
  }, [hasRequestProp, allowableEvents.popup, onRequestHandler, onDropdownVisibleChange])

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
    <AntdAutoComplete
      {...restProps}
      className={cls(calcPrefixCls, {
        [`${calcPrefixCls}-readonly`]: readOnly,
        [`${calcPrefixCls}-disabled`]: disabled,
      })}
      options={mergedDataSource}
      filterOption={mergedFilterOption}
      notFoundContent={notFoundElement}
      suffixIcon={mergedSuffixIcon}
      // ==== 调整样式的相关属性 ====
      variant={variant}
      size={size}
      disabled={disabled || readOnly}
      // ==== value/onChange ====
      value={controllableValue}
      onChange={onChange}
      // ==== open/onDropdownVisibleChange + request.EVENTS.popup ====
      open={dropdownVisible}
      onDropdownVisibleChange={onVisibleSearch}
      // ======= request =======
      onSearch={onDebounceSearch}
    />
  )
}
