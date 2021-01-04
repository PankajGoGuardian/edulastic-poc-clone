import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { compose } from 'redux'
import qs from 'qs'
import { find, isEmpty, get } from 'lodash'
import { Dropdown } from 'antd'
import { withWindowSizes, FlexContainer } from '@edulastic/common'
import { withNamespaces } from '@edulastic/localization'
import { authorAssignment } from '@edulastic/colors'
import { IconMoreVertical } from '@edulastic/icons'
import {
  receiveAssignmentClassList,
  receiveAssignmentsSummaryAction,
  toggleReleaseScoreSettingsAction,
} from '../../../src/actions/assignments'

import {
  getAssignmentsSummary,
  getAssignmentClassList,
  getToggleReleaseGradeStateSelector,
  getCurrentTestSelector,
  getAssignmentsLoadingSelector,
  getBulkActionStatusSelector,
  stateSelector,
  getAssignmentTestList,
  getBulkActionTypeSelector,
} from '../../../src/selectors/assignments'
import ListHeader from '../../../src/components/common/ListHeader'
import ActionMenu from '../../../Assignments/components/ActionMenu/ActionMenu'
import {
  Container,
  PaginationInfo,
  AnchorLink,
  Anchor,
  Breadcrumbs,
  BtnAction,
  StyledCard,
  TableWrapper,
  StyledButton,
  StyledSpan,
  StyledFlexContainer,
} from './styled'
import { Breadcrumb } from '../Breadcrumb'
import TableList from '../TableList'
import TestPreviewModal from '../../../Assignments/components/Container/TestPreviewModal'
import EditTestModal from '../../../src/components/common/EditTestModal'
import ReleaseScoreSettingsModal from '../../../Assignments/components/ReleaseScoreSettingsModal/ReleaseScoreSettingsModal'
import { releaseScoreAction } from '../../../src/actions/classBoard'
import {
  bulkOpenAssignmentAction,
  bulkCloseAssignmentAction,
  bulkPauseAssignmentAction,
  bulkMarkAsDoneAssignmentAction,
  bulkReleaseScoreAssignmentAction,
  bulkUnassignAssignmentAction,
  bulkDownloadGradesAndResponsesAction,
} from '../../ducks'
import { toggleDeleteAssignmentModalAction } from '../../../sharedDucks/assignments'
import {
  getUserId,
  getUserRole,
  getGroupList,
  getUserSchoolsListSelector,
} from '../../../src/selectors/user'
import { canEditTest } from '../../../Assignments/utils'
import { DeleteAssignmentModal } from '../../../Assignments/components/DeleteAssignmentModal/deleteAssignmentModal'
import PrintTestModal from '../../../src/components/common/PrintTestModal'

const { assignmentStatusBg } = authorAssignment

class AssignmentAdvanced extends Component {
  state = {
    openEditPopup: false,
    isPreviewModalVisible: false,
    filterStatus: '',
    isHeaderAction: false,
    openPrintModal: false,
    pageNo: 1,
  }

  componentDidMount() {
    const { match, location } = this.props
    const { districtId, testId } = match.params
    const {
      loadAssignmentsClassList,
      loadAssignmentsSummary,
      assignmentsSummary,
    } = this.props
    const { pageNo, filterStatus } = this.state
    const { testType = '' } = qs.parse(location.search, {
      ignoreQueryPrefix: true,
    })
    const { termId = '', grades = [], assignedBy = '' } = JSON.parse(
      sessionStorage.getItem('filters[Assignments]') || '{}'
    )
    if (isEmpty(assignmentsSummary)) {
      loadAssignmentsSummary({ districtId })
    }
    loadAssignmentsClassList({
      districtId,
      testId,
      testType,
      termId,
      pageNo,
      status: filterStatus,
      grades,
      assignedBy,
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
    const { match, location, loadAssignmentsClassList } = this.props
    const { districtId, testId } = match.params
    const { pageNo, filterStatus } = this.state
    const { testType = '' } = qs.parse(location.search, {
      ignoreQueryPrefix: true,
    })
    const { termId = '' } = JSON.parse(
      sessionStorage.getItem('filters[Assignments]') || '{}'
    )
    loadAssignmentsClassList({
      districtId,
      testId,
      testType,
      termId,
      pageNo,
      status: filterStatus,
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

  toggleEditModal = (value) => {
    this.setState({ openEditPopup: value })
  }

  toggleTestPreviewModal = (value) => {
    this.setState({ isPreviewModalVisible: !!value })
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
    const {
      filterStatus,
      openEditPopup,
      isPreviewModalVisible,
      isHeaderAction,
      openPrintModal,
      pageNo,
    } = this.state
    const {
      classList,
      assignmentsSummary,
      match,
      history,
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
      userId,
      test,
      isLoadingAssignments,
      bulkActionStatus,
      userRole,
      userClassList,
      userSchoolsList,
      authorAssignmentsState = {},
      assignmentTestList,
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
      find(assignmentsSummary, (item) => item.testId === testId) ||
      find(assignmentTestList, (item) => item.testId === testId) ||
      {}
    const { testType = '' } = qs.parse(location.search, {
      ignoreQueryPrefix: true,
    })
    return (
      <div>
        {isHeaderAction && (
          <DeleteAssignmentModal testId={testId} testName={assingment?.title} />
        )}
        <EditTestModal
          visible={openEditPopup}
          isUsed
          onCancel={() => this.toggleEditModal(false)}
          onOk={this.onEnableEdit}
        />

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
          renderExtra={() => (
            <Dropdown
              overlay={ActionMenu({
                onOpenReleaseScoreSettings: this.onOpenReleaseScoreSettings,
                row: assingment,
                history,
                showPreviewModal: this.toggleTestPreviewModal,
                toggleEditModal: this.toggleEditModal,
                canEdit: canEditTest(test, userId),
                userRole,
                userId,
                toggleDeleteModal: () => {
                  this.setState({ isHeaderAction: true })
                  toggleDeleteAssignmentModal(true)
                },
                userClassList,
                togglePrintModal: this.togglePrintModal,
                assignmentTest: assingment,
              })}
              placement="bottomLeft"
              trigger={['hover']}
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
            >
              <BtnAction>
                <IconMoreVertical />
              </BtnAction>
            </Dropdown>
          )}
        />
        <Container>
          <StyledFlexContainer justifyContent="space-between">
            <PaginationInfo>
              &lt; <AnchorLink to="/author/assignments">Assignments</AnchorLink>{' '}
              / <Anchor>{assingment.title}</Anchor>
            </PaginationInfo>
            {this.renderBreadcrumbs(assingment, history)}
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
  loadAssignmentsSummary: PropTypes.func.isRequired,
  assignmentsSummary: PropTypes.array.isRequired,
  classList: PropTypes.array.isRequired,
  history: PropTypes.object.isRequired,
}

const enhance = compose(
  withRouter,
  withWindowSizes,
  withNamespaces('header'),
  connect(
    (state) => ({
      assignmentsSummary: getAssignmentsSummary(state),
      isShowReleaseSettingsPopup: getToggleReleaseGradeStateSelector(state),
      error: get(state, 'test.error', false),
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
    }),
    {
      setReleaseScore: releaseScoreAction,
      toggleReleaseGradePopUp: toggleReleaseScoreSettingsAction,
      loadAssignmentsClassList: receiveAssignmentClassList,
      loadAssignmentsSummary: receiveAssignmentsSummaryAction,
      bulkOpenAssignmentRequest: bulkOpenAssignmentAction,
      bulkCloseAssignmentRequest: bulkCloseAssignmentAction,
      bulkPauseAssignmentRequest: bulkPauseAssignmentAction,
      bulkMarkAsDoneAssignmentRequest: bulkMarkAsDoneAssignmentAction,
      bulkReleaseScoreAssignmentRequest: bulkReleaseScoreAssignmentAction,
      bulkUnassignAssignmentRequest: bulkUnassignAssignmentAction,
      bulkDownloadGradesAndResponsesRequest: bulkDownloadGradesAndResponsesAction,
      toggleDeleteAssignmentModal: toggleDeleteAssignmentModalAction,
    }
  )
)

export default enhance(AssignmentAdvanced)
