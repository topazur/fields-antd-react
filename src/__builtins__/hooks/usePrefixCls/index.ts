import { useContext } from 'react'
import { ConfigProvider } from 'antd'

export const useConfigContext = () => useContext(ConfigProvider.ConfigContext)

export const defaultPrefixCls = 'ant'
export function usePrefixCls(
  tag?: string,
  props?: { prefixCls?: string },
) {
  const { getPrefixCls } = useConfigContext()

  if (getPrefixCls) {
    return getPrefixCls(tag, props?.prefixCls)
  }

  // 兜底: 判断有无尾随破折号，没有则自动添加 `-` 连接符
  let prefixWithHyphen = props?.prefixCls ?? defaultPrefixCls
  prefixWithHyphen = prefixWithHyphen.endsWith('-') ? prefixWithHyphen : `${prefixWithHyphen}-`
  return `${prefixWithHyphen}${tag ?? ''}`
}
