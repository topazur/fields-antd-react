import { useCallback, useRef } from 'react'

import { usePrefixCls } from '../../hooks'
import { GridTransfer } from './Transfer'

import type { FC } from 'react'
import type { DragStoppedEvent, GridApi, IRowNode, RowDragEndEvent, RowDragEvent } from 'ag-grid-community'
import type { IGridTransferProps } from './types'

export const GridTransferManual: FC<IGridTransferProps & { moveable?: (node: IRowNode, overNode: IRowNode | undefined) => boolean }>
  = (props) => {
    const { moveable, onDragStopped, ...restProps } = props

    // 外层容器元素
    const wrapperGuiRef = useRef<HTMLDivElement | null>(null)
    // 拖拽起点的鼠标位置信息
    const dragStartEventRef = useRef<MouseEvent | null>(null)

    const calcPrefixCls = usePrefixCls('grid-transfer', { prefixCls: 'fields' }, true)

    /**
     * @title 遍历行，得到行元素后修改行的类名实现修改样式
     * @kind 辅助函数
     */
    const rowCtrlForEachGui = useCallback((
      api: GridApi,
      callback?: (gui: Element | null, node: IRowNode, index: number) => void,
    ) => {
      api.forEachNode((rowNode, index) => {
        const gui = wrapperGuiRef.current!.querySelector(`.ag-row[row-id=${rowNode.id}]`)
        callback?.(gui, rowNode, index)
      })
    }, [])

    /**
     * @title 计算插入时的索引
     * @description 根据是否存在目标行分情况判断
     * @kind 辅助函数
     */
    const calcAddIndex = useCallback((event: any, callback?: (node: IRowNode) => boolean) => {
      const { api, overNode, overIndex, y } = event

      let idx = -1 // 默认尾插入

      // 当目标行存在时，根据目标行中轴线为界，计算移动到目标行的前一个还是后一个索引
      if (overNode) {
        const rowTop = overNode.rowTop || 0
        const rowHeight = overNode.rowHeight || 0
        idx = y >= rowTop + rowHeight / 2 ? overIndex + 1 : overIndex
        return idx
      }

      if (!callback) { return idx }

      // 目标行不存在时，比如拖动到空白位置，根据 callback 结果拖动到该条件分组下的最后一个索引
      const targetRows: IRowNode[] = []
      api.forEachNode(rowNode => targetRows.push(rowNode))

      // 倒叙查找保证是同组的最后一项
      for (let i = targetRows.length - 1; i >= 0; i--) {
        const node = targetRows[i]
        if (callback(node)) {
          if (node.rowIndex) {
            idx = node.rowIndex + 1
          }
          break
        }
      }

      return idx
    }, [])

    // ========================== 重置拖拽起点的鼠标位置信息 ==========================
    /**
     * @title 离开表格区域清除样式
     * @kind 拖拽回调，包装一层
     */
    const onDragStoppedFn = useCallback((event: DragStoppedEvent) => {
      onDragStopped?.(event)

      dragStartEventRef.current = null
    }, [onDragStopped])

    // ========================== 自定义拖拽逻辑 ==========================

    /**
     * @title 离开表格区域清除样式
     * @kind 拖拽回调，可被覆盖
     */
    const onRowDragLeave = useCallback((event: RowDragEvent) => {
      const { api } = event
      rowCtrlForEachGui(api, (gui) => {
        gui?.classList.remove(
          'ag-row-highlight-above',
          'ag-row-highlight-below',
          'ag-row-highlight-success',
          'ag-row-highlight-error',
        )
      })
    }, [rowCtrlForEachGui])

    /**
     * @title 移动时添加样式，AgGrid 是通过 setHighlighted 实现，本质上也是修改行元素的样式
     * @url https://github.com/ag-grid/ag-grid/blob/8a28b54bda251540116b7deceab2c1e9df60fd46/community-modules/core/src/gridBodyComp/rowDragFeature.ts#L184
     *    rowDragFeature.ts => onEnterOrDragging (move)
     *    rowDragFeature.ts => doManagedDrag
     *    clientSideRowModel.ts => highlightRowAtPixel
     *    rowNode.ts => setHighlighted - EVENT_HIGHLIGHT_CHANGED
     *    rowCtrl.ts => EVENT_HIGHLIGHT_CHANGED -> onRowNodeHighlightChanged -> allRowGuis.forEach -> gui.setHighlighted(null | 0 | 1)
     * @kind 拖拽回调，可被覆盖
     */
    const rightOnRowDragMove = useCallback((event: RowDragEvent) => {
      if (!dragStartEventRef.current) {
      // 存储起点 event 信息
        dragStartEventRef.current = event.event
      }

      const { api, node: movingNode, overNode, y } = event
      rowCtrlForEachGui(api, (gui, node) => {
        gui?.classList.remove(
          'ag-row-highlight-above',
          'ag-row-highlight-below',
          'ag-row-highlight-success',
          'ag-row-highlight-error',
        )

        if (node !== overNode) { return }

        let statusClasses = ''
        if (moveable) {
          const flag = moveable(movingNode, overNode)
          statusClasses = flag ? 'ag-row-highlight-success' : 'ag-row-highlight-error'
        }

        const rowTop = node.rowTop || 0
        const rowHeight = node.rowHeight || 0
        if (y < rowTop + rowHeight && y >= rowTop + rowHeight / 2) {
          gui?.classList.add(statusClasses, 'ag-row-highlight-below')
        }
        else if (y < rowTop + rowHeight / 2) {
          gui?.classList.add(statusClasses, 'ag-row-highlight-above')
        }
      })
    }, [rowCtrlForEachGui, moveable])

    /**
     * @title 离开表格区域清除样式
     * @kind 拖拽回调，可被覆盖
     */
    const rightOnRowDragEnd = useCallback((event: RowDragEvent) => {
      const { api, node: movingNode, nodes: movingNodes, overNode } = event

      // 1. 拖动时鼠标已离开网格不会触发该事件，无需关注

      // 2. 跨 zone 拖动此处响应，而是交给 onZoneDragStop 处理。
      if (movingNode.id?.startsWith('left_')) { return }

      // 清除样式(优先执行，避免被阻止)
      rowCtrlForEachGui(api, (gui) => {
        gui?.classList.remove(
          'ag-row-highlight-above',
          'ag-row-highlight-below',
          'ag-row-highlight-success',
          'ag-row-highlight-error',
        )
      })
      api.clearFocusedCell()

      // 3. 拖动行和放置行相同时阻止
      const rowNeedsToMove = movingNode !== overNode
      if (!rowNeedsToMove) { return }
      // 4. 自定义规则
      const flag = moveable?.(movingNode, overNode)
      if (!flag) {
        return
      }

      // 事务删除和新增 (TODO: 暂时同时执行没有发现问题，满足先删除再新增)
      const movingDataSource = movingNodes.map(n => n.data)
      let addIndex = calcAddIndex(event, moveable ? node => moveable(movingNode, node) : undefined)
      // NOTICE: 如果是往下移动由于 movingNode 自身先被移走，所以整体索引应该减一
      if (event.event.clientY && dragStartEventRef.current?.clientY && event.event.clientY > dragStartEventRef.current.clientY) {
        addIndex = addIndex - 1
      }
      api.applyTransaction({
        remove: movingDataSource,
        add: movingDataSource,
        addIndex,
      })
    }, [rowCtrlForEachGui, calcAddIndex, moveable])

    /**
     * @title 从左侧表格拖拽到右侧表格，需判断右侧 overNode 的位置是否允许拖拽
     * @kind 拖拽回调，可被覆盖
     */
    const leftOnZoneDragEnd = useCallback((event: RowDragEndEvent, sourceApi: GridApi) => {
      const { api, node: movingNode, nodes: movingNodes, overNode } = event

      // 清除样式(优先执行，避免被阻止)
      rowCtrlForEachGui(api, (gui) => {
        gui?.classList.remove(
          'ag-row-highlight-above',
          'ag-row-highlight-below',
          'ag-row-highlight-success',
          'ag-row-highlight-error',
        )
      })
      sourceApi.clearFocusedCell()

      const flag = moveable?.(movingNode, overNode)
      if (!flag) {
        return
      }

      const movingDataSource = movingNodes.map(n => n.data)
      sourceApi.applyTransaction({ remove: movingDataSource })
      const addIndex = calcAddIndex(event, moveable ? node => moveable(movingNode, node) : undefined)
      api.applyTransaction({ add: movingDataSource, addIndex })
    }, [rowCtrlForEachGui, calcAddIndex, moveable])

    /**
     * @title 从右侧表格拖拽到左侧表格，直接加入到最后一项 (左侧暂时无法考虑顺序，除非每次都对原始数据和现有数据比对确定位置)
     * @kind 拖拽回调，可被覆盖
     */
    const rightOnZoneDragEnd = useCallback((event: RowDragEndEvent, sourceApi: GridApi) => {
      const { api, nodes: movingNodes } = event

      sourceApi.clearFocusedCell()

      const movingDataSource = movingNodes.map(n => n.data)
      sourceApi.applyTransaction({ remove: movingDataSource })

      api.applyTransaction({ add: movingDataSource, addIndex: -1 })
    }, [])

    /**
     * @title 操作栏：左侧表格的选中行一键移动到右侧表格 (由于 isRowSelectable 的限制，保证左侧选中行都是统一类型的)
     * @kind 拖拽回调，可被覆盖
     */
    const leftOnOperationEnd = useCallback((event: any, sourceApi: GridApi) => {
      const { api, nodes: movingNodes } = event

      const movingDataSource = movingNodes.map(n => n.data)
      sourceApi.applyTransaction({ remove: movingDataSource })
      const addIndex = calcAddIndex(event, moveable ? node => moveable(movingNodes[0], node) : undefined)
      api.applyTransaction({ add: movingDataSource, addIndex })

      api.clearFocusedCell()
    }, [calcAddIndex, calcAddIndex, moveable])

    /**
     * @title 操作栏：右侧表格的选中行一键移动到左侧表格，直接加入到最后一项 (左侧暂时无法考虑顺序，除非每次都对原始数据和现有数据比对确定位置)
     * @kind 拖拽回调，可被覆盖
     */
    const rightOnOperationEnd = useCallback((event: any, sourceApi: GridApi) => {
      const { api, nodes: movingNodes } = event

      const movingDataSource = movingNodes.map(n => n.data)
      sourceApi.applyTransaction({ remove: movingDataSource })
      api.applyTransaction({ add: movingDataSource, addIndex: -1 })

      api.clearFocusedCell()
    }, [])

    return (
      <div className={`${calcPrefixCls}-manual`} ref={wrapperGuiRef}>
        <GridTransfer
          onRowDragLeave={onRowDragLeave}
          rightOnRowDragMove={rightOnRowDragMove}
          rightOnRowDragEnd={rightOnRowDragEnd}
          leftOnZoneDragEnd={leftOnZoneDragEnd}
          rightOnZoneDragEnd={rightOnZoneDragEnd}
          leftOnOperationEnd={leftOnOperationEnd}
          rightOnOperationEnd={rightOnOperationEnd}
          {...restProps}
          rowDragManaged={false}
          onDragStopped={onDragStoppedFn}
        />
      </div>
    )
  }
