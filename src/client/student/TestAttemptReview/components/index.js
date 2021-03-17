import React, { useState, useEffect } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { IconLogoCompact } from '@edulastic/icons'
import styled, { ThemeProvider } from 'styled-components'
import { themeColor } from '@edulastic/colors'
import { Spin } from 'antd'
import { WithResources } from '@edulastic/common'
import { themes } from '../../../theme'
import AppConfig from '../../../../app-config'
import SummaryHeader from './Header'
import SummaryTest from './Content'
import { finishTestAcitivityAction } from '../../../assessment/actions/test'
import SubmitConfirmation from '../../../assessment/themes/common/SubmitConfirmation'
import {
  FirestorePings,
  ForceFullScreenModal,
  useFullScreenListener,
  useTabNavigationCounterEffect,
} from '../../../assessment/themes/index'
import { clearUserWorkAction } from '../../../assessment/actions/userWork'
import { fetchAssignmentsAction } from '../../Reports/ducks'

const SummaryContainer = (props) => {
  const {
    finishTest,
    history,
    match,
    clearUserWork,
    assignmentById,
    currentAssignment,
    userId,
    fetchAssignments,
  } = props

  const assignmentObj = currentAssignment && assignmentById[currentAssignment]
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const handlerConfirmationModal = () => {
    setShowConfirmationModal(true)
  }

  const restrictNavigationOut =
    assignmentObj?.restrictNavigationOut || props?.restrictNavigationOut
  const blockSaveAndContinue =
    assignmentObj?.blockSaveAndContinue || props?.blockSaveAndContinue

  const { groupId, utaId } = match.params

  const currentlyFullScreen = useFullScreenListener({
    enabled: restrictNavigationOut,
    assignmentId: assignmentObj?._id,
    classId: groupId,
    testActivityId: utaId,
    history,
    disableSave: blockSaveAndContinue,
    userId,
  })

  useTabNavigationCounterEffect({
    testActivityId: utaId,
    enabled: restrictNavigationOut,
    history,
  })

  useEffect(() => {
    if (currentAssignment && !assignmentObj) {
      fetchAssignments()
    }
  }, [currentAssignment])

  return (
    <ThemeProvider theme={themes.default}>
      <Header>
        <IconLogoCompact style={{ fill: themeColor, marginLeft: '21px' }} />
      </Header>
      <MainContainer>
        {restrictNavigationOut && (
          <>
            <ForceFullScreenModal
              testActivityId={utaId}
              history={history}
              visible={!currentlyFullScreen}
              finishTest={() => finishTest(groupId)}
            />
          </>
        )}
        {(blockSaveAndContinue || restrictNavigationOut) && (
          <FirestorePings
            testActivityId={utaId}
            history={history}
            blockSaveAndContinue={blockSaveAndContinue}
            userId={userId}
            classId={groupId}
            assignmentId={assignmentObj?._id}
          />
        )}
        <SummaryHeader showConfirmationModal={handlerConfirmationModal} />
        <SummaryTest finishTest={() => finishTest(groupId)} />
      </MainContainer>
    </ThemeProvider>
  )
}

const enhance = compose(
  withRouter,
  connect(
    (state) => ({
      userId: state.user?.user?._id,
      assignmentById: state.studentAssignment?.byId,
      currentAssignment: state.studentAssignment?.current,
      blockSaveAndContinue: state.test?.settings?.blockSaveAndContinue,
      restrictNavigationOut: state.test?.settings?.restrictNavigationOut,
    }),
    {
      finishTest: finishTestAcitivityAction,
      clearUserWork: clearUserWorkAction,
      fetchAssignments: fetchAssignmentsAction,
    }
  )
)

function SummaryContainerWithjQuery(props) {
  return (
    <WithResources
      resources={[`${AppConfig.jqueryPath}/jquery.min.js`]}
      fallBack={<Spin />}
    >
      <SummaryContainer {...props} />
    </WithResources>
  )
}

export default enhance(SummaryContainerWithjQuery)

SummaryContainer.propTypes = {
  finishTest: PropTypes.func.isRequired,
  history: PropTypes.func.isRequired,
}

const MainContainer = styled.div`
  width: 100%;
  @media (min-width: 1200px) {
    display: flex;
    flex-direction: column;
  }
`

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 53px;
  border: 1px solid #dadae4;
  opacity: 1;
`
