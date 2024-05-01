import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import weekYear from 'dayjs/plugin/weekYear'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { isFunction } from 'radash'

import type { ConfigType, Dayjs } from 'dayjs'
import type { AllowNullUndefined } from '../types'

// eslint-disable-next-line no-lone-blocks
{
  dayjs.extend(customParseFormat)
  dayjs.extend(advancedFormat)
  dayjs.extend(weekYear)
  dayjs.extend(weekOfYear)
  dayjs.extend(timezone)
  dayjs.extend(utc)
}

// import { INVALID_DATE_STRING } from 'dayjs/esm/constant'
const INVALID_DATE_STRING = 'Invalid Date'

/**
 * @title 支持的格式化占位符列表
 * 内置: https://day.js.org/docs/zh-CN/display/format
 * 插件额外支持: https://day.js.org/docs/zh-CN/plugin/advanced-format
 */
export const datetimeFormat = {
  YY: 'YY', // 后两位数的年份
  YYYY: 'YYYY', // 四位数的年份
  M: 'M', // 不补零月份 (eg: 1->12)
  MM: 'MM', // 两位数月份 (eg: 01->12)
  MMM: 'MMM', // 缩写的月份名称 (eg: Jan->Dec)
  MMMM: 'MMMM', // 完整的月份名称 (eg: January->December)
  D: 'D', // 不补零月份里的一天 (eg: 1->31)
  DD: 'DD', // 两位数月份里的一天 (eg: 01->31)
  d: 'd', // 数字表示一周中的一天，星期天是 0 (eg: 0->6)
  dd: 'dd', // 最简写的星期几 (eg: Su->Sa)
  ddd: 'ddd', // 简写的星期几 (eg: Sun->Sat)
  dddd: 'dddd', // 星期几 (eg: Sunday->Saturday)
  H: 'H', // 不补零小时 - 24小时制 (eg: 0->23)
  HH: 'HH', // 两位数小时 - 24小时制 (eg: 00->23)
  h: 'h', // 不补零小时 - 12小时制 (eg: 1->12)
  hh: 'hh', // 两位数小时 - 12小时制 (eg: 01->12)
  m: 'm', // 不补零分钟 (eg: 0->59)
  mm: 'mm', // 两位数分钟 (eg: 00->59)
  s: 's', // 不补零秒钟 (eg: 0->59)
  ss: 'ss', // 两位数秒钟 (eg: 00->59)
  SSS: 'SSS', // 三位数毫秒 (eg: 000->999)
  Z: 'Z', // UTC 的偏移量，±HH:mm (eg: +05:00) => 冒号分隔
  ZZ: 'ZZ', // UTC 的偏移量，±HHmm (eg: +0500) => 无冒号分隔
  A: 'A', // 大写 AM PM
  a: 'a', // 小写 am pm
  // ==============================
  Q: 'Q', // 季度 (eg: 1->4)
  Do: 'Do', // 带序数词的月份里的一天 (eg: 1st 2nd ... 31st)
  k: 'k', // 不补零小时 - 24小时制且不从0开始 (eg: 1->24)
  kk: 'kk', // 两位数小时 - 24小时制且不从0开始 (eg: 01->24)
  X: 'X', // 秒为单位的 Unix 时间戳
  x: 'x', // 毫秒单位的 Unix 时间戳
  w: 'w', // 不补零周数 (依赖 WeekOfYear 插件) - (eg: 1 2 ... 52 53)
  ww: 'ww', // 两位数周数 (依赖 WeekOfYear 插件) - (eg: 01 02 ... 52 53)
  wo: 'wo', // 带序号周数 (依赖 WeekOfYear 插件) - (eg: 1st 2nd ... 52nd 53rd)
  W: 'W', // 不补零周数 (依赖 IsoWeek 插件) - (eg: 1 2 ... 52 53)
  WW: 'WW', // 两位数周数 (依赖 IsoWeek 插件) - (eg: 01 02 ... 52 53)
  gggg: 'gggg', // 按周计算的年份 ( 依赖 WeekYear 插件 )
  GGGG: 'GGGG', // ISO 按周计算的年份 ( 依赖 IsoWeek 插件 )
  z: 'z', // UTC 偏移量的缩写 (依赖 Timezone 插件) - (eg: GMT+8)
  zzz: 'zzz', // UTC 偏移量的全名 (依赖 Timezone 插件) - (eg: China Standard Time)
}

export const DEFAULT_FORMATS_DATE = `${datetimeFormat.YYYY}-${datetimeFormat.MM}-${datetimeFormat.DD}`// 'YYYY-MM-DD'
export const DEFAULT_FORMATS_TIME = `${datetimeFormat.HH}:${datetimeFormat.mm}:${datetimeFormat.ss}` // 'HH:mm:ss'
export const DEFAULT_FORMATS_DATETIME = {
  date: DEFAULT_FORMATS_DATE,
  time: DEFAULT_FORMATS_TIME,
  datetime: `${DEFAULT_FORMATS_DATE} ${DEFAULT_FORMATS_TIME}`,
  iso: `${DEFAULT_FORMATS_DATE}T${DEFAULT_FORMATS_TIME}.${datetimeFormat.SSS}[Z]`,
  // 年份、季度、月份、周数
  year: datetimeFormat.YYYY,
  quarter: `${datetimeFormat.YYYY}-[Q]${datetimeFormat.Q}`, // YYYY-[Q]Q
  month: `${datetimeFormat.YYYY}-${datetimeFormat.MM}`, // YYYY-MM
  week: `${datetimeFormat.gggg}-${datetimeFormat.wo}`, // gggg-wo
}

// ============================================================

/**
 * @title 将各种可能的时间格式参数转化为 ISO 字符串
 * @param v 可能传入的时间格式
 * @param skipUndefined 跳过 undefined 是因为参数 undefined 解析后是当前的时间
 * @description 等价于 format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
 * @returns {string|null} 字符串
 */
export function toISOString(v: ConfigType, skipUndefined = true) {
  if (v === null) { return null }
  if (skipUndefined && v === undefined) { return null }

  return dayjs(v).toJSON()
}

/**
 * @title 将各种可能的时间格式参数格式化为时间字符串
 * @param v 可能传入的时间格式
 * @param skipUndefined 跳过 undefined 是因为参数 undefined 解析后是当前的时间
 * @returns {string|null} 字符串
 */
export function toFormatString(v: ConfigType, template?: string, skipUndefined = true) {
  if (v === null) { return null }
  if (skipUndefined && v === undefined) { return null }

  const d = dayjs(v, template)
  return d.isValid() ? d.format(template) : null
}

// ============================================================

/**
 * @title 单个时间或时间区间的类型
 * @notice // NOTICE: 元组类型不排除 null 和 undefined，为了兼容更多情况，使用时请根据组件库去适配
 * @example 例如 antd 是 Dayjs | null | undefined | [Dayjs | null | undefined, Dayjs | null | undefined]
 * @example 例如 element 是 Dayjs | [Dayjs, Dayjs]
 */
export type IDateValueType<DateType = ConfigType> = AllowNullUndefined<DateType> | [AllowNullUndefined<DateType>, AllowNullUndefined<DateType>]

/**
 * @title 内置工具函数，根据 format 时间格式化 (对 null 和 undefined 不解析，对非法时间不解析)
 */
function _singleDatetimeSerialize(
  value: AllowNullUndefined<ConfigType>,
  format: string | ((value: Dayjs) => string) = 'YYYY-MM-DD',
): AllowNullUndefined<string> {
  if (value == null) { return value }

  const d = dayjs(value)
  if (!d.isValid()) { return `${INVALID_DATE_STRING}\#${value.toString ? value.toString() : value}` }
  return isFunction(format) ? format(d) : d.format(format)
}

export function datetimeSerialize(value: AllowNullUndefined<ConfigType>, format?: string | ((value: Dayjs) => string)): string | null
export function datetimeSerialize(value: [AllowNullUndefined<ConfigType>, AllowNullUndefined<ConfigType>], format?: string | ((value: Dayjs) => string)): [string | null, string | null] | null
/**
 * @title 序列化时间
 * @param {IDateValueType} value 支持单个时间或时间区间两种格式
 * @param {string | Function} format 设置日期格式，为数组时支持多格式匹配，展示以第一个为准。<支持字符串或者函数类型>
 * @notice // NOTICE: 对于 null、undefined、invalid 都是原样返回，请在应用层处理这些边界情况
 * @returns {string | [string, string]} 字符串或字符串元组
 */
export function datetimeSerialize(
  value: IDateValueType,
  format: string | ((value: Dayjs) => string) = 'YYYY-MM-DD',
): any {
  if (Array.isArray(value)) {
    const start = _singleDatetimeSerialize(value[0], format)
    const end = _singleDatetimeSerialize(value[0], format)
    return [start, end]
  }

  return _singleDatetimeSerialize(value, format)
}

// ============================================================

export function datetimeDeserialize(value: AllowNullUndefined<ConfigType>, valueFormat?: string): Dayjs | null
export function datetimeDeserialize(value: [AllowNullUndefined<ConfigType>, AllowNullUndefined<ConfigType>], valueFormat?: string): [Dayjs | null, Dayjs | null] | null
/**
 * @title 反序列化
 * @description 对 null 和 undefined 不解析返回 null, 对于非法时间也返回 Dayjs 对象
 */
export function datetimeDeserialize(value: IDateValueType, valueFormat?: string): any {
  if (value == null) { return null }

  if (Array.isArray(value)) {
    const start = value[0] == null ? null : dayjs(value[0], valueFormat)
    const end = value[1] == null ? null : dayjs(value[1], valueFormat)
    return [start, end]
  }

  return dayjs(value, valueFormat)
}
