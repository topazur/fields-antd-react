import { useCallback } from 'react'
import { Input as AntdInput } from 'antd'

import { useControllableValue } from '../../hooks'

import type { ChangeEvent, FC } from 'react'
import type { InputProps as AntdInputProps, PasswordProps as AntdPasswordProps, TextAreaProps as AntdTextAreaProps } from 'antd/lib/input'
import type { OTPProps as AntdOTPProps } from 'antd/lib/input/OTP' // 一次性令牌（One Time Password，简称OTP）

// 联合类型（Union Type）来区分不同 type 下的 props 类型
export type InputProps =
  | { type: 'textarea' } & Omit<AntdTextAreaProps, 'onChange'> & { onChange?: (value: string) => void }
  | { type: 'password' } & Omit<AntdPasswordProps, 'onChange'> & { onChange?: (value: string) => void }
  | { type: 'otp' } & AntdOTPProps
  | { type?: 'input' } & Omit<AntdInputProps, 'onChange'> & { onChange?: (value: string) => void }

/**
 * @title Input.TextArea / Input.Password / Input.OTP / Input，暂未添加 Input.Search
 * @param {InputProps} props 联合类型
 * @description 四种组件聚合起来，通过 props.type 来区分
 */
export const Input: FC<InputProps> = (props) => {
  const { type, ...restProps } = props

  // 组件的状态既可以自己管理，也可以被外部控制
  const [value, onChange] = useControllableValue<string>(props, {
    defaultValuePropName: 'defaultValue',
    valuePropName: 'value',
    trigger: 'onChange',
  })

  // 对四种组件的 onChange 事件做兼容处理
  const onComposeChange = useCallback((value: string | ChangeEvent<{ value: string }>) => {
    if (typeof value === 'string') {
      onChange(value)
      return
    }

    onChange(value.target.value)
  }, [onChange])

  if (type === 'textarea') {
    return (
      <AntdInput.TextArea
        {...restProps as AntdTextAreaProps}
        value={value}
        onChange={onComposeChange}
      />
    )
  }
  if (type === 'password') {
    return (
      <AntdInput.Password
        {...restProps as AntdPasswordProps}
        value={value}
        onChange={onComposeChange}
      />
    )
  }
  if (type === 'otp') {
    return (
      <AntdInput.OTP
        {...restProps as AntdOTPProps}
        value={value}
        onChange={onComposeChange}
      />
    )
  }
  return (
    <AntdInput
      {...restProps as AntdInputProps}
      value={value}
      onChange={onComposeChange}
    />
  )
}
