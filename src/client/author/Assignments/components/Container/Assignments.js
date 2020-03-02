import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { compose } from "redux";
import { get, find } from "lodash";
import PerfectScrollbar from "react-perfect-scrollbar";

import { withWindowSizes, FlexContainer } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";
import { roleuser } from "@edulastic/constants";
import { IconFilter } from "@edulastic/icons";
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
import { receiveFolderAction } from "../../../src/actions/folder";
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
  showFilter: false
};
class Assignments extends Component {
  state = {
    selectedRows: [],
    filterState: {},
    isPreviewModalVisible: false,
    openEditPopup: false,
    currentTestId: ""
  };

  componentDidMount() {
    const {
      loadAssignments,
      loadAssignmentsSummary,
      districtId,
      loadFolders,
      userRole,
      orgData
    } = this.props;

    const { defaultTermId, terms } = orgData;
    const storedFilters = JSON.parse(sessionStorage.getItem("filters[Assignments]")) || {};
    const { showFilter = userRole !== roleuser.TEACHER } = storedFilters;
    const filters = {
      ...initialFilterState,
      ...storedFilters,
      showFilter
    };
    if (defaultTermId && !storedFilters.hasOwnProperty("termId")) {
      const isTermExists = terms.some(({ _id }) => _id === defaultTermId);
      filters.termId = isTermExists ? defaultTermId : "";
    }
    if (!defaultTermId) {
      filters.termId = storedFilters.termId || "";
    }

    loadAssignments({ filters });

    loadFolders();
    loadAssignmentsSummary({ districtId, filters: { ...filters, pageNo: 1 }, filtering: true });
    this.setState({ filterState: filters });
  }

  setFilterState = filterState => {
    sessionStorage.setItem("filters[Assignments]", JSON.stringify(filterState));
    this.setState({ filterState });
  };

  hidePreviewModal = () => {
    this.setState({ isPreviewModalVisible: false });
  };

  showPreviewModal = testId => {
    this.setState({ isPreviewModalVisible: true, currentTestId: testId });
  };

  toggleEditModal = (value, currentTestId) => {
    this.setState({ openEditPopup: value, currentTestId });
  };

  toggleDeleteModal = currentTestId => {
    const { toggleDeleteAssignmentModalAction } = this.props;
    toggleDeleteAssignmentModalAction(true);
    this.setState({ currentTestId });
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
    this.setState({ selectedRows: [] }, toggleAssignmentView);
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
    const { filterState } = this.state;
    this.setState(
      prev => ({ filterState: { ...prev.filterState, showFilter: !prev.filterState.showFilter } }),
      () => {
        sessionStorage.setItem("filters[Assignments]", JSON.stringify(filterState));
      }
    );
  };

  onSelectRow = selected => {
    this.setState({ selectedRows: selected });
  };

  onEnableEdit = () => {
    const { history } = this.props;
    const { currentTestId } = this.state;
    history.push({
      pathname: `/author/tests/${currentTestId}/editAssigned`,
      state: { showCancelButton: true }
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
      toggleDeleteAssignmentModalState
    } = this.props;
    const {
      selectedRows,
      filterState,
      isPreviewModalVisible,
      currentTestId,
      openEditPopup
    } = this.state;
    const { showFilter = false } = filterState;
    const tabletWidth = 768;

    const currentTest = find(tests, o => o._id === currentTestId);

    return (
      <div>
        <EditTestModal
          visible={openEditPopup}
          isUsed
          onCancel={() => this.toggleEditModal(false, "")}
          onOk={this.onEnableEdit}
        />
        {toggleDeleteAssignmentModalState ? (
          <DeleteAssignmentModal testId={currentTestId} testName={currentTest?.title} />
        ) : null}
        <TestPreviewModal
          isModalVisible={isPreviewModalVisible}
          testId={currentTestId}
          error={error}
          closeTestPreviewModal={this.hidePreviewModal}
        />
        <ListHeader
          onCreate={this.handleCreate}
          createAssignment
          title="common.assignmentsTitle"
          btnTitle="AUTHOR TEST"
          isAdvancedView={isAdvancedView}
        />
        <Container padding="30px">
          <FlexContainer>
            <Main>
              {window.innerWidth >= tabletWidth ? (
                <>
                  {showFilter && (
                    <LeftWrapper>
                      <FixedWrapper>
                        <PerfectScrollbar option={{ suppressScrollX: true }}>
                          <LeftFilter
                            selectedRows={selectedRows}
                            onSetFilter={this.setFilterState}
                            filterState={filterState}
                            isAdvancedView={isAdvancedView}
                            clearSelectedRow={() => this.onSelectRow([])}
                          />
                        </PerfectScrollbar>
                      </FixedWrapper>
                    </LeftWrapper>
                  )}
                  <TableWrapper showFilter={showFilter}>
                    <FilterButton
                      showFilter={showFilter}
                      variant="filter"
                      onClick={this.toggleFilter}
                    >
                      <IconFilter
                        data-cy="smart-filter"
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
                          onSelectRow={this.onSelectRow}
                          selectedRows={selectedRows}
                          onOpenReleaseScoreSettings={this.onOpenReleaseScoreSettings}
                          filters={filterState}
                          toggleEditModal={this.toggleEditModal}
                          showPreviewModal={this.showPreviewModal}
                          showFilter={showFilter}
                        />
                      ) : (
                        <TableList
                          assignmentsByTestId={assignmentsByTestId}
                          tests={tests}
                          toggleEditModal={this.toggleEditModal}
                          toggleDeleteModal={this.toggleDeleteModal}
                          onSelectRow={this.onSelectRow}
                          selectedRows={selectedRows}
                          onOpenReleaseScoreSettings={this.onOpenReleaseScoreSettings}
                          showPreviewModal={this.showPreviewModal}
                          showFilter={showFilter}
                          status={filterState.status}
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
  loadFolders: PropTypes.func.isRequired,
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
      loadFolders: receiveFolderAction,
      loadAssignmentsSummary: receiveAssignmentsSummaryAction,
      loadAssignmentById: receiveAssignmentByIdAction,
      updateReleaseScoreSettings: updateReleaseScoreSettingsAction,
      setReleaseScore: releaseScoreAction,
      toggleReleaseGradePopUp: toggleReleaseScoreSettingsAction,
      setAssignmentFilters: setAssignmentFiltersAction,
      toggleAssignmentView: toggleAssignmentViewAction,
      toggleDeleteAssignmentModalAction
    }
  )
);

export default enhance(Assignments);
