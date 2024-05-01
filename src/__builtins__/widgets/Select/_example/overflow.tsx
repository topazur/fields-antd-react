import { useState } from 'react'
import { Select as AntdSelect, Divider, Flex, Tag } from 'antd'

import { Select } from '../'
import { generateOptions } from './base'

import type React from 'react'

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

      <Divider orientation="left">单选(`mode=undefined`)</Divider>
      <Select
        variant={variant}
        size={size}
        disabled={disabled}
        readOnly={readonly}
        // ====
        mode={undefined}
        labelInValue={false}
        defaultValue="value_1"
        options={generateOptions(1, 10)}
      />

      <Divider orientation="left">单选(`mode=undefined`) + labelInValue=true</Divider>
      <Select
        variant={variant}
        size={size}
        disabled={disabled}
        readOnly={readonly}
        // ====
        mode={undefined}
        labelInValue={true}
        defaultValue={{ value: 'value_1', label: 'label_1' }}
        options={generateOptions(1, 10)}
      />

      <Divider orientation="left">多选(`mode=multiple`)</Divider>
      <Select
        variant={variant}
        size={size}
        disabled={disabled}
        readOnly={readonly}
        // ====
        mode="multiple"
        labelInValue={false}
        maxTagCount="responsive"
        defaultValue={generateOptions(1, 10).map(item => item.value)}
        options={generateOptions(1, 10)}
      />

      <Divider orientation="left">多选(`mode=multiple`) + labelInValue=true</Divider>
      <Select
        variant={variant}
        size={size}
        disabled={disabled}
        readOnly={readonly}
        // ====
        mode="multiple"
        labelInValue={true}
        maxTagCount="responsive"
        defaultValue={generateOptions(1, 10)}
        options={generateOptions(1, 10)}
      />

      <Divider orientation="left">标签模式(`mode=tags`)</Divider>
      <Select
        variant={variant}
        size={size}
        disabled={disabled}
        readOnly={readonly}
        // ====
        mode="tags"
        labelInValue={false}
        maxTagCount="responsive"
        defaultValue={generateOptions(1, 10).map(item => item.value)}
        options={generateOptions(1, 10)}
      />

      <Divider orientation="left">
        标签模式(`mode=tags`) + labelInValue=true
      </Divider>
      <Select
        variant={variant}
        size={size}
        disabled={disabled}
        readOnly={readonly}
        // ====
        mode="tags"
        labelInValue={true}
        maxTagCount="responsive"
        defaultValue={generateOptions(1, 10)}
        options={generateOptions(1, 10)}
      />

      <Divider orientation="left">
        FIXED: searchValue过长时，限制其长度防止换行
      </Divider>
      <span style={{ fontSize: '14px', color: '#aaa' }}>可通过 cssvar `--fields-select-selection-search-max-width` 设置最大宽度</span>
      <Select
        variant={variant}
        size={size}
        disabled={disabled}
        readOnly={readonly}
        // ====
        mode="tags"
        labelInValue={true}
        maxTagCount="responsive"
        defaultValue={generateOptions(1, 10)}
        options={generateOptions(1, 10)}
        searchValue="111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111"
      />

      <Divider orientation="left">
        FEAT: 包装过的 tagRender 可以渲染平铺和折叠的标签（方便自定义）
      </Divider>
      <Select
        variant={variant}
        size={size}
        disabled={disabled}
        readOnly={readonly}
        // ====
        mode="tags"
        labelInValue={true}
        maxTagCount="responsive"
        defaultValue={generateOptions(1, 10)}
        options={generateOptions(1, 10)}
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
