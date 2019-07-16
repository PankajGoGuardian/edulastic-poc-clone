import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import produce from "immer";
import { curry } from "lodash";
import * as moment from "moment";
import { Col, Icon } from "antd";
import ClassList from "./ClassList";
import DatePolicySelector from "./DatePolicySelector";
import Settings from "../SimpleOptions/Settings";
import { OptionConationer, InitOptions, StyledRowLabel, SettingsBtn, ClassSelectorLabel } from "./styled";
import { isFeatureAccessible } from "../../../../features/components/FeaturesSwitch";
import { getUserFeatures } from "../../../../student/Login/ducks";
import { releaseGradeKeys, nonPremiumReleaseGradeKeys } from "../SimpleOptions/SimpleOptions";

class AdvancedOptons extends React.Component {
  static propTypes = {
    assignment: PropTypes.object.isRequired,
    testSettings: PropTypes.object.isRequired,
    updateOptions: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      showSettings: false,
      classIds: [],
      _releaseGradeKeys: nonPremiumReleaseGradeKeys
    };
  }

  static getDerivedStateFromProps(nextProps) {
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

  onChange = (field, value, groups) => {
    const { onClassFieldChange, assignment, updateOptions } = this.props;
    if (field === "class") {
      this.setState({ classIds: value }, () => {
        const { classData, termId } = onClassFieldChange(value, groups);
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

  updateStudents = studentList => this.onChange("students", studentList);

  render() {
    const { testSettings = {}, assignment, updateOptions } = this.props;
    const { showSettings, classIds, _releaseGradeKeys } = this.state;
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
            testType={assignment.testType || testSettings.testType}
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
              updateAssignmentSettings={updateOptions}
              changeField={changeField}
              testSettings={testSettings}
              _releaseGradeKeys={_releaseGradeKeys}
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

          <ClassList selectedClasses={classIds} selectClass={this.onChange} />
        </InitOptions>
      </OptionConationer>
    );
  }
}

export default connect(state => ({
  features: getUserFeatures(state)
}))(AdvancedOptons);
