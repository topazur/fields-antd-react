/* eslint-disable unused-imports/no-unused-vars */
import { useState } from 'react'

import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-quartz.css'

import { GridTransferManaged } from '..'

import type { ColDef, IRowNode } from 'ag-grid-community'

const rowDataList = Array(20).fill(0).map((item, idx) => {
  const num = `${idx + 1}`
  return {
    id: num,
    user: `U_${num}`,
    isOnline: idx > 6 ? 'true' : 'false',
  }
})

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

  return (
    <div {...props}>
      <GridTransferManaged
        style={{ height: '500px' }}
        rootClassName="ag-theme-quartz"
        loading={false}
        getRowId={params => params.data.id}
        columnDefs={columnDefs}
        leftRowData={rowData}
        rightRowData={rowData2}
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
