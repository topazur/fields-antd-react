/* eslint-disable unused-imports/no-unused-vars */
import { useCallback, useRef, useState } from 'react'

import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-quartz.css'

import { usePrefixCls } from '../../../hooks'
import { GridTransferManual } from '..'

import type { ColDef, IRowNode } from 'ag-grid-community'

const rowDataList = Array(20).fill(0).map((item, idx) => {
  const num = `${idx + 1}`
  return {
    id: num,
    user: `U_${num}`,
    isOnline: idx > 6 ? 'true' : 'false',
  }
})

function leftLayer() {
  return (
    <div>
      <div
        className="layer1"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          backgroundColor: '#ccc',
          width: '60%',
          padding: '20px 10px',
          borderRadius: '4px',
          zIndex: 3,
          display: 'none',
        }}
      >
        候选区域禁止行上下拖动
      </div>
      <div
        className="layer2"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          backgroundColor: '#ccc',
          width: '60%',
          padding: '20px 10px',
          borderRadius: '4px',
          zIndex: 3,
          display: 'none',
        }}
      >
        从目标区域移动到候选区域默认尾部插入
      </div>
    </div>
  )
}

const App: React.FC = (props) => {
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    {
      minWidth: 50,
      maxWidth: 50,
      rowDrag: true,
    },
    {
      minWidth: 80,
      maxWidth: 80,
      checkboxSelection: true,
      headerCheckboxSelection: false,
      showDisabledCheckboxes: true,
      headerName: '序号',
      valueFormatter: 'node.rowIndex + 1',
      headerValueGetter: (params) => {
        const { api } = params
        const selectCount = api.getSelectedRows().length
        const rowCount = api.getDisplayedRowCount()
        return selectCount
          ? `${selectCount}/${rowCount} 项`
          : `${rowCount} 项`
      },
    },
    { field: 'user', headerName: '用户', width: 80 },
    { field: 'isOnline', headerName: '在线', width: 80 },
  ])
  const [rowData, setRowData] = useState<any[]>(rowDataList)
  const [rowData2, setRowData2] = useState<any[]>([])

  const wrapperGuiRef = useRef<HTMLDivElement | null>(null)
  const calcPrefixCls = usePrefixCls('grid-transfer', { prefixCls: 'fields' }, true)

  /**
   * @title 修改浮层 layer 的显隐
   */
  const setLayerDisplay = useCallback((direction: 'left' | 'right', className: string, display: 'none' | 'block') => {
    const layer: any = wrapperGuiRef.current!.querySelector(`.${calcPrefixCls}-item[data-direction="${direction}"] .${className}`)
    if (layer) {
      layer.style.display = display
    }
  }, [])

  /**
   * @title 自定义是否允许拖拽的规则
   */
  const moveable = useCallback((node: IRowNode, overNode: IRowNode | undefined): boolean => {
    if (!overNode) { return true }

    if (node.data.isOnline !== overNode.data.isOnline) {
      return false
    }
    return true
  }, [])

  return (
    <div {...props} ref={wrapperGuiRef}>
      <GridTransferManual
        style={{ height: '500px' }}
        rootClassName="ag-theme-quartz"
        loading={false}
        getRowId={params => params.data.id}
        columnDefs={columnDefs}
        leftRowData={rowData}
        rightRowData={rowData2}
        leftLayer={leftLayer()}
        // 点击行开始拖拽时 - 显示 layer
        onDragStarted={(event) => {
          const gridId = event.api.getGridId()

          if (gridId === 'left') {
            setLayerDisplay('left', 'layer1', 'block')
          }
          else if (gridId === 'right') {
            setLayerDisplay('right', 'layer2', 'block')
          }
        }}
        // 点击行结束拖拽时 - 隐藏 layer
        onDragStopped={(event) => {
          const gridId = event.api.getGridId()
          if (gridId === 'left') {
            setLayerDisplay('left', 'layer1', 'none')
          }
          else if (gridId === 'right') {
            setLayerDisplay('right', 'layer2', 'none')
          }
        }}
        moveable={moveable}
         // @ts-expect-error params
        isRowSelectable={(node, selectedFirstRow) => {
          const isOnline = JSON.parse(selectedFirstRow).data?.isOnline
          if (!isOnline) { return true }
          return node.data.isOnline === isOnline
        }}
        onChange={(params) => {
          const targetRows: IRowNode[] = []
          params.api.forEachNode(rowNode => targetRows.push(rowNode))
          console.log('[vscode-log] onChange: ', params.type, targetRows)
        }}
        rightOnRowDataUpdated={(params) => {
          const targetRows: IRowNode[] = []
          params.api.forEachNode(rowNode => targetRows.push(rowNode))
          console.log('[vscode-log] onRowDataUpdated: ', params.type, targetRows)
        }}
      />
    </div>
  )
}

export default App
