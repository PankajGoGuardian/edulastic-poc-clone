import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import MyClasses from './components/Myclasses/Myclass'
import { fetchDashboardTiles } from '../../ducks'

const MainContent = ({ dashboardTiles, getDashboardTiles }) => {
  useEffect(() => {
    getDashboardTiles()
  }, [])

  return <MyClasses dashboardTiles={dashboardTiles} />
}

export default connect(
  (state) => ({
    dashboardTiles: state.dashboardTeacher.configurableTiles,
  }),
  {
    getDashboardTiles: fetchDashboardTiles,
  }
)(MainContent)
