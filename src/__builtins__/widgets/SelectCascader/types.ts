import type { ComponentClass, FunctionComponent, ReactNode } from 'react'
import type { CascaderProps as AntdCascaderProps } from 'antd'

/**
 * @title Event Name
 * @enum {mount:首次加载, popup:下拉框, search:模糊搜索, load:树形/级联选择器异步加载, loupe:放大镜}
 * @description // NOTICE: 是否首次加载，'mount' | 'popup' 是可选的 event 时机
 * @description 其他 event 是对应特殊场景下的
 */
export type ICascaderEvent = 'mount' | 'popup' | 'search' | 'load' | 'loupe'

export interface ICascaderResponse<T = any> {
  /**
   * 可能存在的参数，缓存上一次请求参数，为下一次请求提供依赖。例如滚动加载可能存在的页码信息
   */
  params?: any
  /**
   * 数据源
   */
  content?: T[]
  /**
   * ICascaderEvent.loupe 的相关信息 (应对可能存在的分页情景)
   */
  loupe?: any
  [key: string]: any
}

export interface ICascaderCustomRequestProps<T = any> {
  /**
   * @title 远程 ajax 请求
   */
  request?: (type: ICascaderEvent, prevParams: any, currentParams: any) => Promise<ICascaderResponse<T>>
  /**
   * @title 防抖控制时间间隔
   */
  requestDelay?: number
  /**
   * 提前声明允许的事件，可以提前决定是否开启事件监听
   * 提供 pickEvent、omitEvent 两种传递方式，pickEvent 的优先级高
   */
  pickEvent?: string
  omitEvent?: string
}

// ===========================================================

export interface ICascaderLoupeRenderProps {
  // 勾选
  isMultiple?: boolean
  labelInValue?: boolean
  valueProp: string
  labelProp: string
  value: any
  onChange: (value: any) => void
  // 显隐
  onCancel: () => void
  // 请求
  onSearch: (params?: Record<string, any> | null) => Promise<ICascaderResponse>
}

export interface ICascaderCustomLoupeProps {
  /**
   * 放大镜显示受控
   */
  loupeOpen?: boolean
  defaultLoupeOpen?: boolean
  onLoupeVisibleChange?: (open: boolean) => void
  /**
   * 自定义传入放大镜的组件
   */
  loupeRender?: FunctionComponent<ICascaderLoupeRenderProps> | ComponentClass<ICascaderLoupeRenderProps>
}

// ===========================================================

/**
 * NOTICE: @override 已重写属性 ['options', 'showSearch', 'onSearch', 'loadData']
 */
export interface ICascaderProps extends
  Omit<AntdCascaderProps,
    // @deprecated 内部已弃用属性
  'dropdownClassName' | 'bordered' | 'showArrow' |
    // @override 已重写属性
  'multiple' | 'suffixIcon' | 'defaultValue' | 'value'>,
  ICascaderCustomRequestProps,
  ICascaderCustomLoupeProps {
  /**
   * 重写 multiple 类型
   */
  multiple?: boolean
  /**
   * 是否支持对象格式
   */
  labelInValue?: boolean
  defaultValue?: any[]
  value?: any[]
  /**
   * 是否是平铺的数据结构 (若是则内部会将其转化为属性结构，便于后端查询，在组件内部自动转化)
   */
  treeDataSimpleMode?: boolean | {
    id?: string
    pId?: string
    rootPId?: any
  }
  /**
   * 内部实现只读状态的样式
   */
  readOnly?: boolean
  /**
   * 为了放大镜 icon 重写 suffixIcon 逻辑 (组件已对后缀图标做了冒泡处理，此处不需要额外处理)
   * 可参考源码中 suffixIconElement 的实现
   */
  suffixIcon?: (props: any) => ReactNode
  /**
   * 组件级别语言包。便于自定义 dom 结构，或者实现国际化
   */
  locale?: Record<string, any>
}
