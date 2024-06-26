import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { compose } from "redux";
import { get, find } from "lodash";
import PerfectScrollbar from "react-perfect-scrollbar";

import { withWindowSizes, FlexContainer } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";
import { roleuser, test as testConstants } from "@edulastic/constants";
import { IconFilter, IconAssignment } from "@edulastic/icons";
import { white, themeColor } from "@edulastic/colors";

import {
  receiveAssignmentsAction,
  receiveAssignmentsSummaryAction,
  receiveAssignmentByIdAction,
  updateReleaseScoreSettingsAction,
  toggleReleaseScoreSettingsAction,
  toggleAssignmentViewAction,
  setAssignmentFiltersAction
} from "../../../src/actions/assignments";
import { releaseScoreAction } from "../../../src/actions/classBoard";
import TestPreviewModal from "./TestPreviewModal";
import {
  getAssignmentsSummary,
  getAssignmentsByTestSelector,
  getTestsSelector,
  getCurrentAssignmentSelector,
  getToggleReleaseGradeStateSelector,
  getDistrictIdSelector,
  getAssignmentViewSelector,
  getAssignmentFilterSelector
} from "../../../src/selectors/assignments";

import FilterBar from "../FilterBar/FilterBar";
import TableList from "../TableList/TableList";
import AdvancedTable from "../TableList/AdvancedTable";
import ReleaseScoreSettingsModal from "../ReleaseScoreSettingsModal/ReleaseScoreSettingsModal";
import MobileTableList from "../MobileTableList/MobileTableList";
import ListHeader from "../../../src/components/common/ListHeader";
import LeftFilter from "../LeftFilter";
import {
  Container,
  Main,
  StyledCard,
  ViewSwitch,
  SwitchWrapper,
  SwitchLabel,
  FilterButton,
  TableWrapper,
  LeftWrapper,
  FixedWrapper
} from "./styled";
import { getUserRole } from "../../../src/selectors/user";
import EditTestModal from "../../../src/components/common/EditTestModal";
import PrintTestModal from "../../../src/components/common/PrintTestModal";

import {
  toggleDeleteAssignmentModalAction,
  getToggleDeleteAssignmentModalState
} from "../../../sharedDucks/assignments";
import { DeleteAssignmentModal } from "../DeleteAssignmentModal/deleteAssignmentModal";

const initialFilterState = {
  grades: [],
  subject: "",
  testType: "",
  folderId: "",
  classId: "",
  testId: "",
  assignedBy: "",
  showFilter: false
};
class Assignments extends Component {
  state = {
    filterState: {},
    isPreviewModalVisible: false,
    openEditPopup: false,
    currentTestId: "",
    openPrintModal: false
  };

  componentDidMount() {
    const { loadAssignments, loadAssignmentsSummary, districtId, userRole, orgData } = this.props;

    const { defaultTermId, terms } = orgData;
    const storedFilters = JSON.parse(sessionStorage.getItem("filters[Assignments]")) || {};
    const { showFilter = userRole !== roleuser.TEACHER } = storedFilters;
    const filters = {
      ...initialFilterState,
      ...storedFilters,
      showFilter
    };
    if (
      (userRole === roleuser.SCHOOL_ADMIN || userRole === roleuser.DISTRICT_ADMIN) &&
      !Object.prototype.hasOwnProperty.call(storedFilters, "testType")
    ) {
      filters.testType = testConstants.type.COMMON;
    }
    if (defaultTermId && !Object.prototype.hasOwnProperty.call(storedFilters, "termId")) {
      const isTermExists = terms.some(({ _id }) => _id === defaultTermId);
      filters.termId = isTermExists ? defaultTermId : "";
    }
    if (!defaultTermId) {
      filters.termId = storedFilters.termId || "";
    }
    if (userRole === roleuser.TEACHER) {
      loadAssignments({ filters });
    } else {
      loadAssignmentsSummary({ districtId, filters: { ...filters, pageNo: 1 }, filtering: true });
    }
    this.setFilterState(filters);
  }

  setFilterState = filterState => {
    sessionStorage.setItem("filters[Assignments]", JSON.stringify(filterState));
    this.setState({ filterState });
  };

  hidePreviewModal = () => {
    this.setState({ isPreviewModalVisible: false });
  };

  showPreviewModal = (testId, currentAssignmentId, currentAssignmentClass) => {
    this.setState({ isPreviewModalVisible: true, currentTestId: testId, currentAssignmentId, currentAssignmentClass });
  };

  toggleEditModal = (value, currentTestId) => {
    this.setState({ openEditPopup: value, currentTestId });
  };

  toggleDeleteModal = currentTestId => {
    const { toggleDeleteAssignmentModal } = this.props;
    toggleDeleteAssignmentModal(true);
    this.setState({ currentTestId });
  };

  togglePrintModal = (currentTestId = "", currentAssignmentId, currentClassId) => {
    const { openPrintModal } = this.state;
    this.setState({ openPrintModal: !openPrintModal, currentTestId, currentAssignmentId, currentClassId });
  };

  gotoPrintView = data => {
    const { type, customValue } = data;
    const { currentTestId, currentAssignmentId, currentClassId } = this.state;

    window.open(
      `/author/printAssessment/${currentTestId}?type=${type}&assignmentId=${currentAssignmentId}&groupId=${currentClassId}&qs=${
        type === "custom" ? customValue : ""
      }`,
      "_blank"
    );
    this.togglePrintModal();
  };

  handleCreate = () => {
    const { history } = this.props;
    history.push("/author/tests/select");
  };

  onOpenReleaseScoreSettings = (testId, assignmentId) => {
    const { loadAssignmentById } = this.props;
    loadAssignmentById({ testId, assignmentId });
    this.setState({ currentTestId: testId });
  };

  onUpdateReleaseScoreSettings = releaseScore => {
    const { currentTestId, filterState } = this.state;
    const { setReleaseScore, toggleReleaseGradePopUp } = this.props;
    setReleaseScore(undefined, undefined, releaseScore, currentTestId, filterState);
    toggleReleaseGradePopUp(false);
  };

  SwitchView = () => {
    const { toggleAssignmentView } = this.props;
    if (toggleAssignmentView) {
      toggleAssignmentView();
    }
  };

  renderFilter = () => {
    const { windowWidth, windowHeight } = this.props;
    return <FilterBar windowWidth={windowWidth} windowHeight={windowHeight} />;
  };

  renderSwitch = isAdvancedView => (
    <SwitchWrapper>
      <SwitchWrapper>
        <SwitchLabel>TEACHER</SwitchLabel>
        <ViewSwitch checked={isAdvancedView} size="small" onChange={this.SwitchView} />
        <SwitchLabel>ADVANCED</SwitchLabel>
      </SwitchWrapper>
    </SwitchWrapper>
  );

  toggleFilter = () => {
    this.setState(
      prev => ({ filterState: { ...prev.filterState, showFilter: !prev.filterState.showFilter } }),
      () => {
        const { filterState } = this.state;
        sessionStorage.setItem("filters[Assignments]", JSON.stringify(filterState));
      }
    );
  };

  onEnableEdit = () => {
    const { history } = this.props;
    const { currentTestId } = this.state;
    history.push({
      pathname: `/author/tests/tab/review/id/${currentTestId}`,
      state: { editAssigned: true, showCancelButton: true }
    });
  };

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
      t
    } = this.props;
    const {
      filterState,
      isPreviewModalVisible,
      currentTestId,
      openEditPopup,
      currentAssignmentId,
      currentAssignmentClass,
      openPrintModal
    } = this.state;
    const { showFilter = false } = filterState;
    const tabletWidth = 768;

    let currentTest = find(tests, o => o._id === currentTestId);
    if (!currentTest) {
      currentTest = find(assignmentsSummary, o => o.testId === currentTestId);
    }

    return (
      <div>
        <EditTestModal
          visible={openEditPopup}
          isUsed
          onCancel={() => this.toggleEditModal(false, "")}
          onOk={this.onEnableEdit}
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
          />
        )}
        <ListHeader
          onCreate={this.handleCreate}
          createAssignment
          title={t("common.assignmentsTitle")}
          titleIcon={IconAssignment}
          btnTitle="AUTHOR TEST"
          isAdvancedView={isAdvancedView}
        />
        <Container padding="30px">
          <FlexContainer>
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
                    <FilterButton showFilter={showFilter} variant="filter" onClick={this.toggleFilter}>
                      <IconFilter
                        data-cy="smart-filter"
                        data-test={showFilter ? "expanded" : "collapsed"}
                        color={showFilter ? white : themeColor}
                        width={20}
                        height={20}
                      />
                    </FilterButton>
                    <StyledCard>
                      {isAdvancedView ? (
                        <AdvancedTable
                          districtId={districtId}
                          assignmentsSummary={assignmentsSummary}
                          onOpenReleaseScoreSettings={this.onOpenReleaseScoreSettings}
                          filters={filterState}
                          toggleEditModal={this.toggleEditModal}
                          toggleDeleteModal={this.toggleDeleteModal}
                          showPreviewModal={this.showPreviewModal}
                          showFilter={showFilter}
                          togglePrintModal={this.togglePrintModal}
                        />
                      ) : (
                        <TableList
                          assignmentsByTestId={assignmentsByTestId}
                          tests={tests}
                          toggleEditModal={this.toggleEditModal}
                          toggleDeleteModal={this.toggleDeleteModal}
                          onOpenReleaseScoreSettings={this.onOpenReleaseScoreSettings}
                          showPreviewModal={this.showPreviewModal}
                          showFilter={showFilter}
                          status={filterState.status}
                          togglePrintModal={this.togglePrintModal}
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
          showReleaseGradeSettings={isShowReleaseSettingsPopup}
          onCloseReleaseScoreSettings={() => toggleReleaseGradePopUp(false)}
          updateReleaseScoreSettings={this.onUpdateReleaseScoreSettings}
        />
      </div>
    );
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
  orgData: PropTypes.object.isRequired
};

Assignments.defaultProps = {
  assignmentsSummary: []
};

const enhance = compose(
  withWindowSizes,
  withNamespaces("header"),
  connect(
    state => ({
      assignmentsSummary: getAssignmentsSummary(state),
      assignmentsByTestId: getAssignmentsByTestSelector(state),
      tests: getTestsSelector(state),
      currentAssignment: getCurrentAssignmentSelector(state),
      isShowReleaseSettingsPopup: getToggleReleaseGradeStateSelector(state),
      districtId: getDistrictIdSelector(state),
      isAdvancedView: getAssignmentViewSelector(state),
      userRole: getUserRole(state),
      error: get(state, "test.error", false),
      defaultFilters: getAssignmentFilterSelector(state),
      orgData: get(state, "user.user.orgData", {}),
      toggleDeleteAssignmentModalState: getToggleDeleteAssignmentModalState(state)
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
      toggleDeleteAssignmentModal: toggleDeleteAssignmentModalAction
    }
  )
);

export default enhance(Assignments);
