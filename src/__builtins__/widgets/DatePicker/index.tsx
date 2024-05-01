import { useCallback, useMemo } from 'react'
import { DatePicker as AntdDatePicker, TimePicker as AntdTimePicker } from 'antd'
import dayjs from 'dayjs'
import { useControllableValue } from 'ahooks'

import { DEFAULT_FORMATS_DATETIME, toFormatString } from '../../utils'

import type { FC } from 'react'
import type { DatePickerProps as AntdDatePickerProps, RangePickerProps as RangePickerDateProps } from 'antd/lib/date-picker'
import type { TimePickerProps as AntdTimePickerProps, RangePickerTimeProps } from 'antd/lib/time-picker'
import type { AllowNullUndefined, PickerMode } from '../../types'

export type DatePickerProps = (
  Omit<AntdDatePickerProps, 'picker' | 'value' | 'onChange'> |
  Omit<AntdTimePickerProps, 'picker' | 'value' | 'onChange'>
) & {
  picker?: PickerMode
  valueFormat?: string
  value?: string | null
  onChange?: (date: string | null) => void
}

/**
 * @title 日期/时间选择器
 * @param {DatePickerProps} props 联合类型
 * @description 两种选择器聚合起来，约定最终数据流转的类型都是日期格式字符串，便于解析转化与处理
 */
export const DatePicker: FC<DatePickerProps> = (props) => {
  const {
    picker = 'date',
    format = DEFAULT_FORMATS_DATETIME[picker],
    valueFormat = DEFAULT_FORMATS_DATETIME[picker],
    ...restProps
  } = props

  // 组件的状态既可以自己管理，也可以被外部控制
  const [value, onChange] = useControllableValue<string | null>(props, {
    defaultValuePropName: 'defaultValue',
    valuePropName: 'value',
    trigger: 'onChange',
  })

  // 将日期字符串转化为 dayjs 对象
  const calcValue = useMemo(() => {
    if (!value) { return null }
    return dayjs(value, valueFormat)
  }, [valueFormat, value])

  // 将 dayjs 对象转化为日期字符串
  const onChangeConverter = useCallback((date) => {
    onChange(date == null ? null : toFormatString(date, valueFormat))
  }, [valueFormat, onChange])

  if (picker === 'time') {
    return (
      <AntdTimePicker
        {...restProps as AntdTimePickerProps}
        format={format}
        value={calcValue}
        onChange={onChangeConverter}
      />
    )
  }
  return (
    <AntdDatePicker
      {...restProps as AntdDatePickerProps}
      picker={picker}
      format={format}
      value={calcValue}
      onChange={onChangeConverter}
    />
  )
}

export type DateRangePickerProps = (
 Omit< RangePickerDateProps, 'picker' | 'value' | 'onChange'> |
 Omit<RangePickerTimeProps<any>, 'picker' | 'value' | 'onChange'>
) & {
  picker?: PickerMode
  valueFormat?: string
  value?: [start: string | null, end: string | null] | null
  onChange?: (dates: [start: string | null, end: string | null] | null) => void
}

/**
 * @title 日期/时间范围选择器
 * @param {DateRangePickerProps} props 联合类型
 * @description 两种选择器聚合起来，约定最终数据流转的类型都是日期格式字符串，便于解析转化与处理
 */
export const DateRangePicker: FC<DateRangePickerProps> = (props) => {
  const {
    picker = 'date',
    format = DEFAULT_FORMATS_DATETIME[picker],
    valueFormat = DEFAULT_FORMATS_DATETIME[picker],
    ...restProps
  } = props

  // 组件的状态既可以自己管理，也可以被外部控制
  const [value, onChange] = useControllableValue<[AllowNullUndefined<string>, AllowNullUndefined<string>] | null>(props, {
    defaultValuePropName: 'defaultValue',
    valuePropName: 'value',
    trigger: 'onChange',
  })

  // 将日期字符串转化为 dayjs 对象
  const calcValue = useMemo(() => {
    if (!value) { return null }
    return value.map(item => !item ? null : dayjs(item, valueFormat))
  }, [valueFormat, value])

  // 将 dayjs 对象转化为日期字符串
  const onChangeConverter = useCallback((date) => {
    if (date == null) {
      onChange(null)
      return
    }

    onChange(date.map((item) => {
      return item == null
        ? null
        : toFormatString(item, valueFormat)
    }))
  }, [valueFormat, onChange])

  if (picker === 'time') {
    return (
      <AntdTimePicker.RangePicker
        {...restProps as RangePickerTimeProps<any>}
        format={format}
        value={calcValue as any}
        onChange={onChangeConverter}
      />
    )
  }
  return (
    <AntdDatePicker.RangePicker
      {...restProps as RangePickerDateProps}
      picker={picker}
      format={format}
      value={calcValue as any}
      onChange={onChangeConverter}
    />
  )
}
