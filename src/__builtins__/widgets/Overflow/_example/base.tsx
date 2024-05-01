import { useState } from 'react'
import { Button, Dropdown, Popover, Slider, Tag } from 'antd'

import { Overflow } from '../'

function createTagItem({ key, closable, children }) {
  return (
    <Tag key={key} closable={closable}>{children}</Tag>
  )
}

function createButtonItem({ key, children }) {
  return (
    <Button key={key} type="primary" size="small" style={{ marginRight: 8 }}>{children}</Button>
  )
}

const App: React.FC = (props) => {
  const [width, setWidth] = useState(39)
  const [width2, setWidth2] = useState(300)

  const options = [
    { value: 'HTML1', label: 'HTML1' },
    { value: 'HTML2', label: 'HTML2' },
    { value: 'HTML3', label: 'HTML3' },
    { value: 'HTML4', label: 'HTML4' },
    { value: 'HTML5', label: 'HTML5' },
    { value: 'HTML6', label: 'HTML6' },
    { value: 'HTML7', label: 'HTML7' },
  ]
  return (
    <div {...props}>
      <p>
        滑动改变宽度，通过 `style.width: $
        {width}
        %` 设置容器宽度:
      </p>
      <Slider value={width} onChange={setWidth} />

      <p>Tag + rest固定宽度: </p>
      <Overflow
        style={{ width: `${width}%`, outline: '1px solid #f00', display: 'inline-flex', overflow: 'hidden' }}
        content={options.map(item => <span key={item.value}>{createTagItem({ key: item.value, closable: true, children: item.value })}</span>)}
        restContent={<span><Tag>更多</Tag></span>}
      >
        {
          (index) => {
            const itemList = options
              .filter((_item, idx) => idx < index)
              .map(item => createTagItem({ key: item.value, closable: true, children: item.value }))

            const restList = options.filter((_item, idx) => idx >= index)
            const restDom = restList.length <= 0
              ? null
              : (
                <Popover
                  trigger="hover"
                  content={restList.map(item => createTagItem({ key: item.value, closable: true, children: item.value }))}
                >
                  <Tag key="rest">更多</Tag>
                </Popover>
                )

            return [itemList, restDom]
          }
        }
      </Overflow>

      <p>Tag + rest动态宽度: </p>
      <Overflow
        style={{ width: `${width}%`, outline: '1px solid #f00', display: 'inline-flex', overflow: 'hidden' }}
        content={options.map(item => <span key={item.value}>{createTagItem({ key: item.value, closable: true, children: item.value })}</span>)}
        restContent={(len) => {
          return len.toString().split('').map((_item, idx) => {
            const placeholder = String(9).repeat(idx + 1)
            return (<span key={placeholder}>{createTagItem({ key: placeholder, closable: false, children: placeholder })}</span>)
          })
        }}
      >
        {
          (index) => {
            const itemList = options
              .filter((_item, idx) => idx < index)
              .map(item => createTagItem({ key: item.value, closable: true, children: item.value }))

            const restList = options.filter((_item, idx) => idx >= index)
            const restDom = restList.length <= 0
              ? null
              : (
                <Popover
                  trigger="hover"
                  content={restList.map(item => createTagItem({ key: item.value, closable: true, children: item.value }))}
                >
                  <Tag key="rest">{`+${restList.length}`}</Tag>
                </Popover>
                )

            return [itemList, restDom]
          }
        }
      </Overflow>

      <p>Button + rest固定宽度: </p>
      <Overflow
        style={{ width: `${width}%`, outline: '1px solid #f00', display: 'inline-flex', overflow: 'hidden' }}
        content={options.map(item => <span key={item.value}>{createButtonItem({ key: item.value, children: item.value })}</span>)}
        restContent={<span><Dropdown.Button type="primary" size="small" style={{ marginRight: 8 }} menu={{ items: [] }}>更多</Dropdown.Button></span>}
      >
        {
          (index) => {
            const itemList = options
              .filter((_item, idx) => idx < index)
              .map(item => createButtonItem({ key: item.value, children: item.value }))

            const restList = options.filter((_item, idx) => idx >= index).map((item) => {
              return { ...item, key: item.value }
            })
            const restDom = restList.length <= 0
              ? null
              : <Dropdown.Button key="rest" type="primary" size="small" style={{ marginRight: 8 }} menu={{ items: restList }}>更多</Dropdown.Button>

            return [itemList, restDom]
          }
        }
      </Overflow>

      <hr style={{ margin: '24px 0' }} />

      <p>
        滑动改变宽度，传入 `props.maxWidth=
        {width2}
        ` 即可，而不设置容器的宽度 (注意需传入准确的 px 宽度):
      </p>
      <Slider min={0} max={500} value={width2} onChange={setWidth2} />

      <Overflow
        style={{ width: 'fit-content', outline: '1px solid #f00', display: 'inline-flex', overflow: 'hidden' }}
        maxWidth={width2}
        content={options.map(item => <span key={item.value}>{createButtonItem({ key: item.value, children: item.value })}</span>)}
        restContent={<span><Dropdown.Button type="primary" size="small" style={{ marginRight: 8 }} menu={{ items: [] }}>更多</Dropdown.Button></span>}
      >
        {
          (index) => {
            const itemList = options
              .filter((_item, idx) => idx < index)
              .map(item => createButtonItem({ key: item.value, children: item.value }))

            const restList = options.filter((_item, idx) => idx >= index).map((item) => {
              return { ...item, key: item.value }
            })
            const restDom = restList.length <= 0
              ? null
              : <Dropdown.Button key="rest" type="primary" size="small" style={{ marginRight: 8 }} menu={{ items: restList }}>更多</Dropdown.Button>

            return [itemList, restDom]
          }
        }
      </Overflow>
    </div>
  )
}

export default App
