import { useCallback, useMemo } from 'react'
import { Checkbox as AntdCheckbox, Switch as AntdSwitch } from 'antd'
import { useControllableValue } from 'ahooks'

import type { FC } from 'react'
import type { CheckboxProps as AntdCheckboxProps, SwitchProps as AntdSwitchProps } from 'antd'
import type { CheckboxChangeEvent } from 'antd/lib/checkbox'

// NOTICE: 若仍不满足可考虑重写 activeValue 和 inactiveValue 传递函数，返回值用作对比。此处暂未实现
export type SwitchProps = (
  Omit<AntdCheckboxProps, 'value' | 'onChange'> |
  Omit<AntdSwitchProps, 'checkedChildren' | 'unCheckedChildren' | 'value' | 'onChange'>
) & {
  // ADD: 显示组件类型
  type?: 'checkbox' | 'switch'
  // ADD: 选中时的的值 - 支持数据类型，通过来全等来判断
  activeValue?: boolean | number | string
  // ADD: 非选中时的值 - 支持数据类型，通过来全等来判断
  inactiveValue?: boolean | number | string
  // ADD: 选中时的 label 内容
  checkedChildren?: React.ReactNode
  // ADD: 非选中时的 label 内容
  unCheckedChildren?: React.ReactNode
  value?: boolean | number | string
  // REAPLACE: 统一 onChange 的类型
  onChange?: (checked?: boolean | number | string) => void
}

/**
 * @title Switch 开关 / Checkbox 多选框
 * @param {SwitchProps} props 联合类型
 * @description 两种组件聚合起来，约定最终数据流转的类型参考 activeValue 和 inactiveValue 的类型定义，便于解析转化与处理
 */
export const Switch: FC<SwitchProps> = (props) => {
  const {
    type,
    activeValue = true,
    inactiveValue = false,
    checkedChildren,
    unCheckedChildren,
    ...restProps
  } = props

  // 组件的状态既可以自己管理，也可以被外部控制
  const [value, onChange] = useControllableValue<boolean | number | string>(props, {
    defaultValuePropName: 'defaultValue',
    valuePropName: 'value',
    trigger: 'onChange',
  })

  // 简单数据类型，判断全等即可
  const checked = useMemo(() => {
    if (value === activeValue) { return true }
    if (value === inactiveValue) { return false }
    return undefined
  }, [activeValue, inactiveValue, value])

  // 对两种组件的 onChange 事件做兼容处理
  const onComposeChange = useCallback((value: boolean | CheckboxChangeEvent) => {
    if (typeof value === 'boolean') {
      onChange?.(value ? activeValue : inactiveValue)
      return
    }

    onChange?.(value.target.checked ? activeValue : inactiveValue)
  }, [activeValue, inactiveValue, onChange])

  if (type === 'checkbox') {
    return (
      <AntdCheckbox
        {...restProps as AntdCheckboxProps}
        checked={checked}
        onChange={onComposeChange}
      >
        {value === activeValue ? checkedChildren : unCheckedChildren}
      </AntdCheckbox>
    )
  }
  return (
    <AntdSwitch
      {...restProps as AntdSwitchProps}
      checkedChildren={checkedChildren}
      unCheckedChildren={checkedChildren}
      checked={checked}
      onChange={onComposeChange}
    />
  )
}
