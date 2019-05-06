import React from "react";
import PropTypes from "prop-types";
import { Col, Icon, message } from "antd";
import { curry } from "lodash";
import produce from "immer";
import ClassSelector from "./ClassSelector";
import StudentSelector from "./StudentSelector";
import DateSelector from "./DateSelector";
import Settings from "./Settings";
import { OptionConationer, InitOptions, StyledRowButton, SettingsBtn } from "./styled";
import { getListOfStudents } from "../../utils";

class SimpleOptions extends React.Component {
  static propTypes = {
    group: PropTypes.array.isRequired,
    initData: PropTypes.object.isRequired,
    students: PropTypes.array.isRequired,
    testSettings: PropTypes.object.isRequired,
    fetchStudents: PropTypes.func.isRequired,
    updateOptions: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      showSettings: false,
      assignment: props.initData
    };
  }

  toggleSettings = () => {
    const { showSettings } = this.state;
    this.setState({ showSettings: !showSettings });
  };

  onChange = (field, value) => {
    const { assignment } = this.state;
    if (field === "endDate") {
      const { startDate } = assignment;
      const diff = startDate.diff(value);
      if (diff > 0) {
        return message.error("Close date should be less than Open date!");
      }
    }
    const nextAssignment = produce(assignment, state => {
      state[field] = value;
    });
    this.updateAssignment(nextAssignment);
  };

  updateStudents = studentList => this.onChange("students", studentList);

  updateAssignment = nextAssignment => {
    const { updateOptions } = this.props;
    if (updateOptions) {
      updateOptions(nextAssignment);
    }
    this.setState({ assignment: nextAssignment });
  };

  render() {
    const { showSettings, assignment } = this.state;
    const { group, fetchStudents, students, testSettings } = this.props;
    const changeField = curry(this.onChange);
    const studentOfSelectedClass = getListOfStudents(students, assignment.class);
    const setList = studentOfSelectedClass.map(item => item._id);
    const selectedStudents = assignment.students && assignment.students.filter(id => setList.includes(id));

    return (
      <OptionConationer>
        <InitOptions>
          <ClassSelector
            onChange={changeField("class")}
            fetchStudents={fetchStudents}
            selectedGroups={assignment.class}
            group={group}
          />

          <StudentSelector
            studentNames={selectedStudents}
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
              updateAssignmentSettings={this.updateAssignment}
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
