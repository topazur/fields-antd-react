import { describe, expect, it } from 'vitest'
import { renderHook } from '@testing-library/react-hooks'

import { useResponsive } from '../'

describe('useResponsive', () => {
  it('when width not exist', () => {
    const hook = renderHook(() => useResponsive(undefined, []))
    expect(hook.result.current).toEqual({
      xs: false,
      sm: false,
      md: false,
      lg: false,
      xl: false,
      xxl: false,
      current: undefined,
    })
  })

  // 从大到小，除了跳过的一旦匹配到跳出循环
  it('when full breakpoints', () => {
    const hook1 = renderHook(() => useResponsive(575))
    expect(hook1.result.current).toEqual({
      xs: true,
      sm: false,
      md: false,
      lg: false,
      xl: false,
      xxl: false,
      current: 'xs',
    })

    const hook2 = renderHook(() => useResponsive(576))
    expect(hook2.result.current).toEqual({
      xs: false,
      sm: true,
      md: false,
      lg: false,
      xl: false,
      xxl: false,
      current: 'sm',
    })
  })

  // 按照标准 1201 >= 1200 是应该匹配 xl 的，但是缺失后表示 xl 不参与断点尺寸匹配
  it('when breakpoints length less than 6', () => {
    const hook1 = renderHook(() => useResponsive(1201, [0, 576, 768, 992]))
    expect(hook1.result.current).toEqual({
      xs: false,
      sm: false,
      md: false,
      lg: true,
      xl: false,
      xxl: false,
      current: 'lg',
    })
  })
})
