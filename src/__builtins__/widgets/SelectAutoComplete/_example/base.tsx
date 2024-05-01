/* eslint-disable unused-imports/no-unused-vars */
import { Divider } from 'antd'

import { AutoComplete } from '../'

import type React from 'react'
import type { IAutoCompleteResponse } from '../'

export function generateOptions(pageNo: number, pageSize: number = 10, random?: any) {
  return Array(pageSize).fill(0).map((_item, idx) => {
    const calcIdx = (pageNo - 1) * pageSize + (idx + 1)
    return {
      value: `value${random ? `_${random}` : ''}_${calcIdx}`,
      label: `label${random ? `_${random}` : ''}_${calcIdx}`,
      extraProp: `label${random ? `_${random}` : ''}_${calcIdx}`,
    }
  })
}

export function generatePromise(args: IAutoCompleteResponse): Promise<IAutoCompleteResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(args)
    }, 500)
  })
}

const App: React.FC = (props) => {
  return (
    <div {...props}>

      <Divider orientation="left">readOnly</Divider>
      <AutoComplete variant="outlined" readOnly defaultValue="defaultValue" />
      <AutoComplete variant="filled" readOnly defaultValue="defaultValue" />
      <AutoComplete variant="borderless" readOnly defaultValue="defaultValue" />

      <hr />

      <span style={{ fontSize: '14px', color: '#aaa' }}>仍可以直接使用 options，但是优先级低于远程数据模式</span>
      <span style={{ fontSize: '14px', color: '#aaa' }}>仍可以直接使用 filterOption，但是优先级低于远程数据模式</span>

      <Divider orientation="left">组件库自带搜索功能: options + filterOption</Divider>
      <AutoComplete
        options={generateOptions(1)}
        showSearch={true}
        filterOption={true}
      />

      <Divider orientation="left">组件扩展: mount 事件</Divider>
      <AutoComplete
        pickEvent="mount"
        request={(type, prevParams, currentParams) => generatePromise({ content: generateOptions(1) })}
      />

      <Divider orientation="left">组件扩展: popup 事件</Divider>
      <AutoComplete
        pickEvent="popup"
        request={(type, prevParams, currentParams) => generatePromise({ content: currentParams?.open ? generateOptions(1) : undefined })}
      />

      <Divider orientation="left">组件扩展: search 事件</Divider>
      <AutoComplete
        pickEvent="search"
        request={(type, prevParams, currentParams) => {
          return generatePromise({ content: generateOptions(1, 10, currentParams.value) })
        }}
      />
    </div>
  )
}

export default App
