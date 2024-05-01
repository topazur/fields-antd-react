import { Divider } from 'antd'

import { Col, Row } from '../'

import type React from 'react'

const style: React.CSSProperties = { background: '#0092ff', textAlign: 'center' }

const App: React.FC = (props) => {
  return (
    <div {...props}>
      <Divider orientation="left">1. justify-start =&gt; justify-content: flex-start;</Divider>
      <Row justify="start">
        <Col style={{ ...style, opacity: 0.4 }} span={4}>col-4</Col>
        <Col style={{ ...style, opacity: 0.6 }} span={4}>col-4</Col>
        <Col style={{ ...style, opacity: 0.8 }} span={4}>col-4</Col>
        <Col style={style} span={4}>col-4</Col>
      </Row>

      <Divider orientation="left">2. justify-center =&gt; justify-content: center;</Divider>
      <Row justify="center">
        <Col style={{ ...style, opacity: 0.4 }} span={4}>col-4</Col>
        <Col style={{ ...style, opacity: 0.6 }} span={4}>col-4</Col>
        <Col style={{ ...style, opacity: 0.8 }} span={4}>col-4</Col>
        <Col style={style} span={4}>col-4</Col>
      </Row>

      <Divider orientation="left">3. justify-end =&gt; justify-content: flex-end;</Divider>
      <Row justify="end">
        <Col style={{ ...style, opacity: 0.4 }} span={4}>col-4</Col>
        <Col style={{ ...style, opacity: 0.6 }} span={4}>col-4</Col>
        <Col style={{ ...style, opacity: 0.8 }} span={4}>col-4</Col>
        <Col style={style} span={4}>col-4</Col>
      </Row>

      <Divider orientation="left">4. justify-between =&gt; justify-content: space-between;</Divider>
      <Row justify="between">
        <Col style={{ ...style, opacity: 0.4 }} span={4}>col-4</Col>
        <Col style={{ ...style, opacity: 0.6 }} span={4}>col-4</Col>
        <Col style={{ ...style, opacity: 0.8 }} span={4}>col-4</Col>
        <Col style={style} span={4}>col-4</Col>
      </Row>

      <Divider orientation="left">5. justify-around =&gt; justify-content: space-around;</Divider>
      <Row justify="around">
        <Col style={{ ...style, opacity: 0.4 }} span={4}>col-4</Col>
        <Col style={{ ...style, opacity: 0.6 }} span={4}>col-4</Col>
        <Col style={{ ...style, opacity: 0.8 }} span={4}>col-4</Col>
        <Col style={style} span={4}>col-4</Col>
      </Row>

      <Divider orientation="left">6. justify-evenly =&gt; justify-content: space-evenly;</Divider>
      <Row justify="evenly">
        <Col style={{ ...style, opacity: 0.4 }} span={4}>col-4</Col>
        <Col style={{ ...style, opacity: 0.6 }} span={4}>col-4</Col>
        <Col style={{ ...style, opacity: 0.8 }} span={4}>col-4</Col>
        <Col style={style} span={4}>col-4</Col>
      </Row>
    </div>
  )
}

export default App
