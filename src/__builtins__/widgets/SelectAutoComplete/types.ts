import type { AutoCompleteProps as AntdAutoCompleteProps } from 'antd'

/**
 * @title Event Name
 * @enum {mount:首次加载, popup:下拉框, search:模糊搜索}
 * @description // NOTICE: 是否首次加载，'mount' | 'popup' 是可选的 event 时机
 * @description 其他 event 是对应特殊场景下的
 */
export type IAutoCompleteEvent = 'mount' | 'popup' | 'search'

export interface IAutoCompleteResponse<T = any> {
  /**
   * 可能存在的参数，缓存上一次请求参数，为下一次请求提供依赖。例如滚动加载可能存在的页码信息
   */
  params?: any
  /**
   * 数据源
   */
  content?: T[]
  [key: string]: any
}

export interface IAutoCompleteCustomRequestProps<T = any> {
  /**
   * @title 远程 ajax 请求
   */
  request?: (type: IAutoCompleteEvent, prevParams: any, currentParams: any) => Promise<IAutoCompleteResponse<T>>
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

/**
 * NOTICE: @override 已重写属性 ['options', 'suffixIcon', 'filterOption', 'onSearch']
 */
export interface IAutoCompleteProps extends
  Omit<AntdAutoCompleteProps,
    // @deprecated 内部已弃用属性
    'dataSource' | 'dropdownClassName' | 'dropdownMatchSelectWidth' | 'bordered' | 'showArrow' >,
  IAutoCompleteCustomRequestProps {
  /**
   * 内部实现只读状态的样式
   */
  readOnly?: boolean
  /**
   * 组件级别语言包。便于自定义 dom 结构，或者实现国际化
   */
  locale?: Record<string, any>
}
