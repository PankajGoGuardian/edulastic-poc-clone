import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Col, Icon, Row, Select } from "antd";
import { curry, keyBy, groupBy, get } from "lodash";
import produce from "immer";
import ClassSelector from "./ClassSelector";
import StudentSelector from "./StudentSelector";
import DateSelector from "./DateSelector";
import Settings from "./Settings";
import { OptionConationer, InitOptions, StyledRowButton, SettingsBtn, StyledRowLabel, StyledSelect } from "./styled";
import { getListOfStudents } from "../../utils";
import selectsData from "../../../TestPage/components/common/selectsData";
import { getUserRole } from "../../../src/selectors/user";
import * as moment from "moment";
import TestTypeSelector from "./TestTypeSelector";
import FeaturesSwitch from "../../../../features/components/FeaturesSwitch";
import { isFeatureAccessible } from "../../../../features/components/FeaturesSwitch";
import { getUserFeatures } from "../../../../student/Login/ducks";
const releaseGradeKeys = ["DONT_RELEASE", "SCORE_ONLY", "WITH_RESPONSE", "WITH_ANSWERS"];
const nonPremiumReleaseGradeKeys = ["DONT_RELEASE", "SCORE_ONLY"];

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
      features["assessmentSuperPowersReleaseScorePremium"] === false &&
      grades &&
      subjects &&
      isFeatureAccessible({
        features: features,
        inputFeatures: "assessmentSuperPowersReleaseScorePremium",
        gradeSubject: { grades, subjects }
      })
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

  onChange = (field, value) => {
    const { onClassFieldChange, group, assignment, updateOptions } = this.props;
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
      if (field === "startDate") {
        const { endDate } = assignment;
        if (value === null) {
          value = moment();
        }
        const diff = value.diff(endDate);
        if (diff > 0) {
          state.endDate = moment(value).add("days", 7);
        }
      }
      state[field] = value;
    });
    updateOptions(nextAssignment);
  };

  updateStudents = studentList => {
    const { group, students, assignment, updateOptions } = this.props;
    const groupById = keyBy(group, "_id");
    const studentById = keyBy(students, "_id");
    const selectedStudentsById = studentList.map(_id => studentById[_id]);
    const studentsByGroupId = groupBy(selectedStudentsById, "groupId");
    const classData = assignment.class.map(item => {
      const { _id } = item;
      if (!studentsByGroupId[_id]) return item;
      return {
        _id,
        name: get(groupById, `${_id}.name`, ""),
        assignedCount: studentsByGroupId[_id].length,
        students: studentsByGroupId[_id].map(item => item._id),
        grade: get(groupById, `${_id}.grade`, ""),
        subject: get(groupById, `${_id}.subject`, ""),
        termId: get(groupById, `${_id}.termId`, "")
      };
    });
    this.setState({ studentList }, () => {
      const nextAssignment = produce(assignment, state => {
        state.class = classData;
      });
      updateOptions(nextAssignment);
    });
  };

  render() {
    const { showSettings, classIds, studentList, _releaseGradeKeys } = this.state;
    const { group, fetchStudents, students, testSettings = {}, assignment, updateOptions, userRole } = this.props;
    const changeField = curry(this.onChange);
    let openPolicy = selectsData.openPolicy;
    let closePolicy = selectsData.closePolicy;
    if (userRole === "district-admin" || userRole === "school-admin") {
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
            fetchStudents={fetchStudents}
            selectedGroups={classIds}
            group={group}
          />
          <StudentSelector
            studentNames={studentList}
            students={studentOfSelectedClass}
            updateStudents={this.updateStudents}
            onChange={this.onChange}
            specificStudents={assignment.specificStudents}
          />

          <DateSelector startDate={assignment.startDate} endDate={assignment.endDate} changeField={changeField} />

          <StyledRowLabel gutter={16}>
            <Col span={12}>Open Policy</Col>
            <Col span={12}>Close Policy</Col>
          </StyledRowLabel>

          <Row gutter={32}>
            <Col span={12}>
              <StyledSelect
                data-cy="selectOpenPolicy"
                placeholder="Please select"
                cache="false"
                value={assignment.openPolicy}
                onChange={changeField("openPolicy")}
              >
                {openPolicy.map(({ value, text }, index) => (
                  <Select.Option key={index} value={value} data-cy="open">
                    {text}
                  </Select.Option>
                ))}
              </StyledSelect>
            </Col>
            <Col span={12}>
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
          <FeaturesSwitch
            inputFeatures="selectTestType"
            actionOnInaccessible="hidden"
            key="selectTestType"
            gradeSubject={gradeSubject}
          >
            <TestTypeSelector
              userRole={userRole}
              testType={testSettings.testType}
              onAssignmentTypeChange={changeField("testType")}
            />
          </FeaturesSwitch>
          <StyledRowButton gutter={16}>
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
            />
          )}
        </InitOptions>
      </OptionConationer>
    );
  }
}

export default connect(state => ({
  userRole: getUserRole(state),
  features: getUserFeatures(state)
}))(SimpleOptions);
