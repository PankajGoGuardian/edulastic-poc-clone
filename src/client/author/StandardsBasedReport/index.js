import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { size, isEmpty, get } from 'lodash'

import { MainContentWrapper, notification } from '@edulastic/common'
import { withNamespaces } from '@edulastic/localization'
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
import {
  toggleAdminAlertModalAction,
  toggleVerifyEmailModalAction,
  getEmailVerified,
  getVerificationTS,
  isDefaultDASelector,
} from '../../student/Login/ducks'

class StandardsBasedReport extends Component {
  constructor(props) {
    super(props)
    this.state = {
      hasShownNotification: false,
    }
  }

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
      emailVerified,
      verificationTS,
      isDefaultDA,
      toggleVerifyEmailModal,
      userRole,
    } = this.props

    if (isSAWithoutSchools) {
      history.push('/author/tests')
      return toggleAdminAlertModal()
    }
    if (isFreeAdmin) {
      history.push('/author/reports')
      return toggleAdminAlertModal()
    }
    if (!emailVerified && verificationTS && !isDefaultDA) {
      const existingVerificationTS = new Date(verificationTS)
      const expiryDate = new Date(
        existingVerificationTS.setDate(existingVerificationTS.getDate() + 14)
      ).getTime()
      if (expiryDate < Date.now()) {
        history.push(userRole === 'teacher' ? '/' : '/author/items')
        return toggleVerifyEmailModal(true)
      }
    }
    const { assignmentId, classId } = match.params
    const lastClassId = additionalData.classId
    const lastAssignmentId = additionalData.assignmentId
    if (!size(testActivity) && isEmpty(additionalData)) {
      loadTestActivity(assignmentId, classId)
    } else if (lastAssignmentId !== assignmentId || classId !== lastClassId) {
      loadTestActivity(assignmentId, classId)
    }
  }

  componentDidUpdate() {
    const { additionalData, t } = this.props
    if (
      !this.state.hasShownNotification &&
      additionalData?.archiveCollection?.uqa
    ) {
      notification({
        type: 'info',
        msg: t('common.uqaArchiveMessage'),
      })
      this.setState({
        hasShownNotification: true,
      })
    }
  }

  componentWillUnmount() {
    this.setState({
      hasShownNotification: false,
    })
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
  withNamespaces('classBoard'),
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
      emailVerified: getEmailVerified(state),
      verificationTS: getVerificationTS(state),
      isDefaultDA: isDefaultDASelector(state),
      userRole: get(state.user, 'user.role', null),
      isSAWithoutSchools: isSAWithoutSchoolsSelector(state),
    }),
    {
      loadTestActivity: receiveTestActivitydAction,
      toggleAdminAlertModal: toggleAdminAlertModalAction,
      toggleVerifyEmailModal: toggleVerifyEmailModalAction,
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
