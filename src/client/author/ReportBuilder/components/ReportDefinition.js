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
import {
  updateReportDefinitionAction,
  getActiveReportSelector,
  isReportDefinitionLoadingSelector,
} from '../ducks'

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
  minW: 4,
  minH: 8,
})

const ReportDefinition = ({ report, updateReport }) => {
  const [isDragging, setIsDragging] = useState(false)
  const { widgets } = report
  // TODO:
  // on layout change, do set widgets with new layout
  // show a save button, which on click to save the report with updated widgets
  // once report is updated, update the component state widget with report widgets
  // use data.grid from widgets state
  const onLayoutChange = (newLayout) => {
    const widgetsNotNeedUpdate = []
    const WidgetsNeedUpdate = []
    newLayout.forEach((l) => {
      const _widget = widgets.find((i) => i._id === l.i)
      const toUpdate = {
        x: l.x,
        y: l.y,
        w: l.w,
        h: l.h,
      }
      if (
        _widget &&
        JSON.stringify(toUpdate) !== JSON.stringify(_widget.layout.options)
      ) {
        WidgetsNeedUpdate.push({
          ..._widget,
          layout: {
            ..._widget.layout,
            options: toUpdate,
          },
        })
      } else {
        widgetsNotNeedUpdate.push(_widget)
      }
      if (WidgetsNeedUpdate) {
        updateReport({
          updateDoc: {
            $set: {
              ...report,
              widgets: [...WidgetsNeedUpdate, ...widgetsNotNeedUpdate],
            },
          },
          isReportDefinitionPage: true,
          definitionId: report._id,
        })
      }
    })
  }

  const widgetWrapper = (widget) => (
    <div key={widget._id} data-grid={defaultLayout(widget.layout)}>
      <Widget
        key={widget._id}
        widgetId={widget._id}
        title={widget.name}
        report={report}
      >
        <ChartRenderer
          query={widget.query}
          chartType={widget.layout.type || 'table'}
          widgetId={widget._id}
        />
      </Widget>
    </div>
  )

  return (
    <DragField
      margin={[12, 12]}
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

const enhance = compose(
  connect(
    (state) => ({
      isLoading: isReportDefinitionLoadingSelector(state),
      report: getActiveReportSelector(state),
    }),
    {
      updateReport: updateReportDefinitionAction,
    }
  )
)

export default enhance(ReportDefinition)
