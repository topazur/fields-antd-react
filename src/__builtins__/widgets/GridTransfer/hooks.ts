import { useCallback, useMemo, useRef, useState } from 'react'
import { uid } from 'radash'

import type { SharedProps } from 'ag-grid-react'
import type { DragStoppedEvent, GetRowIdParams, GridApi, GridReadyEvent, IsRowSelectable, RowSelectedEvent, SelectionChangedEvent } from 'ag-grid-community'
import type { IPrefixGridTransferProps } from './types'

/**
 * @title 为了优化左右表格传递 props，支持前缀模式(优先级高)和原始模式。
 * @title 原始模式解析成 commonProps，前缀模式解析成 leftProps 或 rightProps，再各自与 commonProps 合并得到最终 props。
 * @param {IPrefixGridTransferProps} splitProps 包含前缀props和原始props
 * @returns { leftProps: SharedProps, rightProps: SharedProps } 可以直接传递给 AgGridReact 的 props。
 * @description 注意 commonProps 具有默认值，如不符合请覆盖
 */
export function useSplitProps(splitProps: IPrefixGridTransferProps) {
  // 分隔 props
  return useMemo(() => {
    const commonProps: SharedProps = {
      // 行选择
      rowSelection: 'multiple',
      suppressRowClickSelection: true,
      // 行拖动
      suppressRowDrag: false,
      rowDragManaged: false,
      rowDragEntireRow: false,
      rowDragMultiRow: true,
      suppressMoveWhenRowDragging: true,
    }
    const leftProps: SharedProps = {}
    const rightProps: SharedProps = {}

    for (const key in splitProps) {
      if (Object.prototype.hasOwnProperty.call(splitProps, key)) {
        const element = splitProps[key]
        if (key.startsWith('left')) {
          let originKey = key.replace('left', '')
          originKey = originKey.substring(0, 1).toLowerCase() + originKey.substring(1, originKey.length)
          leftProps[originKey] = element
        }
        else if (key.startsWith('right')) {
          let originKey = key.replace('right', '')
          originKey = originKey.substring(0, 1).toLowerCase() + originKey.substring(1, originKey.length)
          rightProps[originKey] = element
        }
        else {
          commonProps[key] = element
        }
      }
    }

    const fullLeftProps: SharedProps = { gridId: 'left', ...commonProps, ...leftProps }
    const fullRightProps: SharedProps = { gridId: 'right', ...commonProps, ...rightProps }
    return {
      leftProps: fullLeftProps,
      rightProps: fullRightProps,
    }
  }, [splitProps])
}

/**
 * @title 拦截 onGridReady 并做一层包装，目的是为了获取左右表格的 api 并保存起来。
 * @param {SharedProps} leftProps
 * @param {SharedProps} rightProps
 * @description 变量 isReady 是为了确保左右表格的 api 都完成保存
 */
export function useTransferReady(
  leftProps?: SharedProps,
  rightProps?: SharedProps,
) {
  const [isReady, setIsReady] = useState(0)

  const leftApiRef = useRef<GridApi | null>(null)
  const rightApiRef = useRef<GridApi | null>(null)

  const onLeftGridReady = useCallback((event: GridReadyEvent) => {
    leftApiRef.current = event.api
    setIsReady(prev => prev + 1)
    leftProps?.onGridReady?.(event)
  }, [leftProps?.onGridReady])

  const onRightGridReady = useCallback((event: GridReadyEvent) => {
    rightApiRef.current = event.api
    setIsReady(prev => prev + 1)
    rightProps?.onGridReady?.(event)
  }, [rightProps?.onGridReady])

  const refreshAll = useCallback(() => {
    leftApiRef.current?.refreshHeader()
    leftApiRef.current?.refreshCells()

    rightApiRef.current?.refreshHeader()
    rightApiRef.current?.refreshCells()
  }, [])

  return {
    isReady,
    leftApiRef,
    rightApiRef,
    onLeftGridReady,
    onRightGridReady,
    refreshAll,
  }
}

/**
 * @title 拦截 getRowId 并做一层包装，目的是为了针对左右表格的 id 添加 `left_` 或者 `right_` 前缀。
 * @param {SharedProps} leftProps
 * @param {SharedProps} rightProps
 */
export function useTransferGetRowId(
  leftProps?: SharedProps,
  rightProps?: SharedProps,
) {
  const getLeftRowId = useCallback((params: GetRowIdParams) => {
    const id = leftProps?.getRowId?.(params) || params.data.id || uid(10, '*')
    return `left_${id}`
  }, [leftProps?.getRowId])

  const getRightRowId = useCallback((params: GetRowIdParams) => {
    const id = rightProps?.getRowId?.(params) || params.data.id || uid(10, '*')
    return `right_${id}`
  }, [rightProps?.getRowId])

  return { getLeftRowId, getRightRowId }
}

/**
 * @title 拦截 onRowSelected、onSelectionChanged 并做一层包装
 * @description onRowSelected - 目的是为了存储第一次勾选的行 id 并传入 context，以提供给 ColDef 配置是否可以勾选的功能。
 * @description onSelectionChanged - 目的是为了根据当前选中行判断操作栏按钮是否可点击并刷新表头更新数字比例。
 * @param {SharedProps} leftProps
 * @param {SharedProps} rightProps
 */
export function useTransferSelectionChanged(
  leftProps?: SharedProps,
  rightProps?: SharedProps,
) {
  // =================== onSelectionChanged Start ===================
  const [leftOperationDisable, setLeftOperationDisable] = useState(true)
  const [rightOperationDisable, setRightOperationDisable] = useState(true)

  const onLeftSelectionChanged = useCallback((event: SelectionChangedEvent) => {
    leftProps?.onSelectionChanged?.(event)

    setLeftOperationDisable(event.api.getSelectedRows().length <= 0)
    event.api.refreshHeader()
  }, [leftProps?.onSelectionChanged])

  const onRightSelectionChanged = useCallback((event: SelectionChangedEvent) => {
    rightProps?.onSelectionChanged?.(event)

    setRightOperationDisable(event.api.getSelectedRows().length <= 0)
    event.api.refreshHeader()
  }, [rightProps?.onSelectionChanged])
  // =================== onSelectionChanged End ===================

  // ============================================================

  // =================== onRowSelected Start ===================
  const [leftSelectedFirstRow, setLeftSelectedFirstRow] = useState('{}')
  const [rightSelectedFirstRow, setRightSelectedFirstRow] = useState('{}')

  const onLeftRowSelected = useCallback((event: RowSelectedEvent) => {
    leftProps?.onRowSelected?.(event)

    const { api, node } = event
    const isSelected = node.isSelected()
    const selectedRows = api.getSelectedNodes()

    if (selectedRows.length === 1 && isSelected) {
      // 勾选第一项
      setLeftSelectedFirstRow(JSON.stringify({ id: selectedRows[0].id!, data: selectedRows[0].data! }))
    }
    else if (selectedRows.length === 0 && !isSelected) {
      // 全部取消勾选
      setLeftSelectedFirstRow('{}')
    }
  }, [leftProps?.onRowSelected])

  const onRightRowSelected = useCallback((event: RowSelectedEvent) => {
    rightProps?.onRowSelected?.(event)

    const { api, node } = event
    const isSelected = node.isSelected()
    const selectedRows = api.getSelectedNodes()

    if (selectedRows.length === 1 && isSelected) {
      // 勾选第一项
      setRightSelectedFirstRow(JSON.stringify({ id: selectedRows[0].id!, data: selectedRows[0].data! }))
    }
    else if (selectedRows.length === 0 && !isSelected) {
      // 全部取消勾选
      setRightSelectedFirstRow('{}')
    }
  }, [rightProps?.onRowSelected])
  // =================== onRowSelected End ===================

  // =================== onSelectionChanged Start ===================
  const leftIsRowSelectable: IsRowSelectable = useCallback((node) => {
    if (!leftProps?.isRowSelectable) { return true }

    // @ts-expect-error 一个参数
    return leftProps?.isRowSelectable?.(node, leftSelectedFirstRow)
  }, [leftProps?.isRowSelectable, leftSelectedFirstRow])

  const rightIsRowSelectable: IsRowSelectable = useCallback((node) => {
    if (!rightProps?.isRowSelectable) { return true }

    // @ts-expect-error 一个参数
    return rightProps?.isRowSelectable(node, rightSelectedFirstRow)
  }, [rightProps?.isRowSelectable, rightSelectedFirstRow])
  // =================== onSelectionChanged End ===================

  return {
    leftOperationDisable,
    rightOperationDisable,
    onLeftSelectionChanged,
    onRightSelectionChanged,
    leftIsRowSelectable,
    rightIsRowSelectable,
    onLeftRowSelected,
    onRightRowSelected,
  }
}

/**
 * @title 拦截 onRowSelected、onSelectionChanged 并做一层包装
 * @description onRowSelected - 目的是为了存储第一次勾选的行 id 并传入 context，以提供给 ColDef 配置是否可以勾选的功能。
 * @description onSelectionChanged - 目的是为了根据当前选中行判断操作栏按钮是否可点击并刷新表头更新数字比例。
 * @param {SharedProps} leftProps
 * @param {SharedProps} rightProps
 */
export function useTransferDragStopped(
  leftProps?: SharedProps,
  rightProps?: SharedProps,
  refreshAll?: () => void,
  onChange?: () => void,
) {
  const onLeftDragStopped = useCallback((event: DragStoppedEvent) => {
    leftProps?.onDragStopped?.(event)

    refreshAll?.()
    onChange?.()
  }, [leftProps?.onDragStopped])

  const onRightDragStopped = useCallback((event: DragStoppedEvent) => {
    rightProps?.onDragStopped?.(event)

    refreshAll?.()
    onChange?.()
  }, [rightProps?.onDragStopped])

  return {
    onLeftDragStopped,
    onRightDragStopped,
  }
}
