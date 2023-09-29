import React, { useState } from 'react'
import RGL, { WidthProvider } from 'react-grid-layout'
import { compose } from 'redux'
import { connect } from 'react-redux'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import styled from 'styled-components'
import dragBackground from '../../Dashboard/assets/svgs/drag-background.svg'

import {
  getDashboardItemsAction,
  updateDashboardItemAction,
  getDashboardItemsSelector,
  isLoadingSelector,
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

const Dashboard = ({
  children,
  dashboardItems,
  updateDashboardItem,
  getDashboardItem,
}) => {
  const [isDragging, setIsDragging] = useState(false)

  const onLayoutChange = (newLayout) => {
    newLayout.forEach((l) => {
      const item = dashboardItems.find((i) => i._id.toString() === l.i)
      const toUpdate = JSON.stringify({
        x: l.x,
        y: l.y,
        w: l.w,
        h: l.h,
      })

      if (item && toUpdate !== item.layout) {
        updateDashboardItem({
          _id: item._id,
          layout: {
            type: item.layout.type,
            options: toUpdate,
          },
        })
      }
    })
  }

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
      {children}
    </DragField>
  )
}

const enhance = compose(
  connect(
    (state) => ({
      isLoading: isLoadingSelector(state),
      dashboardItems: getDashboardItemsSelector(state),
    }),
    {
      getDashboardItem: getDashboardItemsAction,
      updateDashboardItem: updateDashboardItemAction,
    }
  )
)

export default enhance(Dashboard)
