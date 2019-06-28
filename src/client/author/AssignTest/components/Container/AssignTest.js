import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { isEmpty, get, keyBy } from "lodash";
import * as moment from "moment";
import { message } from "antd";
import {
  fetchGroupsAction,
  getGroupsSelector,
  fetchGroupMembersAction,
  getStudentsSelector
} from "../../../sharedDucks/groups";
import { receivePerformanceBandAction } from "../../../PerformanceBand/ducks";
import { receiveTestByIdAction, getTestSelector } from "../../../TestPage/ducks";

import {
  fetchAssignmentsAction,
  saveAssignmentAction,
  getAssignmentsSelector,
  getTestEntitySelector
} from "../../duck";
import { getUserOrgId, getUserRole } from "../../../src/selectors/user";

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
import { getPlaylistSelector, receivePlaylistByIdAction } from "../../../PlaylistPage/ducks";

const initAssignment = {
  startDate: moment(),
  openPolicy: "Automatically on Start Date",
  closePolicy: "Automatically on Due Date",
  class: [],
  specificStudents: false
};

const setTime = userRole => {
  const addDate = userRole !== "teacher" ? 28 : 7;
  return moment()
    .add("days", addDate)
    .set({ hour: 23, minute: 0, second: 0, millisecond: 0 });
};

class AssignTest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isAdvancedView: false,
      assignment: {
        ...initAssignment,
        endDate: setTime(props.userRole)
      }
    };
  }

  componentDidMount() {
    const {
      fetchTestByID,
      fetchGroups,
      fetchAssignments,
      group,
      assignments,
      match,
      fetchPerformanceBand,
      userOrgId,
      isPlaylist,
      fetchPlaylistById,
      performanceBandData,
      userRole
    } = this.props;
    const { testId } = match.params;
    if (isEmpty(group)) {
      fetchGroups();
    }
    if (isEmpty(performanceBandData)) {
      fetchPerformanceBand({ orgId: userOrgId });
    }
    if (isPlaylist) {
      fetchPlaylistById(match.params.playlistId);
      this.setState(prevState => ({
        assignment: {
          ...prevState.assignment,
          playlistId: match.params.playlistId,
          playlistModuleId: match.params.moduleId,
          testId: match.params.testId,
          openPolicy: userRole === "district-admin" ? "Open Manually by Teacher" : prevState.assignment.openPolicy,
          closePolicy: userRole === "district-admin" ? "Close Manually by Admin" : prevState.assignment.closePolicy
        }
      }));
    } else {
      if (userRole !== "teacher") {
        this.setState(prevState => ({
          assignment: {
            ...prevState.assignment,
            openPolicy: "Open Manually by Teacher"
          }
        }));
      }
      if (isEmpty(assignments) && testId) {
        fetchAssignments(testId);
      }
      if (testId) {
        fetchTestByID(testId);
      }
    }
  }

  handleAssign = () => {
    const { assignment } = this.state;
    const { saveAssignment } = this.props;
    if (!assignment.requirePassword) {
      delete assignment.assignmentPassword;
    } else if (assignment.assignmentPassword.length < 6 || assignment.assignmentPassword.length > 25) {
      return message.error("Please add a valid password.");
    }
    if (saveAssignment && isEmpty(assignment.class)) {
      message.error("Please select at least one class to assign.");
    } else if (saveAssignment && assignment.endDate < Date.now()) {
      message.error("Please Enter a future end date. ");
    } else {
      saveAssignment(assignment);
    }
  };

  SwitchView = checked => {
    this.setState({ isAdvancedView: checked });
  };

  renderHeaderButton = () => (
    <AssignButton data-cy="assignButton" onClick={this.handleAssign} color="secondary" variant="create" shadow="none">
      ASSIGN
    </AssignButton>
  );

  updateAssignment = assignment => this.setState({ assignment });

  onClassFieldChange = (value, group) => {
    const { assignment } = this.state;
    const groupById = keyBy(group, "_id");
    const classData = value.map(_id => ({
      _id,
      name: get(groupById, `${_id}.name`, ""),
      assignedCount: get(groupById, `${_id}.studentCount`, 0),
      grade: get(groupById, `${_id}.grade`, ""),
      subject: get(groupById, `${_id}.subject`, "")
    }));

    let termId = "";
    if (assignment.termId) {
      termId = assignment.termId;
    } else if (value.length) {
      const [initialClassId] = value;
      termId = groupById[initialClassId].termId;
    }
    return {
      classData,
      termId
    };
  };

  render() {
    const { isAdvancedView, assignment } = this.state;
    const { group, fetchStudents, students, testSettings, testItem, isPlaylist, playlist } = this.props;
    const { title, _id } = isPlaylist ? playlist : testItem;

    return (
      <div>
        <ListHeader
          title={`Assign ${isPlaylist ? "PLAYLIST" : "TEST"}`}
          midTitle="PICK CLASSES, GROUPS OR STUDENTS"
          btnTitle="ASSIGN"
          renderButton={this.renderHeaderButton}
        />

        <Container>
          <FullFlexContainer justifyContent="space-between">
            <PaginationInfo>
              &lt;{" "}
              <AnchorLink to={`/author/${isPlaylist ? "playlists" : "tests"}`}>
                {isPlaylist ? "PLAYLIST LIBRARY" : "TEST LIBRARY"}
              </AnchorLink>
              &nbsp;/&nbsp;
              <AnchorLink to={`/author/${isPlaylist ? "playlists" : "tests"}/${_id}#review`}>{title}</AnchorLink>
              &nbsp;/&nbsp;
              <Anchor>Assign</Anchor>
            </PaginationInfo>
            <SwitchWrapper>
              <SwitchLabel>SIMPLE</SwitchLabel>
              <ViewSwitch size="small" onChange={this.SwitchView} defaultChecked={isAdvancedView} />
              <SwitchLabel>ADVANCED</SwitchLabel>
            </SwitchWrapper>
          </FullFlexContainer>

          {isAdvancedView ? (
            <AdvancedOptons
              assignment={assignment}
              updateOptions={this.updateAssignment}
              testSettings={testSettings}
              onClassFieldChange={this.onClassFieldChange}
            />
          ) : (
            <SimpleOptions
              group={group}
              students={students}
              assignment={assignment}
              fetchStudents={fetchStudents}
              testSettings={testSettings}
              updateOptions={this.updateAssignment}
              onClassFieldChange={this.onClassFieldChange}
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
    playlist: getPlaylistSelector(state),
    performanceBandData: get(state, ["performanceBandReducer", "data"], []),
    testItem: getTestSelector(state),
    userRole: getUserRole(state)
  }),
  {
    fetchGroups: fetchGroupsAction,
    fetchStudents: fetchGroupMembersAction,
    fetchAssignments: fetchAssignmentsAction,
    saveAssignment: saveAssignmentAction,
    fetchPerformanceBand: receivePerformanceBandAction,
    fetchPlaylistById: receivePlaylistByIdAction,
    fetchTestByID: receiveTestByIdAction
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
  performanceBandData: PropTypes.object.isRequired,
  testItem: PropTypes.object.isRequired,
  fetchTestByID: PropTypes.func.isRequired
};
