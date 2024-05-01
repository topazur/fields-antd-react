import { useEffect, useState } from 'react'
import { Select as AntdSelect, Divider, Flex, Modal, Table } from 'antd'
import { useRequest } from 'ahooks'

import { parseCompletedTreeData, toArr } from '../../../utils'
import { Cascader } from '../'
import { genTileTreeData, generatePromise } from './base'

import type { FC } from 'react'
import type { ICascaderLoupeRenderProps } from '../types'

// 递归查找节点并返回路径
function findPath(tree, nodeId) {
  let path: any[] = []

  function recurse(subTree, currentPath) {
    for (const node of subTree) {
      const newPath = [...currentPath, node]
      if (node.id === nodeId) {
        path = newPath
        return true
      }
      if (node.children && recurse(node.children, newPath)) {
        return true
      }
    }
    return false
  }

  recurse(tree, [])
  return path
}

/**
 * @title 自定义的 loupeRender 组件
 * 此时的 params 可传递标识区分 首次加载，分页变化，搜索条件变化 等细化接口请求
 */
const SelectLoupeModal: FC<ICascaderLoupeRenderProps> = (props) => {
  const { isMultiple, labelInValue: _1, valueProp: _2, labelProp: _, value, onChange, onCancel, onSearch } = props

  const [selectedRowKeys, setSelectedRowKeys] = useState(value)

  const { data, loading, run } = useRequest(async (params) => {
    const res = await onSearch(params)
    return {
      // pageNo: res.params?.pageNo ?? 1,
      // pageSize: res.params?.pageSize ?? 20,
      // total: res.loupe?.total ?? 0,
      dataSource: res.content,
    }
  }, { manual: true })

  const onOk = () => {
    const result = selectedRowKeys.map((item) => {
      return findPath(data?.dataSource || [], item).map(({ children: _, ...restItem }) => {
        return restItem
      })
    })
    onChange(result)
    onCancel()
  }

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
          defaultSelectedRowKeys: selectedRowKeys,
          onChange(selectedRowKeys, _selectedRows, _info) {
            setSelectedRowKeys(selectedRowKeys)
          },
          checkStrictly: false,
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
        pagination={false}
        dataSource={data?.dataSource}
      />
    </Modal>
  )
}

const App: React.FC = (props) => {
  const [multiple, setMultiple] = useState(false)
  const [labelInValue, setLabelInValue] = useState<boolean>(true)

  return (
    <div {...props}>
      <Flex>
        <span>调整Props查看效果: </span>
        <AntdSelect style={{ width: '20%', marginLeft: '2%' }} value={multiple} onChange={setMultiple} options={[{ value: false, label: '单选' }, { value: true, label: '多选' }]} />
        <AntdSelect style={{ width: '20%', marginLeft: '2%' }} value={labelInValue} onChange={setLabelInValue} options={[{ value: true, label: 'true:labelInValue' }, { value: false, label: 'false:labelInValue' }]} />
      </Flex>

      <span style={{ fontSize: '14px', color: '#aaa' }}>1. 当启用放大镜模式时，强烈建议开启 labelInValue, 否则可能没有对应的 label 用于显示</span>
      <span style={{ fontSize: '14px', color: '#aaa' }}>2. 跨分页保持选中是 loupeRender 应该去做的，可以根据业务组件定制，此处不做演示</span>

      <Divider orientation="left">1. Modal + Table</Divider>
      <span style={{ fontSize: '14px', color: '#aaa' }}>当 mode 允许为 search 和 load 存在时，触发 search 后，不能再触发 load 事件(解决方案是 search 的结果是筛选后的完整的树)</span>
      <span style={{ fontSize: '14px', color: '#aaa' }}>设置 changeOnSelect=true 后，不妨碍同时选中父级和展开父级操作冲突</span>
      <Cascader
        multiple={multiple}
        labelInValue={labelInValue}
        defaultValue={undefined}
        loupeRender={SelectLoupeModal}
        // ====
        pickEvent="mount,search,load"
        request={(type, prevParams, currentParams) => {
          if (type === 'mount') {
            return generatePromise({
              content: genTileTreeData(1, 4, 'Mount', null, false),
            })
          }
          if (type === 'search') {
            return generatePromise({
              content: genTileTreeData(2, 4, currentParams?.value, null, true),
            })
          }

          if (type === 'loupe') {
            console.log('[vscode-log] loupe.tsx@Line 109: ', prevParams, currentParams)
            const { pageNo, pageSize } = currentParams || {}
            return generatePromise({
              params: { pageNo, pageSize },
              content: parseCompletedTreeData(genTileTreeData(2, 4, currentParams?.value, null, true)),
              loupe: { total: 100 },
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

      <Divider orientation="left">WIP: 2. Modal + Transfer</Divider>

      <Divider orientation="left">WIP: 3. Drawer + Table</Divider>

      <Divider orientation="left">WIP: 4. Drawer + Transfer</Divider>
    </div>
  )
}

export default App
