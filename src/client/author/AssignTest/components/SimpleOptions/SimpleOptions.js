import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Col, Icon, Row, Select } from "antd";
import { curry, keyBy, groupBy, get } from "lodash";
import produce from "immer";
import { test as testConst, roleuser, assignmentPolicyOptions } from "@edulastic/constants";
import ClassSelector from "./ClassSelector";
import StudentSelector from "./StudentSelector";
import DateSelector from "./DateSelector";
import Settings from "./Settings";
import {
  OptionConationer,
  InitOptions,
  StyledRowButton,
  SettingsBtn,
  ColLabel,
  StyledSelect,
  Label,
  StyledRow
} from "./styled";
import { getListOfStudents } from "../../utils";
import selectsData from "../../../TestPage/components/common/selectsData";
import { getUserRole } from "../../../src/selectors/user";
import * as moment from "moment";
import TestTypeSelector from "./TestTypeSelector";
import FeaturesSwitch from "../../../../features/components/FeaturesSwitch";
import { isFeatureAccessible } from "../../../../features/components/FeaturesSwitch";
import { getUserFeatures } from "../../../../student/Login/ducks";
import { getReleaseScorePremiumSelector } from "../../../TestPage/ducks";
export const releaseGradeKeys = ["DONT_RELEASE", "SCORE_ONLY", "WITH_RESPONSE", "WITH_ANSWERS"];
export const nonPremiumReleaseGradeKeys = ["DONT_RELEASE", "WITH_ANSWERS"];

const { releaseGradeLabels } = testConst;
class SimpleOptions extends React.Component {
  static propTypes = {
    group: PropTypes.array.isRequired,
    assignment: PropTypes.object.isRequired,
    students: PropTypes.array.isRequired,
    testSettings: PropTypes.object.isRequired,
    fetchStudents: PropTypes.func.isRequired,
    updateOptions: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      showSettings: false,
      classIds: [],
      studentList: [],
      _releaseGradeKeys: nonPremiumReleaseGradeKeys
    };
  }

  static getDerivedStateFromProps(nextProps, nextState) {
    const { features, testSettings } = nextProps;
    const { grades, subjects } = testSettings || {};
    if (
      features["assessmentSuperPowersReleaseScorePremium"] ||
      (grades &&
        subjects &&
        isFeatureAccessible({
          features: features,
          inputFeatures: "assessmentSuperPowersReleaseScorePremium",
          gradeSubject: { grades, subjects }
        }))
    ) {
      return {
        _releaseGradeKeys: releaseGradeKeys
      };
    } else {
      return {
        _releaseGradeKeys: nonPremiumReleaseGradeKeys
      };
    }
  }

  toggleSettings = () => {
    const { showSettings } = this.state;
    this.setState({ showSettings: !showSettings });
  };

  onDeselect = classId => {
    const removedStudents = this.props.assignment.class.find(_class => _class._id === classId)?.students || [];
    this.setState(prevState => ({
      studentList: prevState.studentList.filter(item => !removedStudents.includes(item))
    }));
  };

  onChange = (field, value) => {
    const {
      onClassFieldChange,
      group,
      assignment,
      updateOptions,
      toggleSpecificStudents,
      isReleaseScorePremium,
      userRole
    } = this.props;
    if (field === "specificStudents") {
      if (value === false) {
        this.setState({ studentList: [] });
      }
      return toggleSpecificStudents(value);
    }
    if (field === "class") {
      this.setState({ classIds: value }, () => {
        const { classData, termId } = onClassFieldChange(value, group);
        const nextAssignment = produce(assignment, state => {
          state["class"] = classData;
          if (termId) state.termId = termId;
        });
        updateOptions(nextAssignment);
      });
      return;
    }
    if (field === "endDate") {
      const { startDate } = assignment;
      if (value === null) {
        value = moment(startDate).add("days", 7);
      }
    }
    const nextAssignment = produce(assignment, state => {
      switch (field) {
        case "startDate":
          const { endDate } = assignment;
          if (value === null) {
            value = moment();
          }
          const diff = value.diff(endDate);
          if (diff > 0) {
            state.endDate = moment(value).add("days", 7);
          }
          break;
        case "testType":
          if (value === testConst.type.ASSESSMENT || value === testConst.type.COMMON) {
            state.releaseScore =
              value === testConst.type.ASSESSMENT && isReleaseScorePremium
                ? releaseGradeLabels.WITH_RESPONSE
                : releaseGradeLabels.DONT_RELEASE;
            state.maxAttempts = 1;
          } else {
            state.releaseScore = releaseGradeLabels.WITH_ANSWERS;
            state.maxAttempts = 3;
          }
          break;
        case "passwordPolicy":
          if (value === testConst.passwordPolicy.REQUIRED_PASSWORD_POLICY_DYNAMIC) {
            state.openPolicy =
              userRole === roleuser.DISTRICT_ADMIN || userRole === roleuser.SCHOOL_ADMIN
                ? assignmentPolicyOptions.POLICY_OPEN_MANUALLY_BY_TEACHER
                : assignmentPolicyOptions.POLICY_OPEN_MANUALLY_IN_CLASS;
            state.passwordExpireIn = 15 * 60;
          } else {
            state.openPolicy =
              userRole === roleuser.DISTRICT_ADMIN || userRole === roleuser.SCHOOL_ADMIN
                ? assignmentPolicyOptions.POLICY_OPEN_MANUALLY_BY_TEACHER
                : assignmentPolicyOptions.POLICY_AUTO_ON_STARTDATE;
          }
          break;
      }

      state[field] = value;
    });
    updateOptions(nextAssignment);
  };

  updateStudents = studentId => {
    const { group, students, assignment, updateOptions } = this.props;
    const groupById = keyBy(group, "_id");
    const studentById = keyBy(students, "_id");
    const selectedStudentsById = [...this.state.studentList, studentId].map(_id => studentById[_id]);
    const studentsByGroupId = groupBy(selectedStudentsById, "groupId");
    const classData = assignment.class.map(item => {
      const { _id, specificStudents } = item;
      if (!studentsByGroupId[_id]) return item;
      return {
        _id,
        name: get(groupById, `${_id}.name`, ""),
        assignedCount: studentsByGroupId[_id].length,
        students: studentsByGroupId[_id].map(item => item._id),
        grade: get(groupById, `${_id}.grades`, ""),
        subject: get(groupById, `${_id}.subject`, ""),
        termId: get(groupById, `${_id}.termId`, ""),
        specificStudents: specificStudents
      };
    });
    this.setState(
      prev => ({ studentList: [...prev.studentList, studentId] }),
      () => {
        const nextAssignment = produce(assignment, state => {
          state.class = classData;
        });
        updateOptions(nextAssignment);
      }
    );
  };

  // Always expected student Id and class Id
  handleRemoveStudents = (studentId, { props: { groupId } }) => {
    const { assignment, updateOptions } = this.props;
    const nextAssignment = produce(assignment, state => {
      state.class = assignment.class.map(item => {
        if (item._id === groupId) {
          return {
            ...item,
            students: item.students.filter(student => student !== studentId),
            assignedCount: item.assignedCount - 1
          };
        }
        return item;
      });
    });
    this.setState(prev => ({ studentList: prev.studentList.filter(item => item !== studentId) }));
    updateOptions(nextAssignment);
  };

  render() {
    const { showSettings, classIds, studentList, _releaseGradeKeys } = this.state;
    const {
      group,
      fetchStudents,
      students,
      testSettings = {},
      assignment,
      updateOptions,
      userRole,
      specificStudents
    } = this.props;
    const changeField = curry(this.onChange);
    let openPolicy = selectsData.openPolicy;
    let closePolicy = selectsData.closePolicy;
    if (userRole === roleuser.DISTRICT_ADMIN || userRole === roleuser.SCHOOL_ADMIN) {
      openPolicy = selectsData.openPolicyForAdmin;
      closePolicy = selectsData.closePolicyForAdmin;
    }
    const gradeSubject = { grades: testSettings.grades, subjects: testSettings.subjects };
    const studentOfSelectedClass = getListOfStudents(students, classIds);
    return (
      <OptionConationer>
        <InitOptions>
          <ClassSelector
            onChange={changeField("class")}
            onDeselect={this.onDeselect}
            fetchStudents={fetchStudents}
            selectedGroups={classIds}
            group={group}
          />
          <StudentSelector
            studentNames={studentList}
            students={studentOfSelectedClass}
            updateStudents={this.updateStudents}
            handleRemoveStudents={this.handleRemoveStudents}
            onChange={this.onChange}
            specificStudents={specificStudents}
          />

          <DateSelector
            startDate={assignment.startDate}
            endDate={assignment.endDate}
            changeField={changeField}
            passwordPolicy={assignment.passwordPolicy}
          />

          <StyledRow gutter={32}>
            <Col span={12}>
              <Row>
                <ColLabel span={24}>
                  <Label>OPEN POLICY</Label>
                </ColLabel>
                <Col span={24}>
                  <StyledSelect
                    data-cy="selectOpenPolicy"
                    placeholder="Please select"
                    cache="false"
                    value={assignment.openPolicy}
                    onChange={changeField("openPolicy")}
                    disabled={assignment.passwordPolicy === testConst.passwordPolicy.REQUIRED_PASSWORD_POLICY_DYNAMIC}
                  >
                    {openPolicy.map(({ value, text }, index) => (
                      <Select.Option key={index} value={value} data-cy="open">
                        {text}
                      </Select.Option>
                    ))}
                  </StyledSelect>
                </Col>
              </Row>
            </Col>
            <Col span={12}>
              <Row>
                <ColLabel span={24}>
                  <Label>CLOSE POLICY</Label>
                </ColLabel>
                <Col span={24}>
                  <StyledSelect
                    data-cy="selectClosePolicy"
                    placeholder="Please select"
                    cache="false"
                    value={assignment.closePolicy}
                    onChange={changeField("closePolicy")}
                  >
                    {closePolicy.map(({ value, text }, index) => (
                      <Select.Option data-cy="class" key={index} value={value}>
                        {text}
                      </Select.Option>
                    ))}
                  </StyledSelect>
                </Col>
              </Row>
            </Col>
          </StyledRow>

          <FeaturesSwitch
            inputFeatures="selectTestType"
            actionOnInaccessible="hidden"
            key="selectTestType"
            gradeSubject={gradeSubject}
          >
            <TestTypeSelector
              userRole={userRole}
              testType={assignment.testType || testSettings.testType}
              onAssignmentTypeChange={changeField("testType")}
            />
          </FeaturesSwitch>
          <StyledRowButton gutter={32}>
            <Col>
              <SettingsBtn onClick={this.toggleSettings}>
                OVERRIDE TEST SETTINGS
                {showSettings ? <Icon type="caret-up" /> : <Icon type="caret-down" />}
              </SettingsBtn>
            </Col>
          </StyledRowButton>

          {showSettings && (
            <Settings
              assignmentSettings={assignment}
              updateAssignmentSettings={updateOptions}
              changeField={changeField}
              testSettings={testSettings}
              gradeSubject={gradeSubject}
              _releaseGradeKeys={_releaseGradeKeys}
              isDocBased={testSettings.isDocBased}
            />
          )}
        </InitOptions>
      </OptionConationer>
    );
  }
}

export default connect(state => ({
  userRole: getUserRole(state),
  features: getUserFeatures(state),
  isReleaseScorePremium: getReleaseScorePremiumSelector(state)
}))(SimpleOptions);
