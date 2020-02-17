import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { isEmpty, get, keyBy } from "lodash";
import * as moment from "moment";
import { message } from "antd";
import { fetchGroupMembersAction, getStudentsSelector, resetStudentAction } from "../../../sharedDucks/groups";

import { receiveTestByIdAction, getTestSelector, getDefaultTestSettingsAction } from "../../../TestPage/ducks";

import {
  fetchAssignmentsAction,
  getAssignmentsSelector,
  getTestEntitySelector,
  getClassListSelector,
  updateAssingnmentSettingsAction
} from "../../duck";
import { getUserOrgId, getUserRole } from "../../../src/selectors/user";
import { test as testConst, roleuser, assignmentPolicyOptions } from "@edulastic/constants";
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
import CommonStudentConfirmation from "./ConfirmationModal";
import MultipleAssignConfirmation from "./MultipleAssignConfirmation";

const { ASSESSMENT, COMMON } = testConst.type;

const parentMenu = {
  assignments: { title: "Assignments", to: "assignments" },
  playlistLibrary: { title: "Playlist Library", to: "playlists" },
  favouritePlaylist: { title: "Favourite playlist", to: "favouriteLibrary" },
  testLibrary: { title: "Test Library", to: "tests" }
};

class AssignTest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isAdvancedView: props.userRole !== "teacher" ? true : false,
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
      resetStudents,
      assignmentSettings = {}
    } = this.props;

    resetStudents();

    const { testId } = match.params;
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
    const isAdmin = userRole === roleuser.DISTRICT_ADMIN || userRole === roleuser.SCHOOL_ADMIN;
    if (isPlaylist) {
      fetchPlaylistById(match.params.playlistId);
      this.updateAssignmentNew({
        playlistId: match.params.playlistId,
        playlistModuleId: match.params.moduleId,
        testId: match.params.testId,
        openPolicy: isAdmin ? assignmentPolicyOptions.POLICY_OPEN_MANUALLY_BY_TEACHER : assignmentSettings.openPolicy,
        closePolicy: isAdmin ? assignmentPolicyOptions.POLICY_CLOSE_MANUALLY_BY_ADMIN : assignmentSettings.closePolicy,
        testType: isAdmin ? COMMON : ASSESSMENT
      });
    } else {
      this.updateAssignmentNew({
        testType: isAdmin ? COMMON : ASSESSMENT,
        openPolicy: isAdmin ? assignmentPolicyOptions.POLICY_OPEN_MANUALLY_BY_TEACHER : assignmentSettings.openPolicy
      });
      if (isEmpty(assignments) && testId) {
        fetchAssignments(testId);
      }
      if (testId) {
        fetchTestByID(testId);
      }
    }
  }

  handleAssign = () => {
    const { saveAssignment, isAssigning, assignmentSettings: assignment } = this.props;
    if (isAssigning) return;
    if (assignment.passwordPolicy !== testConst.passwordPolicy.REQUIRED_PASSWORD_POLICY_DYNAMIC) {
      delete assignment.passwordExpireIn;
    }
    if (
      assignment.passwordPolicy &&
      assignment.passwordPolicy !== testConst.passwordPolicy.REQUIRED_PASSWORD_POLICY_STATIC
    ) {
      delete assignment.assignmentPassword;
    } else if (
      assignment.passwordPolicy === testConst.passwordPolicy.REQUIRED_PASSWORD_POLICY_STATIC &&
      assignment.assignmentPassword &&
      (assignment.assignmentPassword.length < 6 || assignment.assignmentPassword.length > 25)
    ) {
      return message.error("Please add a valid password.");
    }
    if (isEmpty(assignment.class)) {
      message.error("Please select at least one class to assign.");
    } else if (assignment.endDate < Date.now()) {
      message.error("Please Enter a future end date. ");
    } else if (assignment?.class[0]?.specificStudents && assignment.class.every(_class => !_class?.students?.length)) {
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

  onClassFieldChange = (value, group) => {
    const { specificStudents } = this.state;
    const { assignmentSettings: assignment } = this.props;
    const groupById = keyBy(group, "_id");
    const previousGroupData = keyBy(assignment.class, "_id");
    const classData = value.map(_id => {
      if (previousGroupData[_id]) {
        return previousGroupData[_id];
      }
      return {
        _id,
        name: get(groupById, `${_id}.name`, ""),
        assignedCount: get(groupById, `${_id}.studentCount`, 0),
        grade: get(groupById, `${_id}.grades`, ""),
        subject: get(groupById, `${_id}.subject`, ""),
        specificStudents: specificStudents
      };
    });

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
    const { classList, assignmentSettings: assignment } = this.props;
    const groupById = keyBy(classList, "_id");
    const newAssignment = produce(assignment, assignmentCopy => {
      if (assignmentCopy.class.length > 0) {
        assignmentCopy.class.forEach(_class => {
          _class.specificStudents = specificStudents;
          if (!specificStudents) {
            delete _class.students;
            _class.assignedCount = get(groupById, `${_class._id}.studentCount`, 0);
          }
        });
      }
    });

    this.setState({ specificStudents });
    this.updateAssignmentNew(newAssignment);
  };

  updateAssignmentNew = newSettings => {
    const { updateAssignmentSettings } = this.props;
    updateAssignmentSettings(newSettings);
  };

  render() {
    const { isAdvancedView, specificStudents } = this.state;
    const { assignmentSettings: assignment } = this.props;
    const {
      classList,
      fetchStudents,
      students,
      testSettings,
      testItem,
      isPlaylist,
      playlist,
      from,
      location,
      defaultTestProfiles = {}
    } = this.props;
    const { title, _id } = isPlaylist ? playlist : testItem;
    const exactMenu = parentMenu[location?.state?.from || from];
    if (exactMenu.to === "favouriteLibrary") {
      exactMenu.to = `playlists/${_id}/use-this`;
    }

    return (
      <div>
        <CommonStudentConfirmation assignment={assignment} />
        <MultipleAssignConfirmation assignment={assignment} isPlaylist={isPlaylist} />
        <ListHeader
          title={`Assign ${title || ""}`}
          midTitle="PICK CLASSES, GROUPS OR STUDENTS"
          btnTitle="ASSIGN"
          renderButton={this.renderHeaderButton}
        />

        <Container>
          <FullFlexContainer justifyContent="space-between">
            <PaginationInfo>
              &lt; <AnchorLink to={`/author/${exactMenu?.to}`}>{exactMenu?.title}</AnchorLink>
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
              updateOptions={this.updateAssignmentNew}
              testSettings={testSettings}
              onClassFieldChange={this.onClassFieldChange}
              specificStudents={specificStudents}
              toggleSpecificStudents={this.toggleSpecificStudents}
              defaultTestProfiles={defaultTestProfiles}
            />
          ) : (
            <SimpleOptions
              group={classList}
              students={students}
              assignment={assignment}
              fetchStudents={fetchStudents}
              testSettings={testSettings}
              updateOptions={this.updateAssignmentNew}
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
    isAssigning: state.authorTestAssignments.isAssigning,
    assignmentSettings: state.assignmentSettings
  }),
  {
    loadClassList: receiveClassListAction,
    fetchStudents: fetchGroupMembersAction,
    fetchAssignments: fetchAssignmentsAction,
    saveAssignment: saveAssignmentAction,
    fetchPlaylistById: receivePlaylistByIdAction,
    fetchTestByID: receiveTestByIdAction,
    getDefaultTestSettings: getDefaultTestSettingsAction,
    resetStudents: resetStudentAction,
    updateAssignmentSettings: updateAssingnmentSettingsAction
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
