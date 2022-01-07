import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { segmentApi } from '@edulastic/api'
import MyClasses from './components/Myclasses/Myclass'
import { fetchDashboardTiles } from '../../ducks'
import { getUserDetails } from '../../../../student/Login/ducks'

const MainContent = ({ dashboardTiles, getDashboardTiles, user }) => {
  useEffect(() => {
    getDashboardTiles()
  }, [])

  useEffect(() => {
    segmentApi.genericEventTrack('Dashboard_PageView', {})
  }, [])

  useEffect(() => {
    if (user?.recommendedContentUpdated) {
      getDashboardTiles()
    }
  }, [user?.recommendedContentUpdated])

  return <MyClasses dashboardTiles={dashboardTiles} />
}

export default connect(
  (state) => ({
    dashboardTiles: state.dashboardTeacher.configurableTiles,
    user: getUserDetails(state),
  }),
  {
    getDashboardTiles: fetchDashboardTiles,
  }
)(MainContent)
