import React from "react";
import PropTypes from "prop-types";
import { Col, Icon, message } from "antd";
import { curry, keyBy, groupBy, get } from "lodash";
import produce from "immer";
import ClassSelector from "./ClassSelector";
import StudentSelector from "./StudentSelector";
import DateSelector from "./DateSelector";
import Settings from "./Settings";
import { OptionConationer, InitOptions, StyledRowButton, SettingsBtn } from "./styled";
import { getListOfStudents } from "../../utils";
import * as moment from "moment";

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
      studentList: []
    };
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
    const { showSettings, classIds, studentList } = this.state;
    const { group, fetchStudents, students, testSettings, assignment, updateOptions } = this.props;
    const changeField = curry(this.onChange);
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
            />
          )}
        </InitOptions>
      </OptionConationer>
    );
  }
}

export default SimpleOptions;
