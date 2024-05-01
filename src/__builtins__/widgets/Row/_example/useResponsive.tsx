import { useResponsive, useSize } from '../../../hooks'

import type React from 'react'

const App: React.FC = (props) => {
  // 监听容器尺寸断点
  const breakpointSize = useSize(document.querySelector('body'))
  const result = useResponsive(breakpointSize?.width, undefined)

  return (
    <div {...props}>
      <p>监听 document 的断点尺寸变化:</p>
      <code>
        {JSON.stringify(result, null, 2)}
      </code>
    </div>
  )
}

export default App
