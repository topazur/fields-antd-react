import { Col, Row } from '../'

import type React from 'react'

const style: React.CSSProperties = { background: '#0092ff', textAlign: 'center' }

const App: React.FC = (props) => {
  return (
    <div {...props}>
      <Row>
        <Col style={{ ...style, opacity: 0.8 }} span={24}>col</Col>
      </Row>
      <Row>
        <Col style={{ ...style, opacity: 0.8 }} span={12}>col-12</Col>
        <Col style={style} span={12}>col-12</Col>
      </Row>
      <Row>
        <Col style={{ ...style, opacity: 0.8 }} span={8}>col-8</Col>
        <Col style={style} span={8}>col-8</Col>
        <Col style={{ ...style, opacity: 0.8 }} span={8}>col-8</Col>
      </Row>
      <Row>
        <Col style={{ ...style, opacity: 0.8 }} span={6}>col-6</Col>
        <Col style={style} span={6}>col-6</Col>
        <Col style={{ ...style, opacity: 0.8 }} span={6}>col-6</Col>
        <Col style={style} span={6}>col-6</Col>
      </Row>
    </div>
  )
}

export default App
