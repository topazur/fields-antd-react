import { describe, expect, it } from 'vitest'
import _dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import isoWeek from 'dayjs/plugin/isoWeek'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import weekYear from 'dayjs/plugin/weekYear'
import advancedFormat from 'dayjs/plugin/advancedFormat'
// import { INVALID_DATE_STRING, S } from 'dayjs/esm/constant'

const INVALID_DATE_STRING = 'Invalid Date'

// eslint-disable-next-line no-lone-blocks
{
  _dayjs.extend(utc)
  _dayjs.extend(timezone)
  _dayjs.extend(isoWeek)
  _dayjs.extend(weekOfYear)
  _dayjs.extend(weekYear)
  _dayjs.extend(advancedFormat)

  // ========================== 结论: setDefault 是设置局部变量 或 自己全局维护响应式时区变量
  // 将默认时区从本地时区变为自定义时区
  _dayjs.tz.setDefault('Asia/Shanghai')
  // 重置默认时区 <不会影响已构造的 dayjs 对象>
  // dayjs.tz.setDefault()
}

describe('测试 dayjs 库的用法', () => {
  it('date.toXXX', () => {
    const d20080808 = new Date('2008-08-08 20:00:00')
    const dateToXXX = {
      toDateString: d20080808.toDateString(),
      toISOString: d20080808.toISOString(),
      toJSON: d20080808.toJSON(),
      toLocaleDateString: d20080808.toLocaleDateString(),
      toLocaleString: d20080808.toLocaleString(),
      toLocaleTimeString: d20080808.toLocaleTimeString(),
      toString: d20080808.toString(),
      toTimeString: d20080808.toTimeString(),
      toUTCString: d20080808.toUTCString(),
    }
    expect(dateToXXX).toEqual({
      toDateString: 'Fri Aug 08 2008',
      toISOString: '2008-08-08T12:00:00.000Z',
      toJSON: '2008-08-08T12:00:00.000Z',
      toLocaleDateString: '2008/8/8',
      toLocaleString: '2008/8/8 20:00:00',
      toLocaleTimeString: '20:00:00',
      toString: 'Fri Aug 08 2008 20:00:00 GMT+0800 (中国标准时间)',
      toTimeString: '20:00:00 GMT+0800 (中国标准时间)',
      toUTCString: 'Fri, 08 Aug 2008 12:00:00 GMT',
    })
  })

  it('dayjs with plugins - format', () => {
    const d20080808 = _dayjs('2008-08-08 08:08:08')

    // 年
    expect(d20080808.format('[YY:]YY[; YYYY:]YYYY'))
      .toEqual('YY:08; YYYY:2008')
    // 季度 (Q 依赖 advanced-format 插件)
    expect(d20080808.format('[Q:]Q'))
      .toEqual('Q:3')
    // 月
    expect(d20080808.format('[M:]M[; MM:]MM[; MMM:]MMM[; MMMM:]MMMM'))
      .toEqual('M:8; MM:08; MMM:Aug; MMMM:August')
    // 日 (Do 依赖 advanced-format 插件)
    expect(d20080808.format('[D:]D[; DD:]DD[; Do:]Do'))
      .toEqual('D:8; DD:08; Do:8th')
    // 星期
    expect(d20080808.format('[d:]d[; dd:]dd[; ddd:]ddd[; dddd:]dddd'))
      .toEqual('d:5; dd:Fr; ddd:Fri; dddd:Friday')

    // 小时 (k/kk 依赖 advanced-format 插件)
    expect(d20080808.hour(9).format('[H:]H[; HH:]HH'))
      .toEqual('H:9; HH:09')
    expect(d20080808.hour(14).format('[H:]H[; HH:]HH'))
      .toEqual('H:14; HH:14')
    expect(d20080808.hour(14).format('[h:]h[; hh:]hh'))
      .toEqual('h:2; hh:02')
    expect(d20080808.hour(24).format('[k:]k[; kk:]kk'))
      .toEqual('k:24; kk:24')

    // 分钟/秒/毫秒/时间戳 (X/x 依赖 advanced-format 插件)
    expect(d20080808.format('[m:]m[; mm:]mm'))
      .toEqual('m:8; mm:08')
    expect(d20080808.format('[s:]s[; ss:]ss[; SSS:]SSS'))
      .toEqual('s:8; ss:08; SSS:000')
    expect(_dayjs().format('[X:]X[; x:]x'))
      .toMatch(/^X:\d{10}; x:\d{13}$/)

    // 上午/下午
    expect(d20080808.hour(7).format('[A:]A[; a:]a'))
      .toEqual('A:AM; a:am')
    expect(d20080808.hour(7 + 12).format('[A:]A[; a:]a'))
      .toEqual('A:PM; a:pm')

    // 获取 UTC 偏移量、偏移量的缩写、偏移量的全名 - 防止本地时区不对导致测试失败，特意指定时区
    // (z/zzz 依赖 Timezone 插件)
    expect(_dayjs().tz('Asia/Shanghai').format('[Z:]Z[; ZZ:]ZZ[; z:]z[; zzz:]zzz'))
      .toEqual('Z:+08:00; ZZ:+0800; z:GMT+8; zzz:China Standard Time')

    // 小写 w 是当前时区的周数，而大写则是 ISO 周数
    const dgmt8_0107 = _dayjs.tz('2008-01-07 7:11:11', 'Asia/Shanghai')
    const dutc_0106 = dgmt8_0107.clone().utc()
    expect({
      dgmt8_0107_1: dgmt8_0107.format(),
      dgmt8_0107_2: dgmt8_0107.format('YYYY-MM-DD [w:]w[; ww:]ww[; wo:]wo[; W:]W[; WW:]WW'),
      dutc_0106_1: dutc_0106.format(),
      dutc_0106_2: dutc_0106.format('YYYY-MM-DD [w:]w[; ww:]ww[; wo:]wo[; W:]W[; WW:]WW'),
    }).toEqual({
      dgmt8_0107_1: '2008-01-07T07:11:11+08:00',
      dgmt8_0107_2: '2008-01-07 w:2; ww:02; wo:2nd; W:2; WW:02',
      // NOTICE: 当对 utc 时间计算周数时，w仍计算本地时区，而W计算的是utc格式的周数
      dutc_0106_1: '2008-01-06T23:11:11+00:00',
      dutc_0106_2: '2008-01-06 w:2; ww:02; wo:2nd; W:1; WW:01',
    })

    // 满 53 个周即算一年
    const dgmt8_20081228 = _dayjs.tz('2008-12-28 7:11:11', 'Asia/Shanghai')
    expect(dgmt8_20081228.format('YYYY-MM-DD [gggg:]gggg[; GGGG:]GGGG')).toEqual('2008-12-28 gggg:2009; GGGG:2008')
    const dgmt8_20071231 = _dayjs.tz('2007-12-31 7:11:11', 'Asia/Shanghai').utc()
    expect(dgmt8_20071231.format('YYYY-MM-DD [gggg:]gggg[; GGGG:]GGGG')).toEqual('2007-12-30 gggg:2008; GGGG:2007')
  })

  it('初始化 dayjs 对象，以及常用方法', () => {
    // 1. 参数 null 解析后是无效的时间
    const dNull = _dayjs(null)
    expect(dNull.toString()).toEqual(INVALID_DATE_STRING)

    // 2. 参数 undefined 解析后是当前的时间
    const dUndefined = _dayjs(undefined)
    expect(dUndefined.isSame(new Date(), 'second')).toBeTruthy()

    const d2008 = _dayjs('2008-08-08 08:08:08')
    // 3. toISOString 函数 => 等价于默认 template 为 'YYYY-MM-DDTHH:mm:ss.SSS[Z]' 的 format 函数，格式化后是 utc 时区的时间字符串
    expect(d2008.toISOString()).toEqual('2008-08-08T00:08:08.000Z')
    // 3. toJSON 是 toISOString 的包装函数 => this.isValid() ? this.toISOString() : null;
    expect(d2008.toJSON()).toEqual('2008-08-08T00:08:08.000Z')
    // 3. format 函数默认 template 为 FORMAT_DEFAULT，格式化后是当前时区的时间字符串
    // 由于 `FORMAT_DEFAULT = 'YYYY-MM-DDTHH:mm:ssZ'` 没毫秒，所以格式化的结果也没有毫秒
    expect(d2008.format()).toEqual('2008-08-08T08:08:08+08:00')
    // 3. 当 utc 函数传入 keepLocalTime 为 true 时，不发生偏移
    expect(d2008.utc(true).format()).toEqual('2008-08-08T08:08:08+00:00')
    expect(d2008.utc(false).format()).toEqual('2008-08-08T00:08:08+00:00')

    const dZone = _dayjs()
    // 4. 返回用户当前时区
    expect(_dayjs.tz.guess()).toBeTypeOf('string')
    // 4. 返回 UTC 偏移量 (单位: 分钟)
    expect(Math.abs(dZone.utcOffset())).toEqual(Math.abs(new Date().getTimezoneOffset()))

    // 4. 使用给定时区解析日期时间字符串并返回 Day.js 对象实例
    expect(_dayjs.tz('2008-08-08 00:08:08.000').format()).toEqual('2008-08-08T00:08:08+08:00')
    expect(_dayjs.tz('2008-08-08T00:08:08.000Z', 'Asia/Shanghai').format()).toEqual('2008-08-08T00:08:08+08:00')
    // 4. 初始化时是默认的本地时区，再转换到对应时区并更新 UTC 偏移量
    expect(_dayjs('2008-08-08T00:08:08.000Z').tz('Asia/Shanghai').format()).toEqual('2008-08-08T08:08:08+08:00')
  })
})
