import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { compose } from 'redux'
import qs from 'qs'
import { find, get } from 'lodash'
import { FlexContainer, withWindowSizes } from '@edulastic/common'
import { withNamespaces } from '@edulastic/localization'
import { authorAssignment } from '@edulastic/colors'
import {
  receiveAssignmentClassList,
  toggleReleaseScoreSettingsAction,
} from '../../../src/actions/assignments'

import {
  getAssignmentClassList,
  getAssignmentsLoadingSelector,
  getAssignmentTestList,
  getBulkActionStatusSelector,
  getBulkActionTypeSelector,
  getCurrentTestSelector,
  getToggleReleaseGradeStateSelector,
  stateSelector,
} from '../../../src/selectors/assignments'
import ListHeader from '../../../src/components/common/ListHeader'
import {
  Anchor,
  AnchorLink,
  Breadcrumbs,
  Container,
  PaginationInfo,
  StyledButton,
  StyledCard,
  StyledFlexContainer,
  StyledSpan,
  TableWrapper,
} from './styled'
import { Breadcrumb } from '../Breadcrumb'
import TableList from '../TableList'
import TestPreviewModal from '../../../Assignments/components/Container/TestPreviewModal'
import ReleaseScoreSettingsModal from '../../../Assignments/components/ReleaseScoreSettingsModal/ReleaseScoreSettingsModal'
import { releaseScoreAction } from '../../../src/actions/classBoard'
import {
  bulkCloseAssignmentAction,
  bulkDownloadGradesAndResponsesAction,
  bulkMarkAsDoneAssignmentAction,
  bulkOpenAssignmentAction,
  bulkPauseAssignmentAction,
  bulkReleaseScoreAssignmentAction,
  bulkUnassignAssignmentAction,
} from '../../ducks'
import { toggleDeleteAssignmentModalAction } from '../../../sharedDucks/assignments'
import {
  getGroupList,
  getUserId,
  getUserOrgId,
  getUserRole,
  getUserSchoolsListSelector,
  isFreeAdminSelector,
  isSAWithoutSchoolsSelector,
} from '../../../src/selectors/user'
import { DeleteAssignmentModal } from '../../../Assignments/components/DeleteAssignmentModal/deleteAssignmentModal'
import PrintTestModal from '../../../src/components/common/PrintTestModal'
import {
  isDemoPlaygroundUser,
  toggleAdminAlertModalAction,
  toggleVerifyEmailModalAction,
  getEmailVerified,
  getVerificationTS,
  isDefaultDASelector,
} from '../../../../student/Login/ducks'
import { setIsTestPreviewVisibleAction } from '../../../../assessment/actions/test'
import { getIsPreviewModalVisibleSelector } from '../../../../assessment/selectors/test'
import { getFilterFromSession } from '../../../../common/utils/helpers'

const { assignmentStatusBg } = authorAssignment

class AssignmentAdvanced extends Component {
  state = {
    filterStatus: '',
    isHeaderAction: false,
    openPrintModal: false,
    pageNo: 1,
  }

  componentDidMount() {
    const {
      match,
      location,
      history,
      isFreeAdmin,
      isSAWithoutSchools,
      toggleAdminAlertModal,
      emailVerified,
      verificationTS,
      isDefaultDA,
      toggleVerifyEmailModal,
      userId,
      districtId: _districtId,
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
    const { districtId, testId } = match.params
    const { loadAssignmentsClassList } = this.props
    const { pageNo, filterStatus } = this.state
    const { testType = '' } = qs.parse(location.search, {
      ignoreQueryPrefix: true,
    })
    const {
      termId = '',
      grades = [],
      assignedBy = '',
      tags = [],
    } = getFilterFromSession({
      key: 'assignments_filter',
      userId,
      districtId: _districtId,
    })
    loadAssignmentsClassList({
      districtId,
      testId,
      testType,
      termId,
      pageNo,
      status: filterStatus,
      grades,
      assignedBy,
      tags,
    })
  }

  componentDidUpdate(prevProps) {
    const { bulkActionStatus, bulkActionType } = this.props
    if (
      prevProps.bulkActionStatus !== bulkActionStatus &&
      !bulkActionStatus &&
      bulkActionType !== 'downloadGradesResponses'
    ) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        filterStatus: '',
        pageNo: 1,
      })
    }
  }

  onOpenReleaseScoreSettings = (testId) => {
    const { toggleReleaseGradePopUp } = this.props
    toggleReleaseGradePopUp(true)
    this.setState({ currentTestId: testId })
  }

  handleListSearch = () => {
    const {
      match,
      location,
      loadAssignmentsClassList,
      userId,
      districtId: _districtId,
    } = this.props
    const { districtId, testId } = match.params
    const { pageNo, filterStatus } = this.state
    const { testType = '' } = qs.parse(location.search, {
      ignoreQueryPrefix: true,
    })
    const { termId = '', tags = [] } = getFilterFromSession({
      key: 'assignments_filter',
      userId,
      districtId: _districtId,
    })
    loadAssignmentsClassList({
      districtId,
      testId,
      testType,
      termId,
      pageNo,
      status: filterStatus,
      tags,
    })
  }

  handlePagination = (pageNo) => {
    this.setState({ pageNo }, () => this.handleListSearch())
  }

  handleFilterStatusChange = (filterStatus) => {
    this.setState({ filterStatus, pageNo: 1 }, () => this.handleListSearch())
  }

  renderBreadcrumbs = () => {
    const { filterStatus } = this.state
    const {
      assignmentStatusCounts: { notOpen, inProgress, inGrading, done },
    } = this?.props?.authorAssignmentsState || {}
    return (
      <FlexContainer>
        <div>
          <StyledSpan>Filter By</StyledSpan>
          <StyledButton
            data-cy="allFilter"
            type="primary"
            onClick={() => this.handleFilterStatusChange('')}
          >
            All
          </StyledButton>
        </div>
        <Breadcrumbs>
          <Breadcrumb
            title={notOpen ? null : 'Not Available'}
            handleClick={() =>
              notOpen ? this.handleFilterStatusChange('NOT_OPEN') : {}
            }
            first
            color={
              filterStatus === 'NOT_OPEN'
                ? 'white'
                : assignmentStatusBg.NOT_OPEN
            }
            bgColor={filterStatus === 'NOT_OPEN' && assignmentStatusBg.NOT_OPEN}
          >
            <span data-cy="notOpenFilter">{notOpen || 0}</span>
            Not Open
          </Breadcrumb>
          <Breadcrumb
            title={inProgress ? null : 'Not Available'}
            handleClick={() =>
              inProgress ? this.handleFilterStatusChange('IN_PROGRESS') : {}
            }
            color={
              filterStatus === 'IN_PROGRESS'
                ? 'white'
                : assignmentStatusBg.IN_PROGRESS
            }
            bgColor={
              filterStatus === 'IN_PROGRESS' && assignmentStatusBg.IN_PROGRESS
            }
          >
            <span data-cy="inProgressFilter">{inProgress || 0}</span>
            In Progress
          </Breadcrumb>
          <Breadcrumb
            title={inGrading ? null : 'Not Available'}
            handleClick={() =>
              inGrading ? this.handleFilterStatusChange('IN_GRADING') : {}
            }
            color={
              filterStatus === 'IN_GRADING'
                ? 'white'
                : assignmentStatusBg.IN_GRADING
            }
            bgColor={
              filterStatus === 'IN_GRADING' && assignmentStatusBg.IN_GRADING
            }
          >
            <span data-cy="inGradingFilter">{inGrading || 0}</span>In Grading
          </Breadcrumb>
          <Breadcrumb
            title={done ? null : 'Not Available'}
            handleClick={() =>
              done ? this.handleFilterStatusChange('DONE') : {}
            }
            color={filterStatus === 'DONE' ? 'white' : assignmentStatusBg.DONE}
            bgColor={filterStatus === 'DONE' && assignmentStatusBg.DONE}
          >
            <span data-cy="doneFilter">{done || 0}</span>Done
          </Breadcrumb>
        </Breadcrumbs>
      </FlexContainer>
    )
  }

  onEnableEdit = () => {
    const { history, match } = this.props
    const { testId } = match.params
    history.push({
      pathname: `/author/tests/${testId}/editAssigned`,
      state: { showCancelButton: true },
    })
  }

  toggleTestPreviewModal = (value) => {
    const { setIsTestPreviewVisible } = this.props
    setIsTestPreviewVisible(!!value)
  }

  onUpdateReleaseScoreSettings = (releaseScore) => {
    const { currentTestId, filterState } = this.state
    const { setReleaseScore, toggleReleaseGradePopUp } = this.props
    setReleaseScore(
      undefined,
      undefined,
      releaseScore,
      currentTestId,
      filterState
    )
    toggleReleaseGradePopUp(false)
  }

  togglePrintModal = () => {
    const { openPrintModal } = this.state
    this.setState({ openPrintModal: !openPrintModal })
  }

  gotoPrintView = (data) => {
    const { type, customValue } = data
    const { match } = this.props
    const { testId } = match.params

    window.open(
      `/author/printAssessment/${testId}?type=${type}&qs=${
        type === 'custom' ? customValue : ''
      }`,
      '_blank'
    )
    this.togglePrintModal()
  }

  render() {
    const { filterStatus, isHeaderAction, openPrintModal, pageNo } = this.state
    const {
      classList,
      match,
      error,
      toggleReleaseGradePopUp,
      isShowReleaseSettingsPopup,
      bulkOpenAssignmentRequest,
      bulkCloseAssignmentRequest,
      bulkPauseAssignmentRequest,
      bulkMarkAsDoneAssignmentRequest,
      bulkReleaseScoreAssignmentRequest,
      bulkUnassignAssignmentRequest,
      bulkDownloadGradesAndResponsesRequest,
      toggleDeleteAssignmentModal,
      location,
      test,
      isLoadingAssignments,
      bulkActionStatus,
      userRole,
      userSchoolsList,
      authorAssignmentsState = {},
      assignmentTestList,
      isPreviewModalVisible,
    } = this.props
    const {
      assignmentStatusCounts: { notOpen, inProgress, inGrading, done },
      totalAssignmentsClasses,
    } = authorAssignmentsState || {}
    let totalCountToShow
    switch (filterStatus) {
      case 'NOT_OPEN':
        totalCountToShow = notOpen
        break
      case 'IN_PROGRESS':
        totalCountToShow = inProgress
        break
      case 'IN_GRADING':
        totalCountToShow = inGrading
        break
      case 'DONE':
        totalCountToShow = done
        break
      default:
        totalCountToShow = totalAssignmentsClasses
    }
    const { testId } = match.params
    const assingment =
      find(assignmentTestList, (item) => item.testId === testId) || test || {}
    const { testType = '' } = qs.parse(location.search, {
      ignoreQueryPrefix: true,
    })
    return (
      <div>
        {isHeaderAction && (
          <DeleteAssignmentModal testId={testId} testName={assingment?.title} />
        )}

        <TestPreviewModal
          isModalVisible={isPreviewModalVisible}
          testId={testId}
          error={error}
          showStudentPerformance
          closeTestPreviewModal={() => this.toggleTestPreviewModal(false)}
        />

        {openPrintModal && (
          <PrintTestModal
            onProceed={this.gotoPrintView}
            onCancel={this.togglePrintModal}
            currentTestId={testId}
          />
        )}

        <ListHeader
          title={assingment.title || 'Loading...'}
          titleWidth="1120px"
          hasButton={false}
        />
        <Container>
          <StyledFlexContainer justifyContent="space-between">
            <PaginationInfo>
              &lt;&nbsp;
              <AnchorLink to="/author/assignments">
                Assignments&nbsp;
              </AnchorLink>
              /&nbsp;
              <Anchor data-cy="assignmentTitle">{assingment.title}</Anchor>
            </PaginationInfo>
            {this.renderBreadcrumbs()}
          </StyledFlexContainer>
          <TableWrapper>
            <StyledCard>
              <TableList
                classList={classList}
                rowKey={(recode) => recode.assignmentId}
                bulkOpenAssignmentRequest={bulkOpenAssignmentRequest}
                bulkCloseAssignmentRequest={bulkCloseAssignmentRequest}
                bulkPauseAssignmentRequest={bulkPauseAssignmentRequest}
                bulkMarkAsDoneAssignmentRequest={
                  bulkMarkAsDoneAssignmentRequest
                }
                bulkReleaseScoreAssignmentRequest={
                  bulkReleaseScoreAssignmentRequest
                }
                bulkUnassignAssignmentRequest={bulkUnassignAssignmentRequest}
                bulkDownloadGradesAndResponsesRequest={
                  bulkDownloadGradesAndResponsesRequest
                }
                toggleDeleteAssignmentModal={(toggleState) => {
                  this.setState({ isHeaderAction: false })
                  toggleDeleteAssignmentModal(toggleState)
                }}
                testType={testType}
                testName={assingment.title}
                isLoadingAssignments={isLoadingAssignments}
                bulkActionStatus={bulkActionStatus}
                isHeaderAction={isHeaderAction}
                userSchoolsList={userSchoolsList}
                userRole={userRole}
                pageNo={pageNo}
                totalAssignmentsClasses={totalCountToShow}
                handlePagination={this.handlePagination}
                filterStatus={filterStatus}
              />
            </StyledCard>
          </TableWrapper>
        </Container>
        <ReleaseScoreSettingsModal
          showReleaseGradeSettings={isShowReleaseSettingsPopup}
          onCloseReleaseScoreSettings={() => toggleReleaseGradePopUp(false)}
          updateReleaseScoreSettings={this.onUpdateReleaseScoreSettings}
        />
      </div>
    )
  }
}

AssignmentAdvanced.propTypes = {
  match: PropTypes.object.isRequired,
  loadAssignmentsClassList: PropTypes.func.isRequired,
  classList: PropTypes.array.isRequired,
  history: PropTypes.object.isRequired,
}

const enhance = compose(
  withRouter,
  withWindowSizes,
  withNamespaces('header'),
  connect(
    (state) => ({
      isShowReleaseSettingsPopup: getToggleReleaseGradeStateSelector(state),
      error: get(state, 'test.error', false),
      emailVerified: getEmailVerified(state),
      verificationTS: getVerificationTS(state),
      isDefaultDA: isDefaultDASelector(state),
      classList: getAssignmentClassList(state),
      test: getCurrentTestSelector(state),
      userId: getUserId(state),
      isLoadingAssignments: getAssignmentsLoadingSelector(state),
      bulkActionStatus: getBulkActionStatusSelector(state),
      userRole: getUserRole(state),
      userClassList: getGroupList(state),
      userSchoolsList: getUserSchoolsListSelector(state),
      authorAssignmentsState: stateSelector(state),
      assignmentTestList: getAssignmentTestList(state),
      bulkActionType: getBulkActionTypeSelector(state),
      isFreeAdmin: isFreeAdminSelector(state),
      isSAWithoutSchools: isSAWithoutSchoolsSelector(state),
      isPreviewModalVisible: getIsPreviewModalVisibleSelector(state),
      isDemoPlayground: isDemoPlaygroundUser(state),
      districtId: getUserOrgId(state),
    }),
    {
      setReleaseScore: releaseScoreAction,
      toggleReleaseGradePopUp: toggleReleaseScoreSettingsAction,
      loadAssignmentsClassList: receiveAssignmentClassList,
      bulkOpenAssignmentRequest: bulkOpenAssignmentAction,
      bulkCloseAssignmentRequest: bulkCloseAssignmentAction,
      bulkPauseAssignmentRequest: bulkPauseAssignmentAction,
      bulkMarkAsDoneAssignmentRequest: bulkMarkAsDoneAssignmentAction,
      bulkReleaseScoreAssignmentRequest: bulkReleaseScoreAssignmentAction,
      bulkUnassignAssignmentRequest: bulkUnassignAssignmentAction,
      bulkDownloadGradesAndResponsesRequest: bulkDownloadGradesAndResponsesAction,
      toggleDeleteAssignmentModal: toggleDeleteAssignmentModalAction,
      toggleAdminAlertModal: toggleAdminAlertModalAction,
      toggleVerifyEmailModal: toggleVerifyEmailModalAction,
      setIsTestPreviewVisible: setIsTestPreviewVisibleAction,
    }
  )
)

export default enhance(AssignmentAdvanced)
