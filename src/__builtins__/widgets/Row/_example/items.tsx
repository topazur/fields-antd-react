import { Divider } from 'antd'

import { Col, Row } from '../'

import type React from 'react'

const style: React.CSSProperties = { background: '#0092ff', textAlign: 'center' }

const App: React.FC = (props) => {
  return (
    <div {...props}>
      <Divider orientation="left">1. items-start =&gt; align-items: flex-start;</Divider>
      <Row justify="center" items="start">
        <Col style={{ ...style, opacity: 0.4, height: 80 }} span={4}>col-4</Col>
        <Col style={{ ...style, opacity: 0.6, height: 100 }} span={4}>col-4</Col>
        <Col style={{ ...style, opacity: 0.8, height: 50 }} span={4}>col-4</Col>
        <Col style={style} span={4}>col-4</Col>
      </Row>

      <Divider orientation="left">2. items-center =&gt; align-items: center;</Divider>
      <Row justify="center" items="center">
        <Col style={{ ...style, opacity: 0.4, height: 80 }} span={4}>col-4</Col>
        <Col style={{ ...style, opacity: 0.6, height: 100 }} span={4}>col-4</Col>
        <Col style={{ ...style, opacity: 0.8, height: 50 }} span={4}>col-4</Col>
        <Col style={style} span={4}>col-4</Col>
      </Row>

      <Divider orientation="left">3. items-end =&gt; align-items: flex-end;</Divider>
      <Row justify="center" items="end">
        <Col style={{ ...style, opacity: 0.4, height: 80 }} span={4}>col-4</Col>
        <Col style={{ ...style, opacity: 0.6, height: 100 }} span={4}>col-4</Col>
        <Col style={{ ...style, opacity: 0.8, height: 50 }} span={4}>col-4</Col>
        <Col style={style} span={4}>col-4</Col>
      </Row>
    </div>
  )
}

export default App
