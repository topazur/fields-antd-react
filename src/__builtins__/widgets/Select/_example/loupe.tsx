import { useEffect, useState } from 'react'
import { Select as AntdSelect, Divider, Flex, Modal, Table } from 'antd'
import { useRequest } from 'ahooks'

import { toArr } from '../../../utils'
import { Select } from '../'
import { generateOptions, generatePromise } from './base'

import type React from 'react'
import type { ILoupeRenderProps } from '../types'

/**
 * @title 自定义的 loupeRender 组件
 * 此时的 params 可传递标识区分 首次加载，分页变化，搜索条件变化 等细化接口请求
 */
const SelectLoupeModal: React.FC<ILoupeRenderProps> = (props) => {
  const { isMultiple, labelInValue, valueProp, labelProp: _, value, onChange, onCancel, onSearch } = props

  const [selectedRowKeys, setSelectedRowKeys] = useState(value)

  const onOk = () => {
    onChange(selectedRowKeys)
    onCancel()
  }

  const { data, loading, run } = useRequest(async (params) => {
    const res = await onSearch(params)
    return {
      pageNo: res.params?.pageNo ?? 1,
      pageSize: res.params?.pageSize ?? 20,
      total: res.loupe?.total ?? 0,
      dataSource: res.content,
    }
  }, { manual: true })

  useEffect(() => {
    run({ type: 'initialized', pageNo: 1, pageSize: 20 })
  }, [])

  return (
    <Modal title="放大镜-表格" open={true} onCancel={onCancel} onOk={onOk}>
      <Table
        size="small"
        scroll={{ y: '360px' }}
        rowKey="value"
        rowSelection={{
          type: isMultiple ? 'checkbox' : 'radio',
          defaultSelectedRowKeys: toArr(selectedRowKeys).map(item => labelInValue ? item[valueProp] : item),
          onChange(selectedRowKeys, selectedRows, _info) {
            const val = labelInValue ? selectedRows : selectedRowKeys
            setSelectedRowKeys(isMultiple ? val : val[0])
          },
        }}
        columns={[
          {
            title: 'Value',
            dataIndex: 'value',
          },
          {
            title: 'Label',
            dataIndex: 'label',
          },
        ]}
        loading={loading}
        pagination={{
          current: data?.pageNo,
          pageSize: data?.pageSize,
          total: data?.total,
          onChange(page, pageSize) {
            run({ type: 'pagination', pageNo: page, pageSize })
          },
        }}
        dataSource={data?.dataSource}
      />
    </Modal>
  )
}

const App: React.FC = (props) => {
  const [mode, setMode] = useState<any>('undefined')
  const [labelInValue, setLabelInValue] = useState<boolean>(true)

  return (
    <div {...props}>
      <Flex>
        <span>调整Props查看效果: </span>
        <AntdSelect style={{ width: '20%', marginLeft: '2%' }} value={mode} onChange={setMode} options={[{ value: 'undefined', label: '单选' }, { value: 'multiple' }, { value: 'tags' }]} />
        <AntdSelect style={{ width: '20%', marginLeft: '2%' }} value={labelInValue} onChange={setLabelInValue} options={[{ value: true, label: 'true:labelInValue' }, { value: false, label: 'false:labelInValue' }]} />
      </Flex>

      <span style={{ fontSize: '14px', color: '#aaa' }}>1. 当启用放大镜模式时，强烈建议开启 labelInValue, 否则可能没有对应的 label 用于显示</span>
      <span style={{ fontSize: '14px', color: '#aaa' }}>2. 跨分页保持选中是 loupeRender 应该去做的，可以根据业务组件定制，此处不做演示</span>

      <Divider orientation="left">1. Modal + Table</Divider>
      <Select
        mode={mode === 'undefined' ? undefined : mode}
        labelInValue={labelInValue}
        defaultValue={undefined}
        options={generateOptions(1, 10)}
        loupeRender={SelectLoupeModal}
        // ====
        pickEvent="mount,search,scroll"
        request={(type, prevParams, currentParams) => {
          if (type === 'mount' || type === 'search') {
            return generatePromise({
              params: { pageNo: 1, pageSize: 20, keywords: currentParams?.value },
              content: generateOptions(1, 20, currentParams?.value),
            })
          }

          if (type === 'loupe') {
            console.log('[vscode-log] loupe.tsx@Line 109: ', prevParams, currentParams)
            const { pageNo, pageSize } = currentParams || {}
            return generatePromise({
              params: { pageNo, pageSize },
              content: generateOptions(pageNo, pageSize),
              loupe: { total: 100 },
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

      <Divider orientation="left">WIP: 2. Modal + Transfer</Divider>

      <Divider orientation="left">WIP: 3. Drawer + Table</Divider>

      <Divider orientation="left">WIP: 4. Drawer + Transfer</Divider>
    </div>
  )
}

export default App
