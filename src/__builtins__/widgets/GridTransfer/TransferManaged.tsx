import { useCallback } from 'react'

import { GridTransfer } from './Transfer'

import type { FC } from 'react'
import type { GridApi, RowDragEndEvent } from 'ag-grid-community'
import type { IGridTransferProps } from './types'

export const GridTransferManaged: FC<IGridTransferProps> = (props) => {
  /**
   * @title 跨表格拖拽: 处理 source 表格删除行逻辑即可，target 表格的添加行操作已被托管
   * @kind 拖拽回调，可被覆盖
   */
  const onZoneDragEnd = useCallback((event: RowDragEndEvent, sourceApi: GridApi) => {
    const { nodes: movingNodes } = event

    const movingDataSource = movingNodes.map(n => n.data)
    sourceApi.applyTransaction({ remove: movingDataSource })

    sourceApi.clearFocusedCell()
  }, [])

  /**
   * @title 操作栏: 处理 source 表格删除行逻辑即可，target 表格的添加行操作已被托管
   * @kind 拖拽回调，可被覆盖
   */
  const onOperationEnd = useCallback((event: any, sourceApi: GridApi) => {
    const { api, nodes: movingNodes } = event

    const movingDataSource = movingNodes.map(n => n.data)
    sourceApi.applyTransaction({ remove: movingDataSource })
    api.applyTransaction({ add: movingDataSource, addIndex: -1 })

    api.clearFocusedCell()
  }, [])

  return (
    <GridTransfer
      onZoneDragEnd={onZoneDragEnd}
      onOperationEnd={onOperationEnd}
      {...props}
      rowDragManaged={true}
    />
  )
}
