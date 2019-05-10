import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { isEmpty, get } from "lodash";
import * as moment from "moment";
import { message } from "antd";
import {
  fetchGroupsAction,
  getGroupsSelector,
  fetchGroupMembersAction,
  getStudentsSelector
} from "../../../sharedDucks/groups";
import { receivePerformanceBandAction } from "../../../PerformanceBand/ducks";

import {
  fetchAssignmentsAction,
  saveAssignmentAction,
  getAssignmentsSelector,
  getTestEntitySelector
} from "../../duck";
import { getUserOrgId } from "../../../src/selectors/user";

import ListHeader from "../../../src/components/common/ListHeader";
import SimpleOptions from "../SimpleOptions/SimpleOptions";
import AdvancedOptons from "../AdvancedOptons/AdvancedOptons";
import {
  Container,
  FullFlexContainer,
  PaginationInfo,
  AnchorLink,
  Anchor,
  SwitchWrapper,
  ViewSwitch,
  SwitchLabel,
  AssignButton
} from "./styled";

const initAssignment = {
  startDate: moment(),
  endDate: moment().add("days", 7),
  openPolicy: "Automatically on Start Date",
  closePolicy: "Automatically on Due Date",
  class: [],
  specificStudents: false
};

class AssignTest extends React.Component {
  state = {
    isAdvancedView: false,
    assignment: initAssignment
  };

  componentDidMount() {
    const {
      fetchGroups,
      fetchAssignments,
      group,
      assignments,
      match,
      fetchPerformanceBand,
      userOrgId,
      performanceBandData
    } = this.props;
    const { testId } = match.params;
    if (isEmpty(group)) {
      fetchGroups();
    }
    if (isEmpty(assignments) && testId) {
      fetchAssignments(testId);
    }
    if (isEmpty(performanceBandData)) {
      fetchPerformanceBand({ orgId: userOrgId });
    }
  }

  handleAssign = () => {
    const { assignment } = this.state;
    const { saveAssignment } = this.props;
    if (saveAssignment && !isEmpty(assignment.class)) {
      this.setState({ assignment: initAssignment });
      saveAssignment(assignment);
    } else {
      message.error("Please Select classes!");
    }
  };

  SwitchView = checked => {
    this.setState({ isAdvancedView: checked });
  };

  renderHeaderButton = () => (
    <AssignButton onClick={this.handleAssign} color="secondary" variant="create" shadow="none">
      ASSIGN
    </AssignButton>
  );

  updateAssignment = assignment => this.setState({ assignment });

  render() {
    const { isAdvancedView, assignment } = this.state;
    const { group, fetchStudents, students, testSettings } = this.props;

    return (
      <div>
        <ListHeader
          title="Assign TEST"
          midTitle="PICK CLASSES, GROUPS OR STUDENTS"
          btnTitle="ASSIGN"
          renderButton={this.renderHeaderButton}
        />

        <Container>
          <FullFlexContainer justifyContent="space-between">
            <PaginationInfo>
              &lt; <AnchorLink to="/author/tests">TEST LIBRARY</AnchorLink> /{" "}
              <AnchorLink to="/author/assessments/create">NEW ASSESSMENTS</AnchorLink> / <Anchor>TEST NAME</Anchor>
            </PaginationInfo>
            <SwitchWrapper>
              <SwitchLabel>SIMPLE</SwitchLabel>
              <ViewSwitch size="small" onChange={this.SwitchView} defaultChecked={isAdvancedView} />
              <SwitchLabel>ADVANCED</SwitchLabel>
            </SwitchWrapper>
          </FullFlexContainer>

          {isAdvancedView ? (
            <AdvancedOptons data={assignment} updateOptions={this.updateAssignment} testSettings={testSettings} />
          ) : (
            <SimpleOptions
              group={group}
              students={students}
              data={assignment}
              fetchStudents={fetchStudents}
              testSettings={testSettings}
              updateOptions={this.updateAssignment}
            />
          )}
        </Container>
      </div>
    );
  }
}

export default connect(
  state => ({
    group: getGroupsSelector(state),
    assignments: getAssignmentsSelector(state),
    students: getStudentsSelector(state),
    testSettings: getTestEntitySelector(state),
    userOrgId: getUserOrgId(state),
    performanceBandData: get(state, ["performanceBandReducer", "data"], [])
  }),
  {
    fetchGroups: fetchGroupsAction,
    fetchStudents: fetchGroupMembersAction,
    fetchAssignments: fetchAssignmentsAction,
    saveAssignment: saveAssignmentAction,
    fetchPerformanceBand: receivePerformanceBandAction
  }
)(AssignTest);

AssignTest.propTypes = {
  match: PropTypes.object.isRequired,
  fetchStudents: PropTypes.func.isRequired,
  fetchGroups: PropTypes.func.isRequired,
  fetchAssignments: PropTypes.func.isRequired,
  group: PropTypes.array.isRequired,
  students: PropTypes.array.isRequired,
  testSettings: PropTypes.object.isRequired,
  assignments: PropTypes.array.isRequired,
  saveAssignment: PropTypes.func.isRequired,
  fetchPerformanceBand: PropTypes.func.isRequired,
  userOrgId: PropTypes.string.isRequired,
  performanceBandData: PropTypes.object.isRequired
};
