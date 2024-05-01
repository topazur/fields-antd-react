/**
 * @title 由平铺结构转化为树形结构
 * @param treeData 平铺数据
 * @param id 唯一ID
 * @param pId 关联父级ID
 * @param rootPId 顶层节点的关联父级ID，通过全等判断是否为顶层节点
 * @url https://juejin.cn/post/6983904373508145189
 * @url https://github.com/react-component/tree-select/blob/master/src/hooks/useTreeData.ts#L6
 */
export function parseSimpleTreeData(treeData?: any[], id = 'id', pId = 'pId', rootPId: any = null): any[] {
  const referenceNodes: any = {} // 引用对象
  const rootNodeList: any[] = [] // 结果集

  treeData?.forEach((item) => {
    const currId = item[id]
    const currPId = item[pId]

    // 存储到引用对象 (如果是已经声明 children 的对象，需要保持 children 的引用)
    referenceNodes[currId] = Object.assign({ ...item }, referenceNodes[currId]?.children && { children: referenceNodes[currId].children })

    const currentNode = referenceNodes[currId]
    // 如果是顶层父节点直接 push 到结果数组即可，子元素会通过引用关系插入
    if (currPId === rootPId) {
      rootNodeList.push(currentNode)
      return
    }

    // 如果不是顶层父节点，需要先判断父节点是否已存在于引用对象，以及其 children 属性是否初始化
    if (!referenceNodes[currPId]) {
      referenceNodes[currPId] = { children: [] }
    }
    else if (!referenceNodes[currPId]?.children) {
      referenceNodes[currPId].children = []
    }
    referenceNodes[currPId].children.push(currentNode)
  })

  return rootNodeList
}

/**
 * @title 从树形结构中获取指定节点
 * @param tree 树形结构数据源
 * @param valueKey 主键key值
 * @param nodeId 指定节点的属性值
 */
export function findTreeNodeById(tree: any[], valueKey: string, nodeId: any) {
  for (const node of tree) {
    if (node[valueKey] === nodeId) {
      return node
    }
    if (node.children) {
      const result = findTreeNodeById(node.children, valueKey, nodeId)
      if (result) {
        return result
      }
    }
  }
  return null
}
