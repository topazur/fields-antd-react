import { describe, expect, it } from 'vitest'
import _dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import weekYear from 'dayjs/plugin/weekYear'
import advancedFormat from 'dayjs/plugin/advancedFormat'

import { DEFAULT_FORMATS_DATETIME, datetimeDeserialize, datetimeSerialize, toISOString } from '../'

// eslint-disable-next-line no-lone-blocks
{
  _dayjs.extend(utc)
  _dayjs.extend(timezone)
  _dayjs.extend(weekOfYear)
  _dayjs.extend(weekYear)
  _dayjs.extend(advancedFormat)

  // ========================== 结论: setDefault 是设置局部变量 或 自己全局维护响应式时区变量
  // 将默认时区从本地时区变为自定义时区
  _dayjs.tz.setDefault('Asia/Shanghai')
  // 重置默认时区 <不会影响已构造的 dayjs 对象>
  // dayjs.tz.setDefault()
}

describe('datetime.ts', () => {
  it('formats', () => {
    expect(_dayjs('2008-08-08 20:08:08').format(DEFAULT_FORMATS_DATETIME.date)).toEqual('2008-08-08')
    expect(_dayjs('2008-08-08 20:08:08').format(DEFAULT_FORMATS_DATETIME.time)).toEqual('20:08:08')
    expect(_dayjs('2008-08-08 20:08:08').format(DEFAULT_FORMATS_DATETIME.datetime)).toEqual('2008-08-08 20:08:08')

    expect(_dayjs('2008-08-08 20:08:08').format(DEFAULT_FORMATS_DATETIME.year)).toEqual('2008')
    expect(_dayjs('2008-08-08 20:08:08').format(DEFAULT_FORMATS_DATETIME.quarter)).toEqual('2008-Q3')
    expect(_dayjs('2008-08-08 20:08:08').format(DEFAULT_FORMATS_DATETIME.month)).toEqual('2008-08')
    expect(_dayjs('2008-08-08 20:08:08').format(DEFAULT_FORMATS_DATETIME.week)).toEqual('2008-w32')
  })

  it('toISOString', () => {
    expect(toISOString(null)).toEqual(null)
    expect(toISOString(undefined)).toEqual(null)
    expect(toISOString(undefined, false)).toContain(new Date().getFullYear())
    expect(toISOString('2008-08-08 20:08:08')).toEqual('2008-08-08T12:08:08.000Z')
  })

  it('datetimeSerialize', () => {
    expect(datetimeSerialize(null)).toEqual(null)
    expect(datetimeSerialize(undefined)).toEqual(undefined)
    expect(datetimeSerialize('Invalid')).toContain('Invalid Date')

    expect(datetimeSerialize([null, null])).toEqual([null, null])
    expect(datetimeSerialize([undefined, undefined])).toEqual([undefined, undefined])
    expect(datetimeSerialize(['Invalid', 'Invalid'])!.every(item => item!.includes('Invalid Date')))
      .toBeTruthy()

    expect(datetimeSerialize('2008-08-08 20:08:08', DEFAULT_FORMATS_DATETIME.datetime))
      .toEqual('2008-08-08 20:08:08')
    expect(datetimeSerialize(['2008-08-08 20:08:08', '2008-08-08 21:08:08']))
      .toEqual(['2008-08-08', '2008-08-08'])
  })

  it('datetimeDeserialize', () => {
    expect(datetimeDeserialize(null)).toEqual(null)
    expect(datetimeDeserialize(undefined)).toEqual(null)
    expect(datetimeDeserialize('Invalid')?.toString()).toContain('Invalid Date')

    expect(datetimeDeserialize([null, null])).toEqual([null, null])
    expect(datetimeDeserialize([undefined, undefined])).toEqual([null, null])
    expect(datetimeDeserialize(['Invalid', 'Invalid'])!.every(item => item!.toString().includes('Invalid Date')))
      .toBeTruthy()

    expect(datetimeDeserialize('2008-08-08 20:08:08')!.format())
      .toEqual('2008-08-08T20:08:08+08:00')
    expect(datetimeDeserialize(['2008-08-08 20:08:08', '2008-08-08 21:08:08'])!.map(item => item!.format()))
      .toEqual(['2008-08-08T20:08:08+08:00', '2008-08-08T21:08:08+08:00'])
  })
})
