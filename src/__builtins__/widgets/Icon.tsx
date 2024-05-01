/* eslint-disable import/order */

// 状态类型图标
import CheckCircleOutlined from '@ant-design/icons/CheckCircleOutlined'
import CloseCircleOutlined from '@ant-design/icons/CloseCircleOutlined'
import ExclamationCircleOutlined from '@ant-design/icons/ExclamationCircleOutlined'

// 上下左右方向图标
import LeftOutlined from '@ant-design/icons/LeftOutlined'
import RightOutlined from '@ant-design/icons/RightOutlined'
import UpOutlined from '@ant-design/icons/UpOutlined'
import DownOutlined from '@ant-design/icons/DownOutlined'

// 其他辅助图标
import QuestionCircleOutlined from '@ant-design/icons/QuestionCircleOutlined'
import LoadingOutlined from '@ant-design/icons/LoadingOutlined'
import SearchOutlined from '@ant-design/icons/SearchOutlined'
import ExpandOutlined from '@ant-design/icons/ExpandOutlined'

export const ErrorIcon = CloseCircleOutlined
export const SuccessIcon = CheckCircleOutlined
export const WarningIcon = ExclamationCircleOutlined

export const LeftOutlinedIcon = LeftOutlined
export const RightOutlinedIcon = RightOutlined
export const UpOutlinedIcon = UpOutlined
export const DownOutlinedIcon = DownOutlined

export const TooltipIcon = QuestionCircleOutlined
export const LoadingIcon = LoadingOutlined
export const SearchOutlinedIcon = SearchOutlined
export const ExpandOutlinedIcon = ExpandOutlined

export const createTooltipIcon = () => <QuestionCircleOutlined />
export const createLoadingIcon = () => <LoadingOutlined />
