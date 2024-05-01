import type { CSSProperties, ReactNode } from 'react'
import type { GridApi, IRowNode, RowDragEndEvent } from 'ag-grid-community'
import type { SharedProps } from 'ag-grid-react'
import type { AddRecordPrefix } from '../../types'

/**
 * @title 在 SharedProps 基础上扩展的属性
 */
export interface ICommonGridTransferProps {
  rootClassName?: string
  className?: string
  style?: CSSProperties
  loading?: boolean
  /**
   * 手动在各个时机 emit target 数据源（或者直接使用 GridOptions.onRowDataUpdated 回调得到 target 数据源）
   */
  onChange?: (params: { api: GridApi, type: 'drag' | 'operation' }) => void
  /**
   * 左侧表格的浮层
   */
  leftLayer?: ReactNode
  /**
   * 左侧表格的浮层
   */
  rightLayer?: ReactNode
  /**
   * 跨区域拖拽结束回调
   * @param {RowDragEndEvent} event 包含 点击移动行 event.node、可能存在选中的多行拖拽 event.nodes、目标行 event.overNode、目标表格的 event.api 等信息
   * @param {GridApi} sourceApi 移动行所在的原始表格的 api
   */
  onZoneDragEnd?: (event: RowDragEndEvent, sourceApi: GridApi) => void
  leftOnZoneDragEnd?: (event: RowDragEndEvent, sourceApi: GridApi) => void
  rightOnZoneDragEnd?: (event: RowDragEndEvent, sourceApi: GridApi) => void
  /**
   * 移动原始表格所有勾选行到目标表格
   * @param {RowDragEndEvent} event 包含 可能存在选中的多行 event.nodes、目标表格的 event.api 等信息
   * @param {GridApi} sourceApi 移动行所在的原始表格的 api
   */
  onOperationEnd?: (event: { nodes: IRowNode[], api: GridApi }, sourceApi: GridApi) => void
  leftOnOperationEnd?: (event: { nodes: IRowNode[], api: GridApi }, sourceApi: GridApi) => void
  rightOnOperationEnd?: (event: { nodes: IRowNode[], api: GridApi }, sourceApi: GridApi) => void
}

export type IPrefixGridTransferProps =
  AddRecordPrefix<SharedProps, 'left'>
  & AddRecordPrefix<SharedProps, 'right'>
  & SharedProps

/**
 * @title 左右添加前缀，再加上扩展的属性
 */
export type IGridTransferProps = IPrefixGridTransferProps & ICommonGridTransferProps
