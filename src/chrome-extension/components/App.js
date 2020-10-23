import React, { useEffect } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import loadable from '@loadable/component'
import { userApi, classApi } from '../api'
import {
  updateUserAction,
  updateClassDataAction,
} from '../reducers/ducks/edulastic'

const ReactionTray = loadable(() => import('./ReactionTray'))
const MessageWrapper = loadable(() => import('./MessageWrapper'))

const Loading = (msg) => <h6>{msg}</h6>

const MainContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 100000;
`

const App = ({ authToken, updateUser, updateClassData }) => {
  useEffect(() => {
    if (authToken) {
      ;(async () => {
        const user = await userApi.fetchUser()
        const { _id: classId } = user.orgData?.classList?.[0]
        const districtId = user.districtIds[0]

        if (!classId) console.log('Could not derive classId...')

        const students = await classApi.fechClassData(districtId, classId)

        if (user) updateUser({ ...user, classId })
        if (students) updateClassData({ classId, students })
      })()
    }
  }, [authToken])

  return (
    <MainContainer>
      <ReactionTray fallback={<Loading message="Loading Reaction Tray..." />} />

      <MessageWrapper
        fallback={<Loading message="Loading Message Wrapper..." />}
      />
    </MainContainer>
  )
}

export default connect(
  (state) => ({
    authToken: state.edulasticReducer.authToken,
  }),
  {
    updateUser: updateUserAction,
    updateClassData: updateClassDataAction,
  }
)(App)
