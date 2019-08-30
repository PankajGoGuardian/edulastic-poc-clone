import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { get } from "lodash";

// actions
import {
  receiveDistrictPolicyAction,
  updateDistrictPolicyAction,
  createDistrictPolicyAction,
  changeDistrictPolicyAction,
  receiveSchoolPolicyAction
} from "../../ducks";
import { getUserOrgId, getUserRole } from "../../../src/selectors/user";

import { Form, Checkbox, Radio, message, Input } from "antd";
const RadioGroup = Radio.Group;

import { StyledFormDiv, StyledRow, StyledLabel, StyledElementDiv, SaveButton, StyledFormItem } from "./styled";

function validURL(value) {
  if (value.length == 0)
    return {
      validateStatus: "success",
      errorMsg: ""
    };

  var pattern = new RegExp(/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+/);

  const spiltArray = value.split(/[\s,]+/);
  for (let i = 0; i < spiltArray.length; i++) {
    if (!pattern.test(spiltArray[i]) && spiltArray[i].length != 0) {
      return {
        validateStatus: "error",
        errorMsg: "Enter allowed domain(s), example - gmail.com, edulastic.com"
      };
    }
  }
  return {
    validateStatus: "success",
    errorMsg: null
  };
}

class DistrictPolicyForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allowDomainForTeacherValidate: {
        validateStatus: "success",
        errorMsg: ""
      },
      allowDomainForStudentValidate: {
        validateStatus: "success",
        errorMsg: ""
      },
      allowDomainForSchoolValidate: {
        validateStatus: "success",
        errorMsg: ""
      }
    };
  }

  componentDidMount() {
    const { loadDistrictPolicy, userOrgId, role, schoolId, loadSchoolPolicy } = this.props;
    if (role === "school-admin") {
      loadSchoolPolicy(schoolId);
    } else {
      loadDistrictPolicy({ orgId: userOrgId });
    }
  }

  static getDerivedStateFromProps(nextProps) {
    const defaultDistrictPolicy = {
      userNameAndPassword: true,
      googleSignOn: true,
      office365SignOn: true,
      cleverSignOn: true,

      teacherSignUp: true,
      studentSignUp: true,

      searchAndAddStudents: false,

      googleUsernames: true,
      office365Usernames: true,
      firstNameAndLastName: true,

      allowedDomainForStudents: "",
      allowedDomainForTeachers: "",
      allowedDomainsForDistrict: "",

      canvas: false
    };
    return {
      districtPolicy: {
        ...defaultDistrictPolicy,
        ...nextProps.districtPolicy
      }
    };
  }

  change = (e, keyName) => {
    const districtPolicyData = { ...this.state.districtPolicy };
    districtPolicyData[keyName] = e.target.checked;
    this.props.changeDistrictPolicyData(districtPolicyData);
  };

  handleTagTeacherChange = e => {
    const districtPolicyData = { ...this.state.districtPolicy };
    this.setState({
      allowDomainForTeacherValidate: {
        ...validURL(e.target.value)
      }
    });

    districtPolicyData.allowedDomainForTeachers = e.target.value;
    this.props.changeDistrictPolicyData(districtPolicyData);
  };

  handleTagStudentChange = e => {
    const districtPolicyData = { ...this.state.districtPolicy };
    this.setState({
      allowDomainForStudentValidate: {
        ...validURL(e.target.value)
      }
    });

    districtPolicyData.allowedDomainForStudents = e.target.value;
    this.props.changeDistrictPolicyData(districtPolicyData);
  };

  handleTagSchoolChange = e => {
    const districtPolicyData = { ...this.state.districtPolicy };
    this.setState({
      allowDomainForSchoolValidate: {
        ...validURL(e.target.value)
      }
    });

    districtPolicyData.allowedDomainsForDistrict = e.target.value;
    this.props.changeDistrictPolicyData(districtPolicyData);
  };

  thirdpartyIntegration = e => {
    const districtPolicyData = { ...this.state.districtPolicy };
    if (e.target.value == 1) {
      districtPolicyData.googleClassroom = true;
      districtPolicyData.canvas = false;
    } else if (e.target.value == 2) {
      districtPolicyData.googleClassroom = false;
      districtPolicyData.canvas = true;
    }
    this.props.changeDistrictPolicyData(districtPolicyData);
  };

  onSave = () => {
    const { role, schoolId } = this.props;
    const isSchoolLevel = role === "school-admin";
    const districtPolicyData = { ...this.state.districtPolicy };
    const { allowDomainForTeacherValidate, allowDomainForStudentValidate, allowDomainForSchoolValidate } = this.state;

    if (
      !districtPolicyData.userNameAndPassword &&
      !districtPolicyData.office365SignOn &&
      !districtPolicyData.cleverSignOn &&
      !districtPolicyData.googleSignOn
    ) {
      message.error("Please select 1 or more sign-on policies");
      return;
    }

    if (
      allowDomainForTeacherValidate.validateStatus === "error" ||
      allowDomainForStudentValidate.validateStatus === "error" ||
      allowDomainForSchoolValidate.validateStatus === "error"
    ) {
      return;
    }

    const updateData = {
      orgId: isSchoolLevel ? schoolId : this.props.userOrgId,
      orgType: isSchoolLevel ? "institution" : "district",
      userNameAndPassword: districtPolicyData.userNameAndPassword,
      googleSignOn: districtPolicyData.googleSignOn,
      office365SignOn: districtPolicyData.office365SignOn,
      cleverSignOn: districtPolicyData.cleverSignOn,
      teacherSignUp: districtPolicyData.teacherSignUp,
      studentSignUp: districtPolicyData.studentSignUp,
      searchAndAddStudents: districtPolicyData.searchAndAddStudents,
      googleUsernames: districtPolicyData.googleUsernames,
      schoolAdminSettingsAccess: districtPolicyData.schoolAdminSettingsAccess,
      office365Usernames: districtPolicyData.office365Usernames,
      firstNameAndLastName: districtPolicyData.firstNameAndLastName,
      allowedDomainForTeachers: districtPolicyData.allowedDomainForTeachers.length
        ? districtPolicyData.allowedDomainForTeachers.split(/[\s,]+/)
        : [],
      allowedDomainForStudents: districtPolicyData.allowedDomainForStudents.length
        ? districtPolicyData.allowedDomainForStudents.split(/[\s,]+/)
        : [],
      allowedDomainsForDistrict: districtPolicyData.allowedDomainsForDistrict.length
        ? districtPolicyData.allowedDomainsForDistrict.split(/[\s,]+/)
        : [],
      googleClassroom: districtPolicyData.googleClassroom,
      canvas: districtPolicyData.canvas
    };
    if (districtPolicyData.hasOwnProperty("_id")) {
      this.props.updateDistrictPolicy(updateData);
    } else {
      this.props.createDistrictPolicy(updateData);
    }
  };

  render() {
    const {
      districtPolicy,
      allowDomainForTeacherValidate,
      allowDomainForStudentValidate,
      allowDomainForSchoolValidate
    } = this.state;

    let thirdPartyValue = 1;
    if (districtPolicy.canvas) thirdPartyValue = 2;
    let saveBtnStr = "Create";
    if (districtPolicy.hasOwnProperty("_id")) {
      saveBtnStr = "Save";
    }
    const { role } = this.props;
    const isSchoolLevel = role === "school-admin";

    return (
      <StyledFormDiv>
        <Form>
          <StyledRow>
            <StyledLabel>{isSchoolLevel ? "School" : "District"} Signon Policy:</StyledLabel>
            <StyledElementDiv>
              <Checkbox
                checked={districtPolicy.userNameAndPassword}
                onChange={e => this.change(e, "userNameAndPassword")}
              >
                Username and password
              </Checkbox>
              <Checkbox checked={districtPolicy.googleSignOn} onChange={e => this.change(e, "googleSignOn")}>
                Google Single signon
              </Checkbox>
              <Checkbox checked={districtPolicy.office365SignOn} onChange={e => this.change(e, "office365SignOn")}>
                Office365 Single signon
              </Checkbox>
              <Checkbox checked={districtPolicy.cleverSignOn} onChange={e => this.change(e, "cleverSignOn")}>
                Clever instance signon
              </Checkbox>
            </StyledElementDiv>
          </StyledRow>
          <StyledRow>
            <StyledLabel> {isSchoolLevel ? "School" : "District"} Sign-up Policy:</StyledLabel>
            <StyledElementDiv>
              <Checkbox checked={districtPolicy.teacherSignUp} onChange={e => this.change(e, "teacherSignUp")}>
                Allow Teachers to sign-up
              </Checkbox>
              <Checkbox checked={districtPolicy.studentSignUp} onChange={e => this.change(e, "studentSignUp")}>
                Allow Students to sign-up
              </Checkbox>
            </StyledElementDiv>
          </StyledRow>
          <StyledRow>
            <StyledLabel>
              Student Enrollment <br />
              Policy:
            </StyledLabel>
            <StyledElementDiv>
              <Checkbox
                checked={districtPolicy.searchAndAddStudents}
                onChange={e => this.change(e, "searchAndAddStudents")}
              >
                Allow Teachers to search and enroll
              </Checkbox>
            </StyledElementDiv>
          </StyledRow>
          <StyledRow>
            <StyledLabel>
              Allow student addition <br />
              with:
            </StyledLabel>
            <StyledElementDiv>
              <Checkbox checked={districtPolicy.googleUsernames} onChange={e => this.change(e, "googleUsernames")}>
                Google Usernames
              </Checkbox>
              <Checkbox
                checked={districtPolicy.office365Usernames}
                onChange={e => this.change(e, "office365Usernames")}
              >
                Office 365 Usernames
              </Checkbox>
              <Checkbox
                checked={districtPolicy.firstNameAndLastName}
                onChange={e => this.change(e, "firstNameAndLastName")}
              >
                Firstname and Lastname
              </Checkbox>
            </StyledElementDiv>
          </StyledRow>
          {isSchoolLevel ? null : (
            <StyledRow>
              <StyledLabel>Allow School Level Admin</StyledLabel>
              <StyledElementDiv>
                <Checkbox
                  checked={districtPolicy.schoolAdminSettingsAccess}
                  onChange={e => this.change(e, "schoolAdminSettingsAccess")}
                />
              </StyledElementDiv>
            </StyledRow>
          )}
          <StyledRow>
            <StyledLabel>
              Allowed Domain for
              <br />
              Teachers:
            </StyledLabel>
            <StyledFormItem
              validateStatus={allowDomainForTeacherValidate.validateStatus}
              help={allowDomainForTeacherValidate.errorMsg}
            >
              <Input
                value={districtPolicy.allowedDomainForTeachers}
                onChange={this.handleTagTeacherChange}
                placeholder={"Enter allowed domain(s), example - gmail.com, edulastic.com"}
              />
            </StyledFormItem>
          </StyledRow>
          <StyledRow>
            <StyledLabel>
              Allowed Domain for
              <br />
              Students:
            </StyledLabel>
            <StyledFormItem
              validateStatus={allowDomainForStudentValidate.validateStatus}
              help={allowDomainForStudentValidate.errorMsg}
            >
              <Input
                value={districtPolicy.allowedDomainForStudents}
                onChange={this.handleTagStudentChange}
                placeholder={"Enter allowed domain(s), example - gmail.com, edulastic.com"}
              />
            </StyledFormItem>
          </StyledRow>
          <StyledRow>
            <StyledLabel>
              Domain for
              <br />
              recommending Schools:
            </StyledLabel>
            <StyledFormItem
              validateStatus={allowDomainForSchoolValidate.validateStatus}
              help={allowDomainForSchoolValidate.errorMsg}
            >
              <Input
                value={districtPolicy.allowedDomainsForDistrict}
                onChange={this.handleTagSchoolChange}
                placeholder={"Enter allowed domain(s), example - gmail.com, edulastic.com"}
              />
            </StyledFormItem>
          </StyledRow>
          <StyledRow>
            <StyledLabel>3rd-party integrations:</StyledLabel>
            <RadioGroup onChange={this.thirdpartyIntegration} value={thirdPartyValue}>
              <Radio value={1}>Google Classroom</Radio>
              <Radio value={2}>Canvas</Radio>
            </RadioGroup>
          </StyledRow>
          <StyledRow>
            <SaveButton onClick={this.onSave}>{saveBtnStr}</SaveButton>
          </StyledRow>
        </Form>
      </StyledFormDiv>
    );
  }
}

const enhance = compose(
  connect(
    (state, { role }) => ({
      districtPolicy: get(state, ["districtPolicyReducer", role === "school-admin" ? "schoolData" : "data"], []),
      userOrgId: getUserOrgId(state),
      role: getUserRole(state),
      schoolId: get(state, "user.saSettingsSchool")
    }),
    {
      loadDistrictPolicy: receiveDistrictPolicyAction,
      updateDistrictPolicy: updateDistrictPolicyAction,
      createDistrictPolicy: createDistrictPolicyAction,
      changeDistrictPolicyData: changeDistrictPolicyAction,
      loadSchoolPolicy: receiveSchoolPolicyAction
    }
  )
);

export default enhance(DistrictPolicyForm);

DistrictPolicyForm.propTypes = {
  loadDistrictPolicy: PropTypes.func.isRequired,
  updateDistrictPolicy: PropTypes.func.isRequired,
  createDistrictPolicy: PropTypes.func.isRequired,
  userOrgId: PropTypes.string.isRequired
};
