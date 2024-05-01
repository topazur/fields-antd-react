import { Fragment, createElement, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { TreeSelect as AntdSelectTree, Empty, Popover, Tag } from 'antd'
import cls from 'classnames'
import { debounce, isArray, isFunction } from 'radash'

import { useControllableValue, usePrefixCls } from '../../hooks'
import { findTreeNodePaths, parseCompletedTreeData, toArr } from '../../utils'
import { DownOutlinedIcon, ExpandOutlinedIcon, LoadingIcon, SearchOutlinedIcon, UpOutlinedIcon } from '../../widgets'
import { useSelectTreeRequest } from './hooks'

import type { FC } from 'react'
import type { ISelectTreeProps } from './types'

export const SelectTree: FC<ISelectTreeProps> = (props) => {
  const {
    loading,
    treeDataSimpleMode = true,
    treeData,
    treeNodeFilterProp = 'value',
    treeNodeLabelProp = 'label',
    filterTreeNode,
    showSearch,
    autoClearSearchValue = false,
    virtual = false,
    maxTagCount = 'responsive',
    // ======== render ========
    notFoundContent,
    dropdownRender,
    tagRender,
    maxTagPlaceholder,
    suffixIcon,
    loupeRender,
    // ==== 调整样式的相关属性 ====
    multiple,
    variant = 'outlined',
    size = 'middle',
    disabled = false,
    readOnly = false,
    // ==== 是否为对象格式 ====
    labelInValue,
    fieldNames,
    // ======== custom ========
    requestDelay = 500,
    request,
    locale,
    defaultValue: _0,
    pickEvent: _1,
    omitEvent: _2,
    ...restProps
  } = props

  const calcPrefixCls = usePrefixCls('select-tree', { prefixCls: 'fields' }, true)

  /** 远程数据源 */
  const [dataSource, setDataSource] = useState<any[]>([])
  /** 请求时序控制 */
  const fetchRef = useRef(0)
  /** 自定义 hook 处理重复的异步逻辑 */
  const { allowableEvents, requestStatus, setRequestStatus, onRequestHandler } = useSelectTreeRequest(props)

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
    if (!treeDataSimpleMode) {
      return request ? dataSource : treeData
    }

    const { id, pId, rootPId } = Object.assign({ id: 'id', pId: 'pId', rootPId: null }, treeDataSimpleMode) as any
    return parseCompletedTreeData(request ? dataSource : treeData, rootPId, { primaryKey: id, parentKey: pId })
  }, [request, treeDataSimpleMode, dataSource, treeData])

  /**
   * @title merged loading (优先级: 请求 > 外部 prop 属性)
   */
  const mergedLoading = useMemo(() => {
    return !!requestStatus || loading
  }, [requestStatus, loading])

  /**
   *  merged showSearch (优先级: 远程搜索 > props.showSearch)
   */
  const mergedShowSearch = useMemo(() => {
    return (allowableEvents.search && request) ? true : showSearch
  }, [showSearch, request, allowableEvents.search])

  /**
   * @title merged filterTreeNode
   * @description 当 props.request 存在时关闭本地搜索
   */
  const mergedFilterTreeNode = useMemo(() => {
    // treeNodeFilterProp, treeNodeLabelProp
    return (allowableEvents.search && request) ? false : filterTreeNode
  }, [filterTreeNode, request, allowableEvents.search])

  // =====================================================

  // 组件的状态既可以自己管理，也可以被外部控制
  const [dropdownVisible, onDropdownVisibleChange] = useControllableValue<boolean>(props, {
    defaultValuePropName: 'defaultOpen',
    valuePropName: 'open',
    trigger: 'onDropdownVisibleChange',
  })

  // 组件的状态既可以自己管理，也可以被外部控制
  const [loupeVisible, onLoupeVisibleChange] = useControllableValue<boolean>(props, {
    defaultValuePropName: 'defaultLoupeOpen',
    valuePropName: 'loupeOpen',
    trigger: 'onLoupeVisibleChange',
  })

  // 组件的状态既可以自己管理，也可以被外部控制
  const [controllableValue, onChange] = useControllableValue<any>(props, {
    defaultValuePropName: 'defaultValue',
    valuePropName: 'value',
    trigger: 'onChange',
  })

  /**
   * @title 处理 AntdSelect 数据流转格式, 如果是 labelInValue 模式，则需要填充 value 和 label 属性
   * @description 在 onChangeHandler 中已经处理，此处再次处理是为了外部传入的 props.defaultValue 或 props.value 的格式
   */
  const calcValue = useMemo(() => {
    if (!controllableValue) { return controllableValue }
    if (!labelInValue) { return controllableValue }

    const valueProp = fieldNames?.value ?? 'value'
    const labelProp = fieldNames?.label ?? 'label'
    const aValue = toArr(controllableValue).map((item) => {
      const value = item[valueProp] ?? item.value
      const label = item[labelProp] ?? item.label ?? value
      return { ...item, value, label }
    })
    return isArray(controllableValue) ? aValue : aValue[0]
  }, [labelInValue, fieldNames?.value, fieldNames?.label, controllableValue])

  /**
   * @title 处理 AntdSelect 数据流转格式, 如果是 labelInValue 模式，则需要填充 value 和 label 属性
   * @notice ❌ Warning: `triggerNode` is deprecated. Please consider decoupling data with node.
   * @notice ✅ 没办法从 triggerNode 获取额外的属性，索性直接去数据源获取
   */
  const onChangeHandler = useCallback((valueParam: any, _labelList: any, _extra: any) => {
    if (!valueParam) {
      onChange(valueParam)
      return
    }

    if (!labelInValue) {
      onChange(valueParam)
      return
    }

    const valueProp = fieldNames?.value ?? 'value'
    const labelProp = fieldNames?.label ?? 'label'
    const aValue = toArr(valueParam).map((item) => {
      const value = item.value
      const label = item.label ?? value

      // 直接从数据源获取额外的属性
      let option: any = null
      const aOption: any[] = (request ? dataSource : treeData) ?? []
      if (treeDataSimpleMode) {
        // 数据源: 拍平的数据源
        option = aOption.find(o => o?.[valueProp] === value)
      }
      else {
        // 数据源: 树形结构的数据源
        const nodePaths = findTreeNodePaths(aOption, value, { primaryKey: valueProp })
        const { children: _, ...restOption } = nodePaths[nodePaths.length - 1] || {}
        option = restOption
      }
      return { ...option, value, [valueProp]: value, label, [labelProp]: label }
    })

    onChange(isArray(valueParam) ? aValue : aValue[0])
  }, [labelInValue, fieldNames?.value, fieldNames?.label, onChange, treeDataSimpleMode, request, dataSource, treeData])

  /**
   * @title 重写 tag 的 onClose 事件，通过索引删除选项
   */
  const onRemoveHandler = useCallback((item: any) => {
    if (!isArray(controllableValue)) { return }

    const valueProp = fieldNames?.value ?? 'value'
    const removeItemValue = item.value
    const removeIndex = controllableValue.findIndex((item) => {
      const itemValue = item?.[valueProp] ?? item
      return itemValue === removeItemValue
    })
    const newValues = controllableValue.filter((_item, idx) => idx !== removeIndex)
    onChange(newValues)
  }, [fieldNames?.value, controllableValue, onChange])

  // ======================================================

  /**
   * @title 自定义下拉列表为空时显示的内容
   */
  const notFoundElement = useMemo(() => {
    if (notFoundContent) {
      return createElement(notFoundContent as any, { type: requestStatus })
    }

    // NOTICE: 触发 onSearch 时显示搜索中，而不是无数据，体验感更加友好 (当 requestStatus 为 'beforeSearch' 时，可提前显示加载状态，而不是无法关闭完全的本地搜索)
    if (requestStatus === 'beforeSearch' || requestStatus === 'search') {
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

  /**
   * @title 自定义隐藏 tag 时显示的内容
   * @description 如果传递了 tagRender，折叠标签 maxTagPlaceholder 的返回值会传递给 tagRender 包装 (isMaxTag=true)
   */
  const maxTagPlaceholderElement = useCallback((omittedValues: any[]) => {
    if (omittedValues.length <= 0) { return null }

    const closable = !(disabled || readOnly)

    // 折叠区域显示的 tag 列表
    const tagList = omittedValues.map((item) => {
      const onClose = (event?: React.MouseEvent) => {
        event && event.preventDefault() // 阻止 tag 的 close 事件，放置标签被直接删除，而不是修改 value
        onRemoveHandler(item)
      }
      if (tagRender) {
        return tagRender({
          closable,
          disabled: undefined as any, // NOTICE: Antd内部也是传递的 undefined，此处仅仅是为了保持统一
          isMaxTag: false, // 不是折叠标签，而是具有实际意义的标签
          value: item.value,
          label: item.label,
          onClose,
        })
      }
      return (
        <Tag
          className={`${calcPrefixCls}-dropdown-content-tag`}
          style={{ userSelect: 'none' }}
          key={item.value}
          bordered={false}
          closable={closable}
          onClose={onClose}
        >
          {item.label}
        </Tag>
      )
    })

    if (maxTagPlaceholder) {
      return isFunction(maxTagPlaceholder) ? maxTagPlaceholder(omittedValues) : maxTagPlaceholder
    }
    return (
      <Popover
        overlayClassName={`${calcPrefixCls}-dropdown`}
        // padding=0 的目的是为了使 content.div 撑满，阻止 onMouseDown 的冒泡
        overlayInnerStyle={{ padding: 0 }}
        content={(
          <div
            data-variant={variant}
            data-size={size}
            data-disabled={disabled}
            data-readonly={readOnly}
            className={`${calcPrefixCls}-dropdown-content`}
            onMouseDown={event => event.stopPropagation()}
          >
            {tagList}
          </div>
        )}
      >
        <span onMouseDown={event => event.stopPropagation()}>
          {`+ ${omittedValues.length}`}
        </span>
      </Popover>
    )
  }, [variant, size, disabled, readOnly, tagRender, maxTagPlaceholder, calcPrefixCls, onRemoveHandler])

  const suffixIconElement = useMemo(() => {
    const hasLoupeRender = !!loupeRender
    const onLoupeVisibleOpen = onLoupeVisibleChange.bind(null, true)
    if (suffixIcon) {
      return suffixIcon({
        loading: mergedLoading,
        dropdownVisible,
        showSearch,
        hasLoupeRender,
        onLoupeVisibleOpen,
      })
    }

    // loading 阶段
    if (mergedLoading) {
      return <LoadingIcon />
    }

    // 下拉框打开阶段
    if (dropdownVisible) {
      return mergedShowSearch ? <SearchOutlinedIcon /> : <UpOutlinedIcon />
    }

    // 下拉框收起时（默认显示下箭头，如果存在放大镜模式，则显示可点击的放大镜图标）
    return hasLoupeRender
      ? (
        <ExpandOutlinedIcon
          className={`${calcPrefixCls}-loupe-icon`}
          onClick={onLoupeVisibleOpen}
        />
        )
      : (
        <DownOutlinedIcon />
        )
  }, [suffixIcon, mergedLoading, dropdownVisible, mergedShowSearch, loupeRender, suffixIcon])

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
   * @title 监听滚动时间，通过判断滚动距离判断是否触底，滚动触底加载更多的远程搜索
   * @kind 请求 <无参数；响应需要合并>
   */
  const onLoadDataSearch = useCallback(async (dataNode: any) => {
    if (!hasRequestProp) {
      return
    }

    // EVENTS: 该事件被禁止
    if (!allowableEvents.load) { return }

    await onRequestHandler('load', dataNode)
      .then((content) => {
        content && setDataSource(prevState => prevState.concat(content))
      })
  }, [hasRequestProp, allowableEvents.load, onRequestHandler])

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
    <Fragment>
      <AntdSelectTree
        {...restProps}
        className={cls(calcPrefixCls, { [`${calcPrefixCls}-readonly`]: readOnly, [`${calcPrefixCls}-disabled`]: disabled })}
        loading={mergedLoading}
        treeDataSimpleMode={false}
        treeData={mergedDataSource}
        treeNodeFilterProp={treeNodeFilterProp}
        treeNodeLabelProp={treeNodeLabelProp}
        filterTreeNode={mergedFilterTreeNode}
        /** Warning: `onSearch` should work with `showSearch` instead of use alone. */
        showSearch={mergedShowSearch}
        autoClearSearchValue={autoClearSearchValue}
        virtual={virtual}
        maxTagCount={maxTagCount}
        // ======== render ========
        notFoundContent={notFoundElement}
        dropdownRender={dropdownRender}
        tagRender={tagRender}
        maxTagPlaceholder={maxTagPlaceholderElement}
        suffixIcon={suffixIconElement}
        // ==== 调整样式的相关属性 ====
        multiple={multiple}
        variant={variant}
        size={size}
        disabled={disabled || readOnly}
        // ===== 是否为对象格式 =====
        labelInValue={labelInValue}
        fieldNames={fieldNames}
        // ==== value/onChange ====
        value={calcValue}
        onChange={onChangeHandler}
        // ==== open/onDropdownVisibleChange + request.EVENTS.popup ====
        open={dropdownVisible}
        onDropdownVisibleChange={onVisibleSearch}
        // ======= request =======
        onSearch={(value) => {
          if (onDebounceSearch) {
            if (value) {
              setRequestStatus('beforeSearch')
              setDataSource([])
            }
            onDebounceSearch(value)
          }
        }}
        loadData={onLoadDataSearch}
      />

      {/* 放大镜 dom 渲染 */}
      {loupeRender && loupeVisible && createElement(loupeRender, {
        // 勾选
        isMultiple: !!multiple,
        labelInValue,
        valueProp: fieldNames?.value ?? 'value',
        labelProp: fieldNames?.label ?? 'label',
        value: controllableValue,
        onChange,
        // 显隐
        onCancel: onLoupeVisibleChange.bind(null, false),
        // 请求
        onSearch: onRequestHandler.bind(null, 'loupe'),
      })}
    </Fragment>
  )
}
