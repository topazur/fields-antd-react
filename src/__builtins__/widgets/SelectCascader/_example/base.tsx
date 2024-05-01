/* eslint-disable unused-imports/no-unused-vars */
import { Divider } from 'antd'

import { Cascader } from '../'

import type { FC } from 'react'
import type { ICascaderResponse } from '../'

export function genTreeData(level: number, count: number, prefix: string = '', hasIsLeaf = false) {
  if (level === 0) {
    return []
  }

  const results: any = []
  for (let i = 1; i <= count; i++) {
    const item: any = {
      value: prefix + i,
      label: prefix + i,
      extraProp: prefix + i,
      children: genTreeData(level - 1, count, prefix + i, hasIsLeaf),
      isLeaf: false,
    }
    if (hasIsLeaf && level === 1) {
      item.isLeaf = true
    }
    results.push(item)
  }
  return results
}

export function genTileTreeData(level: number, count: number, prefix: string = '', rootPId: any = null, hasIsLeaf = false) {
  const temp = genTreeData(level, count, prefix, hasIsLeaf)

  const tileResults: any[] = []
  function recursionFn(list: any[], pId) {
    for (const item of list) {
      const { children, value, ...rest } = item
      tileResults.push({ ...rest, value, id: value, pId })
      recursionFn(children, value)
    }
  }
  recursionFn(temp, rootPId)

  return tileResults
}

export function generatePromise(args: ICascaderResponse): Promise<ICascaderResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(args)
    }, 500)
  })
}

const App: FC = (props) => {
  return (
    <div {...props}>
      <span style={{ fontSize: '14px', color: '#aaa' }}>仍可以直接使用 options，但是优先级低于远程数据模式</span>
      <span style={{ fontSize: '14px', color: '#aaa' }}>仍可以直接使用 showSearch，但是优先级低于远程数据模式</span>
      <span style={{ fontSize: '14px', color: '#aaa' }}>`multiple=true` 或者 `开启远程搜索` 时，默认开启 showSearch 属性</span>
      <span style={{ fontSize: '14px', color: '#aaa' }}>默认开启 treeDataSimpleMode 属性。优点: 扁平数据便于管理，内部会先转化成树形结构再传递给 AntdCascader 组件</span>

      <Divider orientation="left">组件库自带搜索功能: options + showSearch</Divider>
      <Cascader
        treeDataSimpleMode={false}
        options={genTreeData(2, 4, 'Tree-', true)}
        showSearch={true}
      />

      <Divider orientation="left">组件扩展: mount 事件</Divider>
      <Cascader
        pickEvent="mount"
        request={(type, prevParams, currentParams) => generatePromise({ content: genTileTreeData(2, 4, 'Tile-Mount-', null, true) })}
      />

      <Divider orientation="left">组件扩展: popup 事件</Divider>
      <Cascader
        pickEvent="popup"
        request={(type, prevParams, currentParams) => generatePromise({ content: currentParams?.open ? genTileTreeData(2, 4, 'Tile-Popup-', null, true) : undefined })}
      />

      <Divider orientation="left">组件扩展: search 事件</Divider>
      <Cascader
        pickEvent="search"
        request={(type, prevParams, currentParams) => {
          return generatePromise({ content: genTileTreeData(2, 4, currentParams.value, null, true) })
        }}
      />

      <Divider orientation="left">组件扩展: load 事件</Divider>
      <span style={{ fontSize: '14px', color: '#aaa' }}>当 isLeaf 属性为 true 时，表示是叶子节点，不再显示展开图标，即不再具有 load 事件</span>
      <span style={{ fontSize: '14px', color: '#aaa' }}>changeOnSelect 选择即改变, 这种交互允许只选中父级选项。(展开同时选择)</span>
      <Cascader
        changeOnSelect={true}
        pickEvent="mount,load"
        request={(type, prevParams, currentParams) => {
          if (type === 'mount') {
            return generatePromise({
              content: genTileTreeData(1, 4, 'Tile-Load-', null, false),
            })
          }

          const selectOptions: any[] = currentParams.selectOptions
          const targetOption = selectOptions[selectOptions.length - 1]
          if (targetOption.children && targetOption.children.length > 0) {
            return generatePromise({ content: [] })
          }
          return generatePromise({
            content: genTileTreeData(1, 3, targetOption.id, targetOption.id, false).map((item, index) => (index <= 1 ? { ...item, isLeaf: true } : item)),
          })
        }}
      />
    </div>
  )
}

export default App
