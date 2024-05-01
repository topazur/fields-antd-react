// export var REGEX_PARSE = /^(\d{4}) ?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/;
// export var REGEX_FORMAT = /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g;

/**
 * @title 允许时间解析的字符串格式
 * @description 允许 ISO、年月日、年月日时分秒
 */
export const REGEX_DATETIME_PARSE = /^(\d{4})[-/](\d{1,2})[-/](\d{1,2})[Tt\s](\d{1,2}):(\d{1,2}):(\d{1,2})[.:]?(\d+)?([-+]\d{2}:?\d{2}|z|Z)?$/
