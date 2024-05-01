import { AgGridReact } from 'ag-grid-react'

import type { FC } from 'react'
import type { GridOptions } from 'ag-grid-community'

export const TransferItem: FC<GridOptions> = (props) => {
  return (
    <AgGridReact
      {...props}
    />
  )
}
