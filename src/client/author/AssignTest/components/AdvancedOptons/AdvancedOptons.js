import React from "react";
import PropTypes from "prop-types";
import produce from "immer";
import { curry } from "lodash";
import { Col, Icon } from "antd";
import ClassList from "./ClassList";
import DatePolicySelector from "./DatePolicySelector";
import Settings from "../SimpleOptions/Settings";
import { OptionConationer, InitOptions, StyledRowLabel, SettingsBtn, ClassSelectorLabel } from "./styled";

class AdvancedOptons extends React.Component {
  static propTypes = {
    initData: PropTypes.object.isRequired,
    testSettings: PropTypes.object.isRequired,
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
    const { testSettings } = this.props;
    const { showSettings, assignment } = this.state;
    const changeField = curry(this.onChange);

    return (
      <OptionConationer>
        <InitOptions>
          <DatePolicySelector
            startDate={assignment.startDate}
            endDate={assignment.endDate}
            openPolicy={assignment.openPolicy}
            closePolicy={assignment.closePolicy}
            changeField={changeField}
          />

          <StyledRowLabel gutter={16}>
            <Col>
              <SettingsBtn onClick={this.toggleSettings} isVisible={showSettings}>
                OVERRIDE TEST SETTINGS {showSettings ? <Icon type="caret-up" /> : <Icon type="caret-down" />}
              </SettingsBtn>
            </Col>
          </StyledRowLabel>

          {showSettings && (
            <Settings
              assignmentSettings={assignment}
              updateAssignmentSettings={this.updateAssignment}
              changeField={changeField}
              testSettings={testSettings}
              isAdvanced
            />
          )}

          <ClassSelectorLabel>
            Assign this to
            <p>
              {"Please select classes to assign this assessment."}
              {"Options on the left can be used to filter the list of classes."}
            </p>
          </ClassSelectorLabel>

          <ClassList selectedClasses={assignment.class} selectClass={changeField} />
        </InitOptions>
      </OptionConationer>
    );
  }
}

export default AdvancedOptons;
