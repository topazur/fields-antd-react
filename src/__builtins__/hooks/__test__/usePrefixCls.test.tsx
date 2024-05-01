import { describe, expect, it } from 'vitest'
import { renderHook } from '@testing-library/react'

import { defaultPrefixCls, usePrefixCls } from '../'

describe('usePrefixCls', () => {
  it('类名前缀', () => {
    const hook = renderHook(() => usePrefixCls('button'))
    expect(hook.result.current).toEqual(
      defaultPrefixCls.endsWith('-') ? `${defaultPrefixCls}button` : `${defaultPrefixCls}-button`,
    )
  })
})
