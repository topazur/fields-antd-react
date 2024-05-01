import { useState } from 'react'
import { Select as AntdSelect, Divider, Flex, Tag } from 'antd'

import { SelectTree } from '../'
import { genTileTreeData } from './base'

import type React from 'react'

const simpleTreeData = genTileTreeData(2, 4, 'Overflow-', null, true)

const App: React.FC = (props) => {
  const [variant, setVariant] = useState<any>('outlined')
  const [size, setSize] = useState<any>('middle')
  const [state, setState] = useState<any>('none')

  const disabled = state === 'disabled'
  const readonly = state === 'readonly'

  return (
    <div {...props}>
      <Flex>
        <span>调整Props查看效果: </span>
        <AntdSelect style={{ width: '20%', marginLeft: '2%' }} value={variant} onChange={setVariant} options={[{ value: 'outlined' }, { value: 'filled' }, { value: 'borderless' }]} />
        <AntdSelect style={{ width: '20%', marginLeft: '2%' }} value={size} onChange={setSize} options={[{ value: 'small' }, { value: 'middle' }, { value: 'large' }]} />
        <AntdSelect style={{ width: '20%', marginLeft: '2%' }} value={state} onChange={setState} options={[{ value: 'none' }, { value: 'disabled' }, { value: 'readonly' }]} />
      </Flex>

      <Divider orientation="left">单选(`multiple=false`)</Divider>
      <SelectTree
        variant={variant}
        size={size}
        disabled={disabled}
        readOnly={readonly}
        // ====
        multiple={false}
        labelInValue={false}
        defaultValue="Overflow-1-1"
        treeData={simpleTreeData}
      />

      <Divider orientation="left">单选(`multiple=false`) + labelInValue=true</Divider>
      <SelectTree
        variant={variant}
        size={size}
        disabled={disabled}
        readOnly={readonly}
        // ====
        multiple={false}
        labelInValue={true}
        defaultValue={{ value: 'Overflow-1-1', label: 'Overflow-1-1' }}
        treeData={simpleTreeData}
      />

      <Divider orientation="left">多选(`multiple=true`)</Divider>
      <SelectTree
        variant={variant}
        size={size}
        disabled={disabled}
        readOnly={readonly}
        // ====
        multiple={true}
        maxTagCount="responsive"
        labelInValue={false}
        defaultValue={simpleTreeData.map(item => item.value)}
        treeData={simpleTreeData}
      />

      <Divider orientation="left">多选(`multiple=true`) + labelInValue=true</Divider>
      <SelectTree
        variant={variant}
        size={size}
        disabled={disabled}
        readOnly={readonly}
        // ====
        multiple={true}
        maxTagCount="responsive"
        labelInValue={true}
        defaultValue={simpleTreeData.map(item => ({ value: item.value, label: item.label }))}
        treeData={simpleTreeData}
      />

      <Divider orientation="left">
        FIXED: searchValue过长时，限制其长度防止换行
      </Divider>
      <span style={{ fontSize: '14px', color: '#aaa' }}>可通过 cssvar `--fields-select-selection-search-max-width` 设置最大宽度</span>
      <span style={{ fontSize: '14px', color: '#f00' }}>仅聚焦时才显示 searchValue，是组件内部行为，包装未做相应处理</span>
      <SelectTree
        variant={variant}
        size={size}
        disabled={disabled}
        readOnly={readonly}
        // ====
        multiple={true}
        maxTagCount="responsive"
        labelInValue={true}
        defaultValue={simpleTreeData.map(item => ({ value: item.value, label: item.label }))}
        treeData={simpleTreeData}
        autoClearSearchValue={false}
        searchValue="111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111"
      />

      <Divider orientation="left">
        FEAT: 包装过的 tagRender 可以渲染平铺和折叠的标签（方便自定义）
      </Divider>
      <SelectTree
        variant={variant}
        size={size}
        disabled={disabled}
        readOnly={readonly}
        // ====
        multiple={true}
        maxTagCount="responsive"
        labelInValue={true}
        defaultValue={simpleTreeData.map(item => ({ value: item.value, label: item.label }))}
        treeData={simpleTreeData}
        tagRender={(props) => {
          const onClose = (event?: React.MouseEvent) => {
            event && event.preventDefault() // 阻止 tag 的 close 事件，放置标签被直接删除，而不是修改 value
            props.onClose(event as any)
          }
          return (
            <Tag
              key={props.value}
              closable={props.isMaxTag ? false : props.closable}
              onMouseDown={(event) => { event.stopPropagation() }}
              onClose={onClose}
            >
              {props.label}
            </Tag>
          )
        }}
      />
    </div>
  )
}

export default App
