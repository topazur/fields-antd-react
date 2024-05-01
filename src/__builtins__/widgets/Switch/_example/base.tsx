import { Divider } from 'antd'

import { Switch } from '../'

import type React from 'react'

const App: React.FC = (props) => {
  return (
    <div {...props}>
      <div>
        <Divider orientation="left">props.type="switch"</Divider>
        <Switch
          activeValue="true"
          inactiveValue="false"
          checkedChildren="选中"
          unCheckedChildren="未选中"
        />
      </div>

      <div>
        <Divider orientation="left">props.type="checkbox"</Divider>
        <Switch
          type="checkbox"
          activeValue="true"
          inactiveValue="false"
          checkedChildren="选中"
          unCheckedChildren="未选中"
        />
      </div>
    </div>
  )
}

export default App
