import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { compose } from 'redux'
import MyClasses from './components/Myclasses/Myclass'
import { fetchDashboardTiles } from '../../ducks'

const MainContent = ({ dashboardTiles, getDashboardTiles }) => {
  useEffect(() => {
    getDashboardTiles()
  }, [])

  return (
    <>
      <MyClasses dashboardTiles={dashboardTiles} />
      {console.log('dashboardTiles', dashboardTiles)}
    </>
  )
}

export default compose(
  withRouter,
  connect(
    (state) => ({
      dashboardTiles: state.dashboardTeacher.configurableTiles,
    }),
    {
      getDashboardTiles: fetchDashboardTiles,
    }
  )
)(MainContent)
