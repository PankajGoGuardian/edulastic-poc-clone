import React, { useEffect } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { Spin, Button, Typography } from 'antd'
import { Link } from 'react-router-dom'
import ChartRenderer from './ChartRenderer'
import Dashboard from './Dashboard'
import DashboardItem from './DashboardItem'
import PageHeader from './PageHeader'
import {
  getDashboardItemsAction,
  getDashboardItemsSelector,
  isLoadingSelector,
} from '../ducks'

const deserializeItem = (i) => ({
  ...i,
  layout: JSON.parse(i.layout) || {},
  vizState: JSON.parse(i.vizState),
})

const defaultLayout = (i) => ({
  x: i.layout.x || 0,
  y: i.layout.y || 0,
  w: i.layout.w || 4,
  h: i.layout.h || 8,
  minW: 4,
  minH: 8,
})

const CustomReports = ({ isLoading, dashboardItems, getDashboardItem }) => {
  useEffect(() => {
    getDashboardItem()
  }, [])

  if (isLoading) {
    return <Spin />
  }

  const dashboardItem = (item) => (
    <div key={item._id} data-grid={defaultLayout(item)}>
      <DashboardItem key={item._id} itemId={item._id} title={item.name}>
        <ChartRenderer vizState={item.vizState} itemId={item._id} />
      </DashboardItem>
    </div>
  )

  const Empty = () => (
    <div
      style={{
        textAlign: 'center',
        padding: 12,
      }}
    >
      <h2>There are no charts on this dashboard</h2>
      <Link to="/explore">
        <Button type="primary" size="large" icon="plus">
          Add chart
        </Button>
      </Link>
    </div>
  )

  return dashboardItems.length ? (
    <div>
      <PageHeader
        title={<Typography.Title level={4}>Dashboard</Typography.Title>}
        button={
          <Link to="/author/customReports/explore">
            <Button type="primary">Add chart</Button>
          </Link>
        }
      />
      <Dashboard dashboardItems={dashboardItems}>
        {dashboardItems.length &&
          dashboardItems.map(deserializeItem).map(dashboardItem)}
      </Dashboard>
    </div>
  ) : (
    <Empty />
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
    }
  )
)

export default enhance(CustomReports)
