import { Divider } from 'antd'

import { Col, Row } from '../'

import type React from 'react'

const style: React.CSSProperties = { background: '#0092ff', textAlign: 'center' }

const App: React.FC = (props) => {
  return (
    <div {...props}>
      <Divider orientation="left">1. 通过使用 push 和 pull 类就可以很容易的改变列（column）的顺序。</Divider>
      <p>向右侧偏移右侧的列数，变成了右侧；向左侧偏移左侧的列数，变成了左侧。</p>
      <Row>
        <Col style={{ ...style, opacity: 0.8 }} span={18} push={6}>
          col-18 col-push-6
        </Col>
        <Col style={style} span={6} pull={18}>
          col-6 col-pull-18
        </Col>
      </Row>

      <Divider orientation="left">2. Normal</Divider>
      <Row>
        <Col style={{ ...style, opacity: 0.8 }} span={6} order={4}>
          1 col-order-4
        </Col>
        <Col style={style} span={6} order={3}>
          2 col-order-3
        </Col>
        <Col style={{ ...style, opacity: 0.8 }} span={6} order={2}>
          3 col-order-2
        </Col>
        <Col style={style} span={6} order={1}>
          4 col-order-1
        </Col>
      </Row>

      <Divider orientation="left">3. Responsive 支持响应式</Divider>
      <Row>
        <Col style={{ ...style, opacity: 0.4 }} span={6} order={[1, 2, 3, 4]}>
          1 col-order-responsive
        </Col>
        <Col style={{ ...style, opacity: 0.6 }} span={6} order={[2, 1, 4, 3]}>
          2 col-order-responsive
        </Col>
        <Col style={{ ...style, opacity: 0.8 }} span={6} order={[3, 4, 2, 1]}>
          3 col-order-responsive
        </Col>
        <Col style={style} span={6} order={[4, 3, 1, 2]}>
          4 col-order-responsive
        </Col>
      </Row>
    </div>
  )
}

export default App
