import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { size, isEmpty, get } from 'lodash'

import { EduIf, MainContentWrapper } from '@edulastic/common'
import { withNamespaces } from '@edulastic/localization'
import CustomNotificationBar from '@edulastic/common/src/components/CustomNotificationBar/CustomNotificationBar'
import { red, themeColor } from '@edulastic/colors'
import { Divider } from 'antd'
import { Link } from 'react-router-dom'
import { IconBarChart, IconStar } from '@edulastic/icons'
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
  isPremiumUserSelector,
} from '../src/selectors/user'
import {
  toggleAdminAlertModalAction,
  toggleVerifyEmailModalAction,
  getEmailVerified,
  getVerificationTS,
  isDefaultDASelector,
} from '../../student/Login/ducks'
import { TagWrapper } from '../ClassBoard/components/Container/styled'
import PremiumPopover from '../../features/components/PremiumPopover'

class StandardsBasedReport extends Component {
  constructor(props) {
    super(props)

    this.state = {
      premiumPopup: null,
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
      t,
      isPremiumUser,
    } = this.props
    const { premiumPopup } = this.state
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
          <PremiumPopover
            target={premiumPopup}
            onClose={() => this.setState({ premiumPopup: null })}
            descriptionType="report"
            imageType="IMG_DATA_ANALYST"
          />
          <StyledFlexContainer justifyContent="space-between">
            <ClassBreadBrumb />
            <StyledFlexContainer
              justifyContent="space-between"
              style={{ width: 'auto', margin: '0px', alignItems: 'center' }}
            >
              <Link
                to={`/author/reports/performance-by-standards/test/${additionalData.testId}`}
                onClick={(e) => {
                  if (!isPremiumUser) {
                    e.preventDefault()
                    this.setState({ premiumPopup: e.target })
                  }
                }}
              >
                <StyledFlexContainer
                  justifyContent="space-between"
                  style={{ width: 'auto', margin: '0px', alignItems: 'center' }}
                >
                  <IconBarChart color={themeColor} height="12px" />
                  &nbsp; DETAILED ANALYSIS&nbsp;&nbsp;
                  {isPremiumUser || <IconStar />}
                </StyledFlexContainer>
              </Link>
              <Divider type="vertical" />
              <PresentationToggleSwitch groupId={classId} />
            </StyledFlexContainer>
          </StyledFlexContainer>
          <EduIf condition={additionalData?.isDataMovedToArchivedDB}>
            <TagWrapper>
              <CustomNotificationBar textAlign="center" textColor={red}>
                {t('common.uqaArchiveMessage')}
              </CustomNotificationBar>
            </TagWrapper>
          </EduIf>
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
      isPremiumUser: isPremiumUserSelector(state),
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
