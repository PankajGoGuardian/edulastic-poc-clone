import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { get, find } from 'lodash'
import PerfectScrollbar from 'react-perfect-scrollbar'

import { withWindowSizes, FlexContainer } from '@edulastic/common'
import { withNamespaces } from '@edulastic/localization'
import { roleuser, testTypes as testTypesConstants } from '@edulastic/constants'
import { IconFilter, IconAssignment } from '@edulastic/icons'

import {
  receiveAssignmentsAction,
  receiveAssignmentsSummaryAction,
  receiveAssignmentByIdAction,
  updateReleaseScoreSettingsAction,
  toggleReleaseScoreSettingsAction,
  toggleAssignmentViewAction,
  setAssignmentFiltersAction,
  editTagsRequestAction,
  setTagsUpdatingStateAction,
} from '../../../src/actions/assignments'
import { releaseScoreAction } from '../../../src/actions/classBoard'
import TestPreviewModal from './TestPreviewModal'
import {
  getAssignmentsSummary,
  getAssignmentsByTestSelector,
  getTestsSelector,
  getCurrentAssignmentSelector,
  getToggleReleaseGradeStateSelector,
  getAssignmentViewSelector,
  getAssignmentFilterSelector,
  getTagsUpdatingStateSelector,
} from '../../../src/selectors/assignments'
import {
  getUserOrgId,
  getUserRole,
  isFreeAdminSelector,
  isSAWithoutSchoolsSelector,
  getUserId,
} from '../../../src/selectors/user'

import FilterBar from '../FilterBar/FilterBar'
import TableList from '../TableList/TableList'
import AdvancedTable from '../TableList/AdvancedTable'
import ReleaseScoreSettingsModal from '../ReleaseScoreSettingsModal/ReleaseScoreSettingsModal'
import MobileTableList from '../MobileTableList/MobileTableList'
import ListHeader from '../../../src/components/common/ListHeader'
import LeftFilter from '../LeftFilter'
import {
  Container,
  Main,
  StyledCard,
  ViewSwitch,
  SwitchWrapper,
  SwitchLabel,
  TableWrapper,
  LeftWrapper,
  FixedWrapper,
} from './styled'

import PrintTestModal from '../../../src/components/common/PrintTestModal'
import TestLinkModal from '../TestLinkModal/TestLinkModal'

import {
  toggleDeleteAssignmentModalAction,
  getToggleDeleteAssignmentModalState,
} from '../../../sharedDucks/assignments'
import { DeleteAssignmentModal } from '../DeleteAssignmentModal/deleteAssignmentModal'
import {
  toggleAdminAlertModalAction,
  toggleVerifyEmailModalAction,
  getEmailVerified,
  getVerificationTS,
  isDefaultDASelector,
} from '../../../../student/Login/ducks'
import EditTagsModal from '../EditTagsModal'
import { getIsPreviewModalVisibleSelector } from '../../../../assessment/selectors/test'
import { setIsTestPreviewVisibleAction } from '../../../../assessment/actions/test'
import {
  getFilterFromSession,
  setFilterInSession,
} from '../../../../common/utils/helpers'
import { StyledEduButton } from '../../../Reports/common/styled'

const initialFilterState = {
  grades: [],
  subject: '',
  testTypes: [],
  folderId: '',
  classId: '',
  testId: '',
  assignedBy: '',
  showFilter: false,
}
class Assignments extends Component {
  state = {
    filterState: {},
    currentTestId: '',
    openPrintModal: false,
    showTestLinkModal: false,
    showTagsEditModal: false,
  }

  componentDidMount() {
    const {
      loadAssignments,
      loadAssignmentsSummary,
      districtId,
      userRole,
      orgData,
      isFreeAdmin,
      emailVerified,
      verificationTS,
      isDefaultDA,
      isSAWithoutSchools,
      history,
      toggleAdminAlertModal,
      toggleVerifyEmailModal,
      userId,
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
    const { defaultTermId, terms } = orgData
    const storedFilters = getFilterFromSession({
      key: 'assignments_filter',
      userId,
      districtId,
    })
    const { showFilter = userRole !== roleuser.TEACHER } = storedFilters
    const filters = {
      ...initialFilterState,
      ...storedFilters,
      showFilter,
    }
    if (
      (userRole === roleuser.SCHOOL_ADMIN ||
        userRole === roleuser.DISTRICT_ADMIN) &&
      !Object.prototype.hasOwnProperty.call(storedFilters, 'testTypes')
    ) {
      filters.testTypes =
        testTypesConstants.DEFAULT_ADMIN_TEST_TYPE_MAP_FILTER[userRole]
    }
    if (defaultTermId && !storedFilters.termId) {
      const isTermExists = terms.some(({ _id }) => _id === defaultTermId)
      filters.termId = isTermExists ? defaultTermId : ''
    }
    if (!defaultTermId) {
      filters.termId = storedFilters.termId || ''
    }
    if (userRole === roleuser.TEACHER) {
      loadAssignments({ filters, folderId: filters.folderId })
    } else {
      loadAssignmentsSummary({
        districtId,
        filters: { ...filters, pageNo: 1 },
        filtering: true,
        folderId: filters.folderId,
      })
    }
    this.setFilterState(filters)
  }

  setFilterState = (filterState) => {
    const { userId, districtId } = this.props
    setFilterInSession({
      key: 'assignments_filter',
      userId,
      districtId,
      filter: filterState,
    })
    this.setState({ filterState })
  }

  componentDidUpdate(prevProps) {
    const { defaultTermId: prevDefaultTermId } = prevProps?.orgData
    const { defaultTermId } = this.props?.orgData
    const { filterState } = this.state
    const termId = filterState?.termId || defaultTermId

    if (!prevDefaultTermId && defaultTermId) {
      this.setFilterState({ ...filterState, termId })
    }
  }

  hidePreviewModal = () => {
    const { setIsTestPreviewVisible } = this.props
    setIsTestPreviewVisible(false)
  }

  showPreviewModal = (testId, currentAssignmentId, currentAssignmentClass) => {
    const { setIsTestPreviewVisible } = this.props
    setIsTestPreviewVisible(true)
    this.setState({
      currentTestId: testId,
      currentAssignmentId,
      currentAssignmentClass,
    })
  }

  toggleEditModal = (currentTestId) => {
    this.onEnableEdit(currentTestId)
  }

  toggleDeleteModal = (currentTestId) => {
    const { toggleDeleteAssignmentModal } = this.props
    toggleDeleteAssignmentModal(true)
    this.setState({ currentTestId })
  }

  togglePrintModal = (
    currentTestId = '',
    currentAssignmentId,
    currentClassId
  ) => {
    const { openPrintModal } = this.state
    this.setState({
      openPrintModal: !openPrintModal,
      currentTestId,
      currentAssignmentId,
      currentClassId,
    })
  }

  gotoPrintView = (data) => {
    const { type, customValue, showAnswers } = data
    const { currentTestId, currentAssignmentId, currentClassId } = this.state

    window.open(
      `/author/printAssessment/${currentTestId}?type=${type}&showAnswers=${showAnswers}&assignmentId=${currentAssignmentId}${
        currentClassId ? `&groupId=${currentClassId}` : ''
      }${type === 'custom' ? `&qs=${customValue}` : ''}`,
      '_blank'
    )
    this.togglePrintModal()
  }

  handleCreate = () => {
    const { history } = this.props
    history.push('/author/tests/select')
  }

  onOpenReleaseScoreSettings = (testId, assignmentId) => {
    const { loadAssignmentById } = this.props
    loadAssignmentById({ testId, assignmentId })
    this.setState({ currentTestId: testId })
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

  SwitchView = () => {
    const { toggleAssignmentView } = this.props
    if (toggleAssignmentView) {
      toggleAssignmentView()
    }
  }

  renderFilter = () => {
    const { windowWidth, windowHeight } = this.props
    return <FilterBar windowWidth={windowWidth} windowHeight={windowHeight} />
  }

  renderSwitch = (isAdvancedView) => (
    <SwitchWrapper>
      <SwitchWrapper>
        <SwitchLabel>TEACHER</SwitchLabel>
        <ViewSwitch
          checked={isAdvancedView}
          size="small"
          onChange={this.SwitchView}
        />
        <SwitchLabel>ADVANCED</SwitchLabel>
      </SwitchWrapper>
    </SwitchWrapper>
  )

  toggleFilter = () => {
    const { userId, districtId } = this.props
    this.setState(
      (prev) => ({
        filterState: {
          ...prev.filterState,
          showFilter: !prev.filterState.showFilter,
        },
      }),
      () => {
        const { filterState } = this.state
        setFilterInSession({
          key: 'assignments_filter',
          userId,
          districtId,
          filter: filterState,
        })
      }
    )
  }

  onEnableEdit = (currentTestId) => {
    const { history } = this.props
    history.push({
      pathname: `/author/tests/tab/review/id/${currentTestId}`,
      state: { editAssigned: true, showCancelButton: true },
    })
  }

  showEmbedLinkModal = (testId) => {
    this.setState({
      showTestLinkModal: true,
      currentTestId: testId,
    })
  }

  toggleTagsEditModal = (testId) => {
    const { showTagsEditModal } = this.state
    this.setState({
      showTagsEditModal: !showTagsEditModal,
      currentTestId: testId,
    })
  }

  render() {
    const {
      assignmentsByTestId,
      tests,
      isShowReleaseSettingsPopup,
      toggleReleaseGradePopUp,
      assignmentsSummary,
      districtId,
      error,
      isAdvancedView,
      toggleDeleteAssignmentModalState,
      t,
      userRole,
      editTagsRequest,
      tagsUpdatingState,
      loadAssignments,
      loadAssignmentsSummary,
      setTagsUpdatingState,
      isPreviewModalVisible,
    } = this.props

    const {
      filterState,
      currentTestId,
      currentAssignmentId,
      currentAssignmentClass,
      openPrintModal,
      showTestLinkModal,
      showTagsEditModal,
    } = this.state
    const { showFilter = false } = filterState
    const tabletWidth = 768

    let currentTest = find(tests, (o) => o._id === currentTestId)
    if (!currentTest) {
      currentTest = find(assignmentsSummary, (o) => o.testId === currentTestId)
    }

    return (
      <div>
        <TestLinkModal
          isVisible={showTestLinkModal}
          toggleModal={() =>
            this.setState({ showTestLinkModal: !showTestLinkModal })
          }
          testId={currentTestId}
        />
        {toggleDeleteAssignmentModalState ? (
          <DeleteAssignmentModal
            testId={currentTestId}
            testName={currentTest?.title}
            testType={currentTest?.testType}
          />
        ) : null}
        <TestPreviewModal
          isModalVisible={isPreviewModalVisible}
          testId={currentTestId}
          error={error}
          showStudentPerformance
          closeTestPreviewModal={this.hidePreviewModal}
          currentAssignmentId={currentAssignmentId}
          currentAssignmentClass={currentAssignmentClass}
        />
        {openPrintModal && (
          <PrintTestModal
            onProceed={this.gotoPrintView}
            onCancel={this.togglePrintModal}
            currentTestId={currentTestId}
            assignmentId={currentAssignmentId}
            showAnswerCheckbox
          />
        )}
        {showTagsEditModal && (
          <EditTagsModal
            visible={showTagsEditModal}
            toggleModal={this.toggleTagsEditModal}
            testId={currentTestId}
            assignments={assignmentsByTestId[currentTestId]}
            assignmentsSummary={assignmentsSummary}
            userRole={userRole}
            editTagsRequest={editTagsRequest}
            tagsUpdatingState={tagsUpdatingState}
            loadAssignments={loadAssignments}
            loadAssignmentsSummary={loadAssignmentsSummary}
            districtId={districtId}
            filters={filterState}
            setTagsUpdatingState={setTagsUpdatingState}
          />
        )}
        <ListHeader
          onCreate={this.handleCreate}
          createAssignment
          title={t('common.assignmentsTitle')}
          titleIcon={IconAssignment}
          btnTitle="AUTHOR TEST"
          isAdvancedView={isAdvancedView}
        />
        <Container padding="30px">
          <FlexContainer height="100%">
            <Main>
              {window.innerWidth >= tabletWidth ? (
                <>
                  <LeftWrapper showFilter={showFilter}>
                    <FixedWrapper>
                      <PerfectScrollbar options={{ suppressScrollX: true }}>
                        <LeftFilter
                          onSetFilter={this.setFilterState}
                          filterState={filterState}
                          isAdvancedView={isAdvancedView}
                        />
                      </PerfectScrollbar>
                    </FixedWrapper>
                  </LeftWrapper>
                  <TableWrapper showFilter={showFilter}>
                    <StyledEduButton
                      data-cy="smart-filter"
                      data-test={showFilter ? 'expanded' : 'collapsed'}
                      isGhost={showFilter}
                      onClick={this.toggleFilter}
                      style={{
                        height: '24px',
                        margin: '-15px 0px 5px 25px',
                        borderRadius: '15px',
                      }}
                    >
                      <IconFilter width={15} height={15} />
                      FILTERS
                    </StyledEduButton>

                    <StyledCard>
                      {isAdvancedView ? (
                        <AdvancedTable
                          districtId={districtId}
                          assignmentsSummary={assignmentsSummary}
                          onOpenReleaseScoreSettings={
                            this.onOpenReleaseScoreSettings
                          }
                          filters={filterState}
                          toggleEditModal={this.toggleEditModal}
                          toggleDeleteModal={this.toggleDeleteModal}
                          showPreviewModal={this.showPreviewModal}
                          showFilter={showFilter}
                          togglePrintModal={this.togglePrintModal}
                          showEmbedLinkModal={this.showEmbedLinkModal}
                          toggleTagsEditModal={this.toggleTagsEditModal}
                        />
                      ) : (
                        <TableList
                          showEmbedLinkModal={this.showEmbedLinkModal}
                          assignmentsByTestId={assignmentsByTestId}
                          tests={tests}
                          toggleEditModal={this.toggleEditModal}
                          toggleDeleteModal={this.toggleDeleteModal}
                          onOpenReleaseScoreSettings={
                            this.onOpenReleaseScoreSettings
                          }
                          showPreviewModal={this.showPreviewModal}
                          showFilter={showFilter}
                          status={filterState.status}
                          togglePrintModal={this.togglePrintModal}
                          toggleTagsEditModal={this.toggleTagsEditModal}
                        />
                      )}
                    </StyledCard>
                  </TableWrapper>
                </>
              ) : (
                <MobileTableList
                  assignmentsByTestId={assignmentsByTestId}
                  tests={tests}
                  onOpenReleaseScoreSettings={this.onOpenReleaseScoreSettings}
                />
              )}
            </Main>
          </FlexContainer>
        </Container>
        <ReleaseScoreSettingsModal
          subText=" Selected score policy will be applied to all the classes within
        assignment"
          showReleaseGradeSettings={isShowReleaseSettingsPopup}
          onCloseReleaseScoreSettings={() => toggleReleaseGradePopUp(false)}
          updateReleaseScoreSettings={this.onUpdateReleaseScoreSettings}
        />
      </div>
    )
  }
}

Assignments.propTypes = {
  assignmentsSummary: PropTypes.array,
  loadAssignmentsSummary: PropTypes.func.isRequired,
  assignmentsByTestId: PropTypes.object.isRequired,
  loadAssignments: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  windowWidth: PropTypes.number.isRequired,
  windowHeight: PropTypes.number.isRequired,
  loadAssignmentById: PropTypes.func.isRequired,
  toggleReleaseGradePopUp: PropTypes.func.isRequired,
  tests: PropTypes.array.isRequired,
  isShowReleaseSettingsPopup: PropTypes.bool.isRequired,
  districtId: PropTypes.string.isRequired,
  toggleAssignmentView: PropTypes.func.isRequired,
  isAdvancedView: PropTypes.bool.isRequired,
  orgData: PropTypes.object.isRequired,
}

Assignments.defaultProps = {
  assignmentsSummary: [],
}

const enhance = compose(
  withWindowSizes,
  withNamespaces('header'),
  connect(
    (state) => ({
      assignmentsSummary: getAssignmentsSummary(state),
      assignmentsByTestId: getAssignmentsByTestSelector(state),
      tests: getTestsSelector(state),
      currentAssignment: getCurrentAssignmentSelector(state),
      isShowReleaseSettingsPopup: getToggleReleaseGradeStateSelector(state),
      districtId: getUserOrgId(state),
      isAdvancedView: getAssignmentViewSelector(state),
      userRole: getUserRole(state),
      error: get(state, 'test.error', false),
      emailVerified: getEmailVerified(state),
      verificationTS: getVerificationTS(state),
      isDefaultDA: isDefaultDASelector(state),
      defaultFilters: getAssignmentFilterSelector(state),
      orgData: get(state, 'user.user.orgData', {}),
      toggleDeleteAssignmentModalState: getToggleDeleteAssignmentModalState(
        state
      ),
      isFreeAdmin: isFreeAdminSelector(state),
      isSAWithoutSchools: isSAWithoutSchoolsSelector(state),
      tagsUpdatingState: getTagsUpdatingStateSelector(state),
      isPreviewModalVisible: getIsPreviewModalVisibleSelector(state),
      userId: getUserId(state),
    }),
    {
      loadAssignments: receiveAssignmentsAction,
      loadAssignmentsSummary: receiveAssignmentsSummaryAction,
      loadAssignmentById: receiveAssignmentByIdAction,
      updateReleaseScoreSettings: updateReleaseScoreSettingsAction,
      setReleaseScore: releaseScoreAction,
      toggleReleaseGradePopUp: toggleReleaseScoreSettingsAction,
      setAssignmentFilters: setAssignmentFiltersAction,
      toggleAssignmentView: toggleAssignmentViewAction,
      toggleDeleteAssignmentModal: toggleDeleteAssignmentModalAction,
      toggleAdminAlertModal: toggleAdminAlertModalAction,
      toggleVerifyEmailModal: toggleVerifyEmailModalAction,
      editTagsRequest: editTagsRequestAction,
      setTagsUpdatingState: setTagsUpdatingStateAction,
      setIsTestPreviewVisible: setIsTestPreviewVisibleAction,
    }
  )
)

export default enhance(Assignments)
