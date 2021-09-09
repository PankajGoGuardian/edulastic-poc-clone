import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { size, isEmpty } from 'lodash'

import { MainContentWrapper } from '@edulastic/common'
import HooksContainer from '../ClassBoard/components/HooksContainer/HooksContainer'
import ClassHeader from '../Shared/Components/ClassHeader/ClassHeader'
import PresentationToggleSwitch from '../Shared/Components/PresentationToggleSwitch'
import TableDisplay from './components/TableDisplay'
import { receiveTestActivitydAction } from '../src/actions/classBoard'
import {
  getTestActivitySelector,
  getAdditionalDataSelector,
  getQIdsSelector,
  getQLabelsSelector,
} from '../ClassBoard/ducks'
import { StyledFlexContainer, DivWrapper } from './components/styled'
import ClassBreadBrumb from '../Shared/Components/ClassBreadCrumb'
import {
  isFreeAdminSelector,
  isSAWithoutSchoolsSelector,
} from '../src/selectors/user'
import { toggleAdminAlertModalAction } from '../../student/Login/ducks'

class StandardsBasedReport extends Component {
  componentDidMount() {
    const {
      loadTestActivity,
      match,
      testActivity,
      additionalData,
      history,
      isFreeAdmin,
      isSAWithoutSchools,
      toggleAdminAlertModal,
    } = this.props
    if (isFreeAdmin) {
      history.push('/author/reports')
      return toggleAdminAlertModal()
    }
    if (isSAWithoutSchools) {
      history.push('/author/tests')
      return toggleAdminAlertModal()
    }
    if (!size(testActivity) && isEmpty(additionalData)) {
      const { assignmentId, classId } = match.params
      loadTestActivity(assignmentId, classId)
    }
  }

  getTestActivity = (data) => {
    let id = null
    data.forEach((item) => {
      if (item.testActivityId) {
        id = item.testActivityId
      }
    })
    return id
  }

  render() {
    const {
      testActivity,
      additionalData,
      reportStandards,
      creating,
      match: {
        params: { assignmentId, classId },
      },
      labels,
      testQIds,
      testStandardsLength,
    } = this.props
    const testActivityId = this.getTestActivity(testActivity)

    return (
      <>
        <ClassHeader
          classId={classId}
          active="standard_report"
          creating={creating}
          assignmentId={assignmentId}
          additionalData={additionalData || {}}
          testActivityId={testActivityId}
          testActivity={testActivity}
        />
        <HooksContainer classId={classId} assignmentId={assignmentId} />
        <MainContentWrapper>
          <StyledFlexContainer justifyContent="space-between">
            <ClassBreadBrumb />
            <PresentationToggleSwitch groupId={classId} />
          </StyledFlexContainer>

          <DivWrapper>
            <TableDisplay
              testActivities={testActivity}
              labels={labels}
              additionalData={additionalData}
              reportStandards={reportStandards}
              qids={testQIds}
              testStandardsEmpty={testStandardsLength === 0}
            />
          </DivWrapper>
        </MainContentWrapper>
      </>
    )
  }
}

const enhance = compose(
  connect(
    (state) => ({
      testActivity: getTestActivitySelector(state),
      additionalData: getAdditionalDataSelector(state),
      testQIds: getQIdsSelector(state),
      labels: getQLabelsSelector(state),
      testStandardsLength:
        state.classResponse?.data?.reportStandards?.length || 0,
      reportStandards: state.classResponse?.data?.reportStandards || [],
      isFreeAdmin: isFreeAdminSelector(state),
      isSAWithoutSchools: isSAWithoutSchoolsSelector(state),
    }),
    {
      loadTestActivity: receiveTestActivitydAction,
      toggleAdminAlertModal: toggleAdminAlertModalAction,
    }
  )
)

export default enhance(StandardsBasedReport)

StandardsBasedReport.propTypes = {
  /* eslint-disable react/require-default-props */
  match: PropTypes.object,
  testActivity: PropTypes.array,
  additionalData: PropTypes.object,
  loadTestActivity: PropTypes.func,
  creating: PropTypes.object,
}

StandardsBasedReport.defaultProps = {
  additionalData: {},
}
