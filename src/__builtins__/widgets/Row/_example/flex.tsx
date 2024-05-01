import { Divider } from 'antd'

import { Col, Row } from '../'

import type React from 'react'

const style: React.CSSProperties = { background: '#0092ff', textAlign: 'center' }

const App: React.FC = (props) => {
  return (
    <div {...props}>
      <Divider orientation="left">1. 百分比</Divider>
      <Row>
        <Col style={{ ...style, opacity: 0.8 }} flex={2}>2 / 5</Col>
        <Col style={style} flex={3}>3 / 5</Col>
      </Row>

      <Divider orientation="left">2. 填充</Divider>
      <Row>
        <Col style={{ ...style, opacity: 0.6 }} flex="200px">固定宽度 - `200px`</Col>
        <Col style={{ ...style, opacity: 0.8 }} flex="none">当前内容宽度 - `none`</Col>
        <Col style={style} flex="auto">填充剩余宽度 - `auto`</Col>
      </Row>

      <Divider orientation="left">3. 聚合样式</Divider>
      <Row>
        <Col style={{ ...style, opacity: 0.8 }} flex="1 1 200px">`flex-grow: 1` - `1 1 200px`</Col>
        <Col style={style} flex="0 1 300px">`flex-grow: 0` - `0 1 300px`</Col>
      </Row>

      <Divider orientation="left">4. 响应式</Divider>
      <Row>
        {Array.from({ length: 8 }).fill(0).map((_, index) => {
          const key = `col-${index}`
          return (
            <Col
              key={key}
              flex={['100%', '50%', '40%', '20%', '10%']}
              style={{ ...style, opacity: 0.1 * index + 0.3 }}
            >
              Col-
              {index}
            </Col>
          )
        })}
      </Row>
    </div>
  )
}

export default App
