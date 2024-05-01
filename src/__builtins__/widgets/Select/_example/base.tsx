/* eslint-disable unused-imports/no-unused-vars */
import { Divider } from 'antd'

import { Select } from '../'

import type React from 'react'
import type { ISelectResponse } from '../'

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

export function generatePromise(args: ISelectResponse): Promise<ISelectResponse> {
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
      <span style={{ fontSize: '14px', color: '#aaa' }}>`mode=multiple|tags` 或者 `开启远程搜索` 时，默认开启 showSearch 属性</span>

      <Divider orientation="left">组件库自带搜索功能: options + filterOption</Divider>
      <Select
        options={generateOptions(1)}
        showSearch={true}
        filterOption={true}
      />

      <Divider orientation="left">组件扩展: mount 事件</Divider>
      <Select
        pickEvent="mount"
        request={(type, prevParams, currentParams) => generatePromise({ content: generateOptions(1) })}
      />

      <Divider orientation="left">组件扩展: popup 事件</Divider>
      <Select
        pickEvent="popup"
        request={(type, prevParams, currentParams) => generatePromise({ content: currentParams?.open ? generateOptions(1) : undefined })}
      />

      <Divider orientation="left">组件扩展: search 事件</Divider>
      <Select
        pickEvent="search"
        request={(type, prevParams, currentParams) => {
          return generatePromise({ content: generateOptions(1, 10, currentParams.value) })
        }}
      />

      <Divider orientation="left">组件扩展: scroll 事件</Divider>
      <Select
        // open={true}
        // virtual={true}
        locale={{ search: '搜索中...', loadMore: '加载更多...', noMore: '没有更多了' }}
        pickEvent="mount,search,scroll"
        request={(type, prevParams, currentParams) => {
          if (type === 'mount' || type === 'search') {
            return generatePromise({
              params: { pageNo: 1, pageSize: 20, keywords: currentParams?.value },
              content: generateOptions(1, 20, currentParams?.value),
            })
          }

          const { pageNo, pageSize, keywords } = prevParams
          return generatePromise({
            params: { ...prevParams, pageNo: pageNo + 1, pageSize },
            content: generateOptions(pageNo + 1, pageSize, keywords),
            scroll: { hasNextPage: pageNo + 1 >= 3 }, // 已加载完毕
          })
        }}
      />
    </div>
  )
}

export default App
