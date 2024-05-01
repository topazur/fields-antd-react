/* eslint-disable unused-imports/no-unused-vars */
import { Divider } from 'antd'
import { random } from 'radash'

import { Mentions } from '../'

import type React from 'react'
import type { IMentionsResponse } from '../'

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

export function generatePromise(args: IMentionsResponse): Promise<IMentionsResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(args)
    }, 500)
  })
}

const App: React.FC = (props) => {
  return (
    <div {...props}>

      <span style={{ fontSize: '14px', color: '#aaa' }}>仍可以直接使用 options，但是优先级低于远程数据模式</span>
      <span style={{ fontSize: '14px', color: '#aaa' }}>仍可以直接使用 filterOption，但是优先级低于远程数据模式</span>

      <Divider orientation="left">组件库自带搜索功能: options + filterOption</Divider>
      <Mentions
        options={generateOptions(1)}
        filterOption={true}
      />

      <Divider orientation="left">组件扩展: mount 事件</Divider>
      <Mentions
        pickEvent="mount"
        request={(type, prevParams, currentParams) => generatePromise({ content: generateOptions(1) })}
      />

      <Divider orientation="left">组件扩展: search 事件</Divider>
      <Mentions
        pickEvent="search"
        request={(type, prevParams, currentParams) => {
          return generatePromise({ content: generateOptions(1, 10, currentParams.value) })
        }}
      />
    </div>
  )
}

export default App
