import { FieldLabel, notification, SelectInputStyled } from "@edulastic/common";
import { assignmentPolicyOptions, roleuser, test as testConst } from "@edulastic/constants";
import { Col, Icon, Row, Select } from "antd";
import produce from "immer";
import { curry, get, keyBy } from "lodash";
import * as moment from "moment";
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { isFeatureAccessible } from "../../../../features/components/FeaturesSwitch";
import { getUserFeatures } from "../../../../student/Login/ducks";
import { getUserRole } from "../../../src/selectors/user";
import selectsData from "../../../TestPage/components/common/selectsData";
import { getIsOverrideFreezeSelector, getReleaseScorePremiumSelector } from "../../../TestPage/ducks";
import { getListOfActiveStudents } from "../../utils";
import ClassSelector from "./ClassSelector";
import DateSelector from "./DateSelector";
import Settings from "./Settings";
import StudentSelector from "./StudentSelector";
import { InitOptions, OptionConationer, SettingsBtn, StyledRow, StyledRowButton } from "./styled";
import TestTypeSelector from "./TestTypeSelector";

export const releaseGradeKeys = ["DONT_RELEASE", "SCORE_ONLY", "WITH_RESPONSE", "WITH_ANSWERS"];
export const nonPremiumReleaseGradeKeys = ["DONT_RELEASE", "WITH_ANSWERS"];

const { releaseGradeLabels, evalTypeLabels } = testConst;
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
      _releaseGradeKeys: nonPremiumReleaseGradeKeys
    };
  }

  static getDerivedStateFromProps(nextProps) {
    const { features, testSettings } = nextProps;
    const { grades, subjects } = testSettings || {};
    if (
      features.assessmentSuperPowersReleaseScorePremium ||
      (grades &&
        subjects &&
        isFeatureAccessible({
          features,
          inputFeatures: "assessmentSuperPowersReleaseScorePremium",
          gradeSubject: { grades, subjects }
        }))
    ) {
      return {
        _releaseGradeKeys: releaseGradeKeys
      };
    }
    return {
      _releaseGradeKeys: nonPremiumReleaseGradeKeys
    };
  }

  componentDidMount() {
    const {
      features: { free, premium }
    } = this.props;
    const { showSettings } = this.state;
    if (free && !premium && !showSettings) {
      this.setState({ showSettings: true });
    }
  }

  toggleSettings = () => {
    const { freezeSettings } = this.props;
    const { showSettings } = this.state;
    if (freezeSettings && !showSettings) {
      notification({ type: "warn", messageKey: "overrrideSettingsRestricted" });
    }
    this.setState({ showSettings: !showSettings });
  };

  onChange = (field, value) => {
    const { onClassFieldChange, group, assignment, updateOptions, isReleaseScorePremium, userRole } = this.props;
    if (field === "class") {
      const { classData, termId } = onClassFieldChange(value, group);
      const nextAssignment = produce(assignment, state => {
        state.class = classData;
        if (termId) state.termId = termId;
      });
      updateOptions(nextAssignment);
      return;
    }
    if (field === "endDate" || field === "dueDate") {
      const { startDate } = assignment;
      if (value === null) {
        value = moment(startDate).add("days", 7);
      }
    }

    const nextAssignment = produce(assignment, state => {
      switch (field) {
        case "startDate": {
          const { endDate } = assignment;
          if (value === null) {
            value = moment();
          }
          const diff = value.diff(endDate);
          if (diff > 0) {
            state.endDate = moment(value).add("days", 7);
          }
          break;
        }
        case "testType": {
          if (value === testConst.type.ASSESSMENT || value === testConst.type.COMMON) {
            state.releaseScore =
              value === testConst.type.ASSESSMENT && isReleaseScorePremium
                ? releaseGradeLabels.WITH_RESPONSE
                : releaseGradeLabels.DONT_RELEASE;
            state.maxAttempts = 1;
            state.maxAnswerChecks = 0;
          } else {
            state.releaseScore = releaseGradeLabels.WITH_ANSWERS;
            state.maxAttempts = 1;
            state.maxAnswerChecks = 3;
          }
          break;
        }
        case "passwordPolicy": {
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
        // no default
      }

      // Settings OverrideSettings method has similar condition
      if (field === "scoringType") {
        state.penalty = value === evalTypeLabels.PARTIAL_CREDIT;
      }
      state[field] = value;
    });
    updateOptions(nextAssignment);
  };

  updateStudents = selected => {
    const { group, assignment, updateOptions } = this.props;
    const [groupId, studentId] = selected.split(`_`);
    const groupById = keyBy(group, "_id");
    const classData = assignment.class.map(item => {
      const { _id } = item;
      if (_id !== groupId) return item;
      return {
        _id,
        name: get(groupById, `${_id}.name`, ""),
        assignedCount: get(item, "students.length", 0) + 1,
        students: [...get(item, "students", []), studentId],
        grade: get(groupById, `${_id}.grades`, ""),
        subject: get(groupById, `${_id}.subject`, "")
      };
    });
    const nextAssignment = produce(assignment, state => {
      state.class = classData;
    });
    updateOptions(nextAssignment);
  };

  selectAllStudents = () => {
    const { group, assignment, updateOptions, students } = this.props;
    const studentsByGroupId = {};
    for (const student of students) {
      if (!studentsByGroupId[student.groupId]) {
        studentsByGroupId[student.groupId] = [student._id];
      } else {
        studentsByGroupId[student.groupId].push(student._id);
      }
    }
    const groupById = keyBy(group, "_id");
    const classData = assignment.class.map(item => {
      const { _id } = item;
      return {
        _id,
        name: get(groupById, `${_id}.name`, ""),
        assignedCount: studentsByGroupId[_id]?.length || 0,
        students: studentsByGroupId[_id] || [],
        grade: get(groupById, `${_id}.grades`, ""),
        subject: get(groupById, `${_id}.subject`, ""),
        termId: get(groupById, `${_id}.termId`, "")
      };
    });
    const nextAssignment = produce(assignment, state => {
      state.class = classData;
    });
    updateOptions(nextAssignment);
  };

  unselectAllStudents = () => {
    const { assignment, updateOptions, group } = this.props;
    const groupById = keyBy(group, "_id");
    const nextAssignment = produce(assignment, state => {
      state.class = assignment.class.map(item => {
        delete item.students;
        return {
          ...item,
          assignedCount: groupById[item._id].studentCount
        };
      });
    });
    updateOptions(nextAssignment);
  };

  // Always expected student Id and class Id
  handleRemoveStudents = selected => {
    const { assignment, group, updateOptions } = this.props;
    const [groupId, studentId] = selected.split(`_`);
    const nextAssignment = produce(assignment, state => {
      state.class = assignment.class.map(item => {
        if (item._id === groupId) {
          let assignedCount = item.assignedCount - 1;
          if (assignedCount === 0) {
            assignedCount = keyBy(group, "_id")[groupId].studentCount;
          }
          const newItem = {
            ...item,
            students: (item.students || []).filter(student => student !== studentId),
            assignedCount
          };
          if (assignedCount === 0) {
            delete newItem.students;
          }
          return newItem;
        }
        return item;
      });
    });
    updateOptions(nextAssignment);
  };

  render() {
    const { showSettings, _releaseGradeKeys } = this.state;
    const {
      group,
      fetchStudents,
      students,
      testSettings = {},
      assignment,
      updateOptions,
      userRole,
      changeDateSelection,
      selectedDateOption,
      freezeSettings,
      features
    } = this.props;
    const changeField = curry(this.onChange);
    let { openPolicy } = selectsData;
    let { closePolicy } = selectsData;
    if (userRole === roleuser.DISTRICT_ADMIN || userRole === roleuser.SCHOOL_ADMIN) {
      openPolicy = selectsData.openPolicyForAdmin;
      closePolicy = selectsData.closePolicyForAdmin;
    }
    const gradeSubject = { grades: testSettings.grades, subjects: testSettings.subjects };
    const classIds = get(assignment, "class", []).map(item => item._id);
    const studentOfSelectedClass = getListOfActiveStudents(students, classIds);
    return (
      <OptionConationer>
        <InitOptions>
          <StyledRow gutter={32}>
            <ClassSelector
              onChange={changeField("class")}
              fetchStudents={fetchStudents}
              selectedGroups={classIds}
              group={group}
            />
            <StudentSelector
              selectedGroups={classIds}
              students={studentOfSelectedClass}
              groups={group}
              updateStudents={this.updateStudents}
              selectAllStudents={this.selectAllStudents}
              unselectAllStudents={this.unselectAllStudents}
              handleRemoveStudents={this.handleRemoveStudents}
            />
          </StyledRow>

          <DateSelector
            startDate={assignment.startDate}
            endDate={assignment.endDate}
            dueDate={assignment.dueDate}
            changeField={changeField}
            passwordPolicy={assignment.passwordPolicy}
            changeRadioGrop={changeDateSelection}
            selectedOption={selectedDateOption}
            showOpenDueAndCloseDate={features.assignTestEnableOpenDueAndCloseDate}
          />

          <StyledRow gutter={32} mb="15px">
            <Col span={12}>
              <Row>
                <Col span={24}>
                  <FieldLabel>OPEN POLICY</FieldLabel>
                  <SelectInputStyled
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
                  </SelectInputStyled>
                </Col>
              </Row>
            </Col>
            <Col span={12}>
              <Row>
                <Col span={24}>
                  <FieldLabel>CLOSE POLICY</FieldLabel>
                  <SelectInputStyled
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
                  </SelectInputStyled>
                </Col>
              </Row>
            </Col>
          </StyledRow>
          <StyledRow gutter={32} mb="15px">
            <Col span={12}>
              <TestTypeSelector
                userRole={userRole}
                testType={assignment.testType || testSettings.testType}
                onAssignmentTypeChange={changeField("testType")}
                disabled={freezeSettings}
              />
            </Col>
          </StyledRow>
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
  isReleaseScorePremium: getReleaseScorePremiumSelector(state),
  freezeSettings: getIsOverrideFreezeSelector(state)
}))(SimpleOptions);
