/**
 * @title 由平铺结构转化为树形结构
 * @param treeData 平铺数据
 * @param rootValue 顶层节点的关联父级ID，通过全等判断是否为顶层节点
 * @param {primaryKey, parentKey, childrenKey} 自定义属性名
 * @url https://juejin.cn/post/6983904373508145189
 * @url https://github.com/react-component/tree-select/blob/master/src/hooks/useTreeData.ts#L6
 */
export function parseCompletedTreeData(
  treeData?: any[],
  rootValue: any = null,
  options?: { primaryKey?: string, parentKey?: string, childrenKey?: string },
): any[] {
  const { primaryKey = 'id', parentKey = 'pId', childrenKey = 'children' } = options || {}

  const referenceMap: any = {} // 引用对象
  const result: any[] = [] // 结果集

  treeData?.forEach((item) => {
    const currPrimaryVal = item[primaryKey]
    const currParentVal = item[parentKey]

    // 存储到引用对象 (如果是已经声明 children 的对象，需要保持 children 的引用)
    referenceMap[currPrimaryVal] = !referenceMap[currPrimaryVal]
      ? item
      : { ...item, ...referenceMap[currPrimaryVal] }

    const currentNode = referenceMap[currPrimaryVal]
    // 如果是顶层父节点直接 push 到结果数组即可，子元素会通过引用关系插入
    if (currParentVal === rootValue) {
      result.push(currentNode)
      return
    }

    // 如果不是顶层父节点，需要先判断父节点是否已存在于引用对象，以及其 children 属性是否初始化
    if (!referenceMap[currParentVal]) {
      referenceMap[currParentVal] = { [childrenKey]: [] }
    }
    else if (!referenceMap[currParentVal]?.[childrenKey]) {
      referenceMap[currParentVal][childrenKey] = []
    }
    referenceMap[currParentVal][childrenKey].push(currentNode)
  })

  return result
}

/**
 * @title 从树形结构中获取指定节点的全路径，可根据返回值得到路径或指定节点
 * @param treeData 树形结构数据源
 * @param value 指定节点的属性值，通过全等判断是否为被查找的节点
 * @param {primaryKey, childrenKey} 自定义属性名
 */
export function findTreeNodePaths(
  treeData?: any[],
  value: any = null,
  options?: { primaryKey?: string, childrenKey?: string },
) {
  const { primaryKey = 'id', childrenKey = 'children' } = options || {}

  let paths: any[] = []
  function recursion(tree, currentPath): boolean {
    for (const node of tree) {
      const newPath: any[] = [...currentPath, node]

      const currPrimaryVal = node[primaryKey]
      if (currPrimaryVal === value) {
        paths = newPath
        return true
      }

      if (node[childrenKey] && recursion(node[childrenKey], newPath)) {
        return true
      }
    }
    return false
  }
  recursion(treeData, [])

  return paths
}
