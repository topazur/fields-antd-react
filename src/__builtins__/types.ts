/**
 * @title 允许类型可能是 null 或者 undefined
 */
export type AllowNullUndefined<T = any> = T | null | undefined

/**
 * @title 排除当前类型可能是 null 或者 undefined
 * @description `type Exclude<T, U> = T extends U ? never : T;` => 返回 never 类型，即排除该类型；否则返回原始类型 T。
 * @description 等价于 NonNullable, 因为 `null & {}` 或 `undefined & {}` 结果是 never，所以导致 `T & {}` 排除了 `null` 和 `undefined`
 */
export type DisallowNullUndefined<T = any> = Exclude<T, null | undefined>

export type LiteralUnion<T extends string> = T | NonNullable<string>

/**
 * @title 普通的对象，key可能是 string | number | symbol
 */
export type AnyObject = Record<PropertyKey, any>

/**
 * @title 抹平 formilyjs 和 antd 的类型差异
 * @notice 在 antd 中 middle 表示中等
 * @description 在传入最终控件内部之前修复该差异，对应用层可以更加宽容
 */
export type SizeType = 'small' | 'default' | 'large'
export type StatusType = 'default' | 'success' | 'warning' | 'error'
