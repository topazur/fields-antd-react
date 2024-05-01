import { Button, Divider, Input, InputNumber } from 'antd'

import { Space } from '../'

import type React from 'react'

const App: React.FC = (props) => {
  return (
    <div {...props}>
      <Divider orientation="left">水平间距布局</Divider>
      <Space>
        <Input style={{ width: '100px' }} defaultValue="1" />
        <InputNumber style={{ width: '100px' }} defaultValue="2" />
        <Input style={{ width: '100px' }} defaultValue="3" />
      </Space>

      <Divider orientation="left">垂直间距布局</Divider>
      <Space direction="vertical">
        <Input style={{ width: '100px' }} defaultValue="1" />
        <InputNumber style={{ width: '100px' }} defaultValue="2" />
        <Input style={{ width: '100px' }} defaultValue="3" />
      </Space>

      <Divider orientation="left">对齐模式</Divider>
      <div style={{ display: 'flex', overflowX: 'auto', columnGap: '8px' }}>
        <div className="space-align-item" style={{ border: '1px solid #000' }}>
          <Space items="start">
            start
            <Button type="primary">Primary</Button>
            <span className="mock-block" style={{ display: 'inline-block', padding: '32px 8px 16px', background: '#ccc' }}>Block</span>
          </Space>
        </div>
        <div className="space-align-item" style={{ border: '1px solid #000' }}>
          <Space items="center">
            center
            <Button type="primary">Primary</Button>
            <span className="mock-block" style={{ display: 'inline-block', padding: '32px 8px 16px', background: '#ccc' }}>Block</span>
          </Space>
        </div>
        <div className="space-align-item" style={{ border: '1px solid #000' }}>
          <Space items="end">
            end
            <Button type="primary">Primary</Button>
            <span className="mock-block" style={{ display: 'inline-block', padding: '32px 8px 16px', background: '#ccc' }}>Block</span>
          </Space>
        </div>
        <div className="space-align-item" style={{ border: '1px solid #000' }}>
          <Space items="baseline">
            baseline
            <Button type="primary">Primary</Button>
            <span className="mock-block" style={{ display: 'inline-block', padding: '32px 8px 16px', background: '#ccc' }}>Block</span>
          </Space>
        </div>
      </div>

      <Divider orientation="left">分隔符</Divider>
      <Space split={<Divider type="vertical" />}>
        <Input style={{ width: '100px' }} defaultValue="1" />
        <InputNumber style={{ width: '100px' }} defaultValue="2" />
        <Input style={{ width: '100px' }} defaultValue="3" />
      </Space>

      <Divider orientation="left">紧凑布局组合</Divider>
      <div style={{ display: 'flex', flexWrap: 'wrap', rowGap: '8px' }}>
        <Space gap={0} style={{ width: '100%' }}>
          <Input style={{ width: '100px' }} defaultValue="1" />
          <InputNumber style={{ width: '100px' }} defaultValue="2" />
          <Input style={{ width: '100px' }} defaultValue="3" />
        </Space>
        <Space gap={0} style={{ width: '100%' }}>
          <Button>Button 1</Button>
          <Button>Button 2</Button>
          <Button>Button 3</Button>
        </Space>
      </div>

      <Divider orientation="left">垂直方向紧凑布局</Divider>
      <div style={{ display: 'flex', columnGap: '8px' }}>
        <Space direction="vertical" gap={0}>
          <Input style={{ width: '100px' }} defaultValue="1" />
          <InputNumber style={{ width: '100px' }} defaultValue="2" />
          <Input style={{ width: '100px' }} defaultValue="3" />
        </Space>
        <Space direction="vertical" gap={0}>
          <Button>Button 1</Button>
          <Button>Button 2</Button>
          <Button>Button 3</Button>
        </Space>
      </div>
    </div>
  )
}

export default App
