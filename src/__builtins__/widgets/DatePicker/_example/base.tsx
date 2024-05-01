import { Divider } from 'antd'
import { useSetState } from 'ahooks'

import { DatePicker, DateRangePicker } from '../'

import type React from 'react'

const App: React.FC = (props) => {
  // 自动合并对象
  const [state, setState] = useSetState<Record<string, any>>({})

  return (
    <div {...props}>
      <Divider orientation="left">props.picker="time"</Divider>
      <li>
        time's value:
        {state.time}
      </li>
      <DatePicker picker="time" onChange={date => setState({ time: date })} />
      <li>
        timeRange's value:
        {state.timeRange}
      </li>
      <DateRangePicker picker="time" onChange={dates => setState({ timeRange: `${dates?.[0]}至${dates?.[1]}` })} />

      <Divider orientation="left">props.picker="date"</Divider>
      <li>
        date's value:
        {state.date}
      </li>
      <DatePicker picker="date" onChange={date => setState({ date })} />
      <li>
        dateRange's value:
        {state.dateRange}
      </li>
      <DateRangePicker picker="date" onChange={dates => setState({ dateRange: `${dates?.[0]}至${dates?.[1]}` })} />

      <Divider orientation="left">props.picker="year"</Divider>
      <li>
        year's value:
        {state.year}
      </li>
      <DatePicker picker="year" onChange={date => setState({ year: date })} />
      <li>
        yearRange's value:
        {state.yearRange}
      </li>
      <DateRangePicker picker="year" onChange={dates => setState({ yearRange: `${dates?.[0]}至${dates?.[1]}` })} />

      <Divider orientation="left">props.picker="quarter"</Divider>
      <li>
        quarter's value:
        {state.quarter}
      </li>
      <DatePicker picker="quarter" onChange={date => setState({ quarter: date })} />
      <li>
        quarterRange's value:
        {state.quarterRange}
      </li>
      <DateRangePicker picker="quarter" onChange={dates => setState({ quarterRange: `${dates?.[0]}至${dates?.[1]}` })} />

      <Divider orientation="left">props.picker="month"</Divider>
      <li>
        month's value:
        {state.month}
      </li>
      <DatePicker picker="month" onChange={date => setState({ month: date })} />
      <li>
        monthRange's value:
        {state.monthRange}
      </li>
      <DateRangePicker picker="month" onChange={dates => setState({ monthRange: `${dates?.[0]}至${dates?.[1]}` })} />

      <Divider orientation="left">props.picker="week"</Divider>
      <li>
        ween's value:
        {state.week}
      </li>
      <DatePicker picker="week" format="gggg-wo" onChange={date => setState({ week: date })} />
      <li>
        weekRange's value:
        {state.weekRange}
      </li>
      <DateRangePicker picker="week" onChange={dates => setState({ weekRange: `${dates?.[0]}至${dates?.[1]}` })} />
    </div>
  )
}

export default App
