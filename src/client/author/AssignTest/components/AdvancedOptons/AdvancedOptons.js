import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import produce from "immer";
import { curry } from "lodash";
import * as moment from "moment";
import { Col, Icon, message } from "antd";
import { test as testConst, assignmentPolicyOptions, roleuser } from "@edulastic/constants";
import ClassList from "./ClassList";
import DatePolicySelector from "./DatePolicySelector";
import Settings from "../SimpleOptions/Settings";
import { OptionConationer, InitOptions, StyledRowLabel, SettingsBtn, ClassSelectorLabel } from "./styled";
import { isFeatureAccessible } from "../../../../features/components/FeaturesSwitch";
import { getUserFeatures } from "../../../../student/Login/ducks";
import { releaseGradeKeys, nonPremiumReleaseGradeKeys } from "../SimpleOptions/SimpleOptions";
import {
  getReleaseScorePremiumSelector,
  defaultTestTypeProfilesSelector,
  getIsOverrideFreezeSelector
} from "../../../TestPage/ducks";
import { getDefaultSettings } from "../../../../common/utils/helpers";

const { releaseGradeLabels } = testConst;
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
    const { freezeSettings } = this.props;
    const { showSettings } = this.state;
    if (freezeSettings && !showSettings) {
      message.warn("Override settings is restricted by the Admin.");
    }
    this.setState({ showSettings: !showSettings });
  };

  onChange = (field, value, groups) => {
    const {
      onClassFieldChange,
      assignment,
      updateOptions,
      isReleaseScorePremium,
      userRole,
      defaultTestProfiles
    } = this.props;
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
      if (field === "testType") {
        const performanceBand = getDefaultSettings({ testType: value, defaultTestProfiles })?.performanceBand;
        const standardGradingScale = getDefaultSettings({ testType: value, defaultTestProfiles })?.standardProficiency;
        state.performanceBand = performanceBand;
        state.standardGradingScale = standardGradingScale;

        if (value === testConst.type.ASSESSMENT || value === testConst.type.COMMON) {
          state.releaseScore =
            value === testConst.type.ASSESSMENT && isReleaseScorePremium
              ? releaseGradeLabels.WITH_RESPONSE
              : releaseGradeLabels.DONT_RELEASE;
        } else {
          state.releaseScore = releaseGradeLabels.WITH_ANSWERS;
        }
      }
      if (field === "passwordPolicy") {
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
      }

      state[field] = value;
    });
    updateOptions(nextAssignment);
  };

  updateStudents = studentList => this.onChange("students", studentList);

  render() {
    const { testSettings = {}, assignment, updateOptions, defaultTestProfiles = {} } = this.props;
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
            passwordPolicy={assignment.passwordPolicy}
            playerSkinType={assignment.playerSkinType || testSettings.playerSkinType}
            showMagnifier={assignment.showMagnifier || testSettings.showMagnifier}
          />
          <StyledRowLabel gutter={16}>
            <Col>
              <SettingsBtn data-cy="override" onClick={this.toggleSettings} isVisible={showSettings}>
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
  features: getUserFeatures(state),
  isReleaseScorePremium: getReleaseScorePremiumSelector(state),
  defaultTestProfiles: defaultTestTypeProfilesSelector(state),
  freezeSettings: getIsOverrideFreezeSelector(state)
}))(AdvancedOptons);
