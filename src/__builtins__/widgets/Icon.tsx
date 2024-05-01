import CheckCircleOutlined from '@ant-design/icons/CheckCircleOutlined'
import CloseCircleOutlined from '@ant-design/icons/CloseCircleOutlined'
import ExclamationCircleOutlined from '@ant-design/icons/ExclamationCircleOutlined'
import QuestionCircleOutlined from '@ant-design/icons/QuestionCircleOutlined'
import LoadingOutlined from '@ant-design/icons/LoadingOutlined'

export const ErrorIcon = CloseCircleOutlined
export const SuccessIcon = CheckCircleOutlined
export const WarningIcon = ExclamationCircleOutlined
export const TooltipIcon = QuestionCircleOutlined
export const LoadingIcon = LoadingOutlined

export const createErrorIcon = () => <CloseCircleOutlined />
export const createSuccessIcon = () => <CheckCircleOutlined />
export const createWarningIcon = () => <ExclamationCircleOutlined />
export const createTooltipIcon = () => <QuestionCircleOutlined />
export const createLoadingIcon = () => <LoadingOutlined />