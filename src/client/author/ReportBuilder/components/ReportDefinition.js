import React, { useState } from 'react'
import RGL, { WidthProvider } from 'react-grid-layout'
import { compose } from 'redux'
import { connect } from 'react-redux'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import styled from 'styled-components'
import dragBackground from '../../Dashboard/assets/svgs/drag-background.svg'
import ChartRenderer from './ChartRenderer'
import Widget from './Widget'

const ReactGridLayout = WidthProvider(RGL)

const DragField = styled(ReactGridLayout)`
  margin: 16px 28px 50px 28px;
  ${(props) =>
    props.isDragging
      ? `
    background: url(${dragBackground});
    background-repeat: repeat-y;
    background-position: 0px -4px;
    background-size: 100% 52px;
  `
      : ''};
`

const defaultLayout = (w) => ({
  x: w.options.x || 0,
  y: w.options.y || 0,
  w: w.options.w || 8,
  h: w.options.h || 8,
  minW: 8,
  minH: 8,
})

const ReportDefinition = ({ report, setCurrentReport }) => {
  const [isDragging, setIsDragging] = useState(false)
  const { widgets } = report
  const onLayoutChange = (newLayout) => {
    setCurrentReport((prevReport) => {
      if (!prevReport) return prevReport
      return {
        ...prevReport,
        widgets: prevReport.widgets.map((widget) => {
          const widgetLayout = newLayout.find((l) => l.i === widget._id)
          if (!widgetLayout) return widget
          return {
            ...widget,
            layout: {
              ...widget.layout,
              options: {
                ...widget.layout.options,
                x: widgetLayout.x,
                y: widgetLayout.y,
                w: widgetLayout.w,
                h: widgetLayout.h,
              },
            },
          }
        }),
      }
    })
  }

  const widgetWrapper = (widget) => (
    <div key={widget._id} data-grid={defaultLayout(widget.layout)}>
      <Widget
        key={widget._id}
        widgetId={widget._id}
        title={widget.title}
        report={report}
      >
        <ChartRenderer
          widget={widget}
          chartType={widget.layout.type}
          widgetId={widget._id}
        />
      </Widget>
    </div>
  )

  return (
    <DragField
      margin={[18, 18]}
      containerPadding={[0, 0]}
      onDragStart={() => setIsDragging(true)}
      onDragStop={() => setIsDragging(false)}
      onResizeStart={() => setIsDragging(true)}
      onResizeStop={() => setIsDragging(false)}
      cols={24}
      rowHeight={40}
      onLayoutChange={onLayoutChange}
      isDragging={isDragging}
    >
      {widgets.map(widgetWrapper)}
    </DragField>
  )
}

// TODO remove connect ? if not required
const enhance = compose(
  connect(
    (state) => ({
      // isLoading: isReportDefinitionLoadingSelector(state),
      // report: getActiveReportSelector(state),
    }),
    {
      // updateReport: updateReportDefinitionAction,
    }
  )
)

export default enhance(ReportDefinition)
