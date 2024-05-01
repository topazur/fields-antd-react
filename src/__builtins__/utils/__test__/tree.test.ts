import { describe, expect, it } from 'vitest'

import { findTreeNodePaths, parseCompletedTreeData } from '../'

function genTreeData(level: number, count: number, prefix: string = '') {
  if (level === 0) {
    return []
  }

  const results: any = []
  for (let i = 1; i <= count; i++) {
    results.push({
      value: prefix + i,
      label: prefix + i,
      children: genTreeData(level - 1, count, prefix + i),
    })
  }
  return results
}

function genTileTreeData(level: number, count: number, prefix: string = '', rootPId: any = null) {
  const temp = genTreeData(level, count, prefix)

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

describe('tree', () => {
  it('parseCompletedTreeData', () => {
    // 🟢 一个根节点
    const tileTreeData1 = genTileTreeData(4, 1)
    const treeData1 = parseCompletedTreeData(tileTreeData1, null)
    // console.log(JSON.stringify(treeData1, null, 2))
    expect(treeData1[0].children[0].children[0].children[0].id).toEqual('1111')

    // 🟢 多个根节点
    const tileTreeData2 = genTileTreeData(4, 2)
    const treeData2 = parseCompletedTreeData(tileTreeData2, null)
    // console.log(JSON.stringify(treeData2, null, 2))
    expect(treeData2[0].children[0].children[0].children[0].id).toEqual('1111')
    expect(treeData2[0].children[0].children[0].children[1].id).toEqual('1112')

    // 🟢 查找指定节点的路径
    const nodePaths1 = findTreeNodePaths(treeData1, '1111')
    expect(nodePaths1.map(item => item.id)).toEqual(['1', '11', '111', '1111'])
    expect(nodePaths1[nodePaths1.length - 1].id).toEqual('1111')
    const nodePaths2 = findTreeNodePaths(treeData2, '2222')
    expect(nodePaths2.map(item => item.id)).toEqual(['2', '22', '222', '2222'])
    expect(nodePaths2[nodePaths2.length - 1].id).toEqual('2222')
  })
})
