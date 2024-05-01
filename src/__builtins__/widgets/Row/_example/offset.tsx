import { Divider } from 'antd'

import { Col, Row } from '../'

import type React from 'react'

const style: React.CSSProperties = { background: '#0092ff', textAlign: 'center' }

const App: React.FC = (props) => {
  return (
    <div {...props}>
      <Row>
        <Col style={style} span={8}>col-8</Col>
        <Col style={style} span={8} offset={8}>
          col-8 col-offset-8
        </Col>
      </Row>

      <Row>
        <Col style={style} span={6} offset={6}>
          col-6 col-offset-6
        </Col>
        <Col style={style} span={6} offset={6}>
          col-6 col-offset-6
        </Col>
      </Row>

      <Row>
        <Col style={style} span={12} offset={6}>
          col-12 col-offset-6
        </Col>
      </Row>

      <Divider orientation="left">Responsive 支持响应式</Divider>
      <Row>
        <Col style={{ ...style, opacity: 0.6 }} span={[5, 6]} offset={[1, 2]}>Col</Col>
        <Col style={{ ...style, opacity: 0.8 }} span={[11, 6]} offset={[1, 2]}>Col</Col>
        <Col style={style} span={[5, 6]} offset={[6, 2]}>Col</Col>
      </Row>

    </div>
  )
}

export default App
