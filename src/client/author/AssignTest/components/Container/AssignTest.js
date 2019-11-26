import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { isEmpty, get, keyBy } from "lodash";
import * as moment from "moment";
import { message } from "antd";
import { fetchGroupMembersAction, getStudentsSelector } from "../../../sharedDucks/groups";

import { receiveTestByIdAction, getTestSelector, getDefaultTestSettingsAction } from "../../../TestPage/ducks";

import {
  fetchAssignmentsAction,
  getAssignmentsSelector,
  getTestEntitySelector,
  getClassListSelector
} from "../../duck";
import { getUserOrgId, getUserRole } from "../../../src/selectors/user";
import { test as testConst, roleuser } from "@edulastic/constants";
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
import { receiveClassListAction } from "../../../Classes/ducks";
import produce from "immer";
import { saveAssignmentAction } from "../../../TestPage/components/Assign/ducks";
import ProceedConfirmation from "./ConfirmationModal";

const { ASSESSMENT, COMMON } = testConst.type;

const setTime = userRole => {
  const addDate = userRole !== "teacher" ? 28 : 7;
  return moment()
    .add("days", addDate)
    .set({ hour: 23, minute: 0, second: 0, millisecond: 0 });
};

class AssignTest extends React.Component {
  constructor(props) {
    super(props);
    const isAdmin = props.userRole === roleuser.SCHOOL_ADMIN || props.userRole === roleuser.DISTRICT_ADMIN;
    this.state = {
      isAdvancedView: props.userRole !== "teacher" ? true : false,
      assignment: {
        startDate: moment(),
        openPolicy: "Automatically on Start Date",
        closePolicy: "Automatically on Due Date",
        class: [],
        testType: isAdmin ? COMMON : ASSESSMENT,
        endDate: setTime(props.userRole)
      },
      specificStudents: false
    };
  }

  componentDidMount() {
    const {
      fetchTestByID,
      loadClassList,
      fetchAssignments,
      assignments,
      match,
      userOrgId,
      isPlaylist,
      fetchPlaylistById,
      userRole,
      getDefaultTestSettings
    } = this.props;
    const { testId } = match.params;
    getDefaultTestSettings();
    loadClassList({
      districtId: userOrgId,
      search: {
        institutionIds: [],
        subjects: [],
        grades: [],
        active: [1]
      },
      page: 1,
      limit: 1000
    });
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
      if (userRole === "district-admin" || userRole === "school-admin") {
        this.setState(prevState => ({
          assignment: {
            ...prevState.assignment,
            testType: COMMON,
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
    const { saveAssignment, isAssigning } = this.props;
    if (isAssigning) return;
    if (assignment.requirePassword === false) {
      delete assignment.assignmentPassword;
    } else if (
      assignment.assignmentPassword &&
      (assignment.assignmentPassword.length < 6 || assignment.assignmentPassword.length > 25)
    ) {
      return message.error("Please add a valid password.");
    }
    if (isEmpty(assignment.class)) {
      message.error("Please select at least one class to assign.");
    } else if (assignment.endDate < Date.now()) {
      message.error("Please Enter a future end date. ");
    } else if (
      assignment?.class[0]?.specificStudents &&
      (!assignment.class[0].students || assignment.class[0].students.length === 0)
    ) {
      message.error("Please select the student");
    } else {
      saveAssignment(assignment);
    }
  };

  SwitchView = checked => {
    this.setState({ isAdvancedView: checked });
  };

  renderHeaderButton = () => (
    <AssignButton
      data-cy="assignButton"
      onClick={this.handleAssign}
      color="secondary"
      variant="create"
      shadow="none"
      disabled={this.props.isAssigning}
    >
      ASSIGN
    </AssignButton>
  );

  updateAssignment = assignment => this.setState({ assignment });

  onClassFieldChange = (value, group) => {
    const { assignment, specificStudents } = this.state;
    const groupById = keyBy(group, "_id");
    const classData = value.map(_id => ({
      _id,
      name: get(groupById, `${_id}.name`, ""),
      assignedCount: get(groupById, `${_id}.studentCount`, 0),
      grade: get(groupById, `${_id}.grades`, ""),
      subject: get(groupById, `${_id}.subject`, ""),
      specificStudents: specificStudents
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

  toggleSpecificStudents = specificStudents => {
    const { assignment } = this.state;
    const newAssignment = produce(assignment, assignmentCopy => {
      if (assignmentCopy.class.length > 0) {
        assignmentCopy.class.forEach(eachClass => {
          eachClass.specificStudents = specificStudents;
        });
      }
    });

    this.setState({ specificStudents, assignment: newAssignment });
  };

  render() {
    const { isAdvancedView, assignment, specificStudents } = this.state;
    const { classList, fetchStudents, students, testSettings, testItem, isPlaylist, playlist } = this.props;
    const { title, _id } = isPlaylist ? playlist : testItem;
    return (
      <div>
        <ProceedConfirmation assignment={assignment} />
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
            {/* TODO there are some scenarios we have both simple and advance view which is yet be decided */}
          </FullFlexContainer>

          {isAdvancedView ? (
            <AdvancedOptons
              assignment={assignment}
              updateOptions={this.updateAssignment}
              testSettings={testSettings}
              onClassFieldChange={this.onClassFieldChange}
              specificStudents={specificStudents}
              toggleSpecificStudents={this.toggleSpecificStudents}
            />
          ) : (
            <SimpleOptions
              group={classList}
              students={students}
              assignment={assignment}
              fetchStudents={fetchStudents}
              testSettings={testSettings}
              updateOptions={this.updateAssignment}
              onClassFieldChange={this.onClassFieldChange}
              specificStudents={specificStudents}
              toggleSpecificStudents={this.toggleSpecificStudents}
            />
          )}
        </Container>
      </div>
    );
  }
}

export default connect(
  state => ({
    classList: getClassListSelector(state),
    assignments: getAssignmentsSelector(state),
    students: getStudentsSelector(state),
    testSettings: getTestEntitySelector(state),
    userOrgId: getUserOrgId(state),
    playlist: getPlaylistSelector(state),
    testItem: getTestSelector(state),
    userRole: getUserRole(state),
    isAssigning: state.authorTestAssignments.isAssigning
  }),
  {
    loadClassList: receiveClassListAction,
    fetchStudents: fetchGroupMembersAction,
    fetchAssignments: fetchAssignmentsAction,
    saveAssignment: saveAssignmentAction,
    fetchPlaylistById: receivePlaylistByIdAction,
    fetchTestByID: receiveTestByIdAction,
    getDefaultTestSettings: getDefaultTestSettingsAction
  }
)(AssignTest);

AssignTest.propTypes = {
  match: PropTypes.object.isRequired,
  fetchStudents: PropTypes.func.isRequired,
  fetchGroups: PropTypes.func.isRequired,
  fetchAssignments: PropTypes.func.isRequired,
  classList: PropTypes.array.isRequired,
  students: PropTypes.array.isRequired,
  testSettings: PropTypes.object.isRequired,
  assignments: PropTypes.array.isRequired,
  saveAssignment: PropTypes.func.isRequired,
  userOrgId: PropTypes.string.isRequired,
  testItem: PropTypes.object.isRequired,
  fetchTestByID: PropTypes.func.isRequired
};
