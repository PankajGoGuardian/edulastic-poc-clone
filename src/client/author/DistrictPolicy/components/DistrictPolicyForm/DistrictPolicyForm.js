import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { get } from "lodash";
import { produce } from "immer";

// actions
import {
  receiveDistrictPolicyAction,
  updateDistrictPolicyAction,
  createDistrictPolicyAction,
  changeDistrictPolicyAction,
  receiveSchoolPolicyAction,
  getPolicies
} from "../../ducks";
import { getUserOrgId, getUserRole } from "../../../src/selectors/user";

import { Form, Checkbox, Radio, message, Input } from "antd";
const RadioGroup = Radio.Group;

import {
  StyledFormDiv,
  StyledRow,
  StyledLabel,
  StyledElementDiv,
  SaveButton,
  StyledFormItem,
  HelperText
} from "./styled";

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
      },
      allowIpForAssignmentValidate: {
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

  componentDidUpdate(prevProps) {
    /**
     * school selection is changed
     */
    if (prevProps.schoolId != this.props.schoolId && this.props.schoolId) {
      loadSchoolPolicy(this.props.schoolId);
    }
  }

  change = (e, keyName) => {
    const districtPolicyData = { ...this.props.districtPolicy };
    districtPolicyData[keyName] = e.target.checked;
    this.props.changeDistrictPolicyData({ ...districtPolicyData, schoolLevel: this.props.role === "school-admin" });
  };

  handleTagTeacherChange = e => {
    const districtPolicyData = { ...this.props.districtPolicy };
    this.setState({
      allowDomainForTeacherValidate: {
        ...validURL(e.target.value)
      }
    });

    districtPolicyData.allowedDomainForTeachers = e.target.value;
    this.props.changeDistrictPolicyData({ ...districtPolicyData, schoolLevel: this.props.role === "school-admin" });
  };

  handleTagStudentChange = e => {
    const districtPolicyData = { ...this.props.districtPolicy };
    this.setState({
      allowDomainForStudentValidate: {
        ...validURL(e.target.value)
      }
    });

    districtPolicyData.allowedDomainForStudents = e.target.value;
    this.props.changeDistrictPolicyData({ ...districtPolicyData, schoolLevel: this.props.role === "school-admin" });
  };

  handleTagSchoolChange = e => {
    const districtPolicyData = { ...this.props.districtPolicy };
    this.setState({
      allowDomainForSchoolValidate: {
        ...validURL(e.target.value)
      }
    });

    districtPolicyData.allowedDomainsForDistrict = e.target.value;
    this.props.changeDistrictPolicyData({ ...districtPolicyData, schoolLevel: this.props.role === "school-admin" });
  };

  thirdpartyIntegration = e => {
    const districtPolicyData = { ...this.props.districtPolicy };
    if (e.target.value == 1) {
      districtPolicyData.googleClassroom = true;
      districtPolicyData.canvas = false;
    } else if (e.target.value == 2) {
      districtPolicyData.googleClassroom = false;
      districtPolicyData.canvas = true;
    }
    this.props.changeDistrictPolicyData({ ...districtPolicyData, schoolLevel: this.props.role === "school-admin" });
  };

  disableStudentLogin = event => {
    const { districtPolicy = {}, changeDistrictPolicyData } = this.props;

    const isStudentLoginDisabled = event.target.value;

    const nextState = produce(districtPolicy, draftState => {
      draftState.disableStudentLogin = isStudentLoginDisabled === "yes";
    });

    changeDistrictPolicyData({ ...nextState, schoolLevel: this.props.role === "school-admin" });
  };

  isValidIp = (ipAddress = "") => {
    const validIpAddressPattern = /^(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.(((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])-(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9]))|25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[\*0-9])\.(((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])-(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9]))|25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[\*0-9])$/;
    return validIpAddressPattern.test(ipAddress); // will return true if valid
  };

  mapIpAddresses = (ipAddressesString = "", checkerror = false) => {
    return ipAddressesString.split(",").map((ipAddress = "") => {
      const trimmedIpAddress = ipAddress.trim();
      if (checkerror && !this.isValidIp(trimmedIpAddress)) {
        throw new Error("Enter allowed IP(s), example - 128.0.*.1, 187.0.*.*"); // will return map with error
      }
      return trimmedIpAddress;
    });
  };

  changeAllowIpField = (ipAddresses = []) => {
    const { districtPolicy = {}, changeDistrictPolicyData } = this.props;

    const nextState = produce(districtPolicy, draftState => {
      draftState.allowedIpForAssignments = ipAddresses;
    });

    changeDistrictPolicyData({ ...nextState, schoolLevel: this.props.role === "school-admin" });
  };

  handleInputIpAddresses = event => {
    // ipAddressesString = "127.0.0.1, 192.168.0.1"
    const ipAddressesString = event.target.value;
    try {
      // ipAddresses = ["127.0.0.1", "192.168.0.1"]
      const ipAddresses = this.mapIpAddresses(ipAddressesString, true);
      this.setState({
        allowIpForAssignmentValidate: {
          validateStatus: "success",
          errorMsg: ""
        }
      });
      this.changeAllowIpField(ipAddresses);
    } catch (error) {
      // ipAddresses = ["127.0.0.1", "192.168.0.1"]
      const ipAddresses = this.mapIpAddresses(ipAddressesString, false);
      this.setState({
        allowIpForAssignmentValidate: {
          validateStatus: "error",
          errorMsg: error.message
        }
      });
      this.changeAllowIpField(ipAddresses);
    }
  };

  onSave = () => {
    const { role, schoolId } = this.props;
    const isSchoolLevel = role === "school-admin";
    const districtPolicyData = { ...this.props.districtPolicy };
    const {
      allowDomainForTeacherValidate,
      allowDomainForStudentValidate,
      allowDomainForSchoolValidate,
      allowIpForAssignmentValidate
    } = this.state;

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
      allowDomainForSchoolValidate.validateStatus === "error" ||
      allowIpForAssignmentValidate.validateStatus === "error"
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
      searchAndAddStudents: districtPolicyData.searchAndAddStudents || false,
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
      canvas: districtPolicyData.canvas,
      allowedIpForAssignments: districtPolicyData.allowedIpForAssignments || [],
      disableStudentLogin: districtPolicyData.disableStudentLogin || false
    };
    if (districtPolicyData.hasOwnProperty("_id")) {
      this.props.updateDistrictPolicy(updateData);
    } else {
      this.props.createDistrictPolicy(updateData);
    }
  };

  render() {
    const {
      allowDomainForTeacherValidate,
      allowDomainForStudentValidate,
      allowDomainForSchoolValidate,
      allowIpForAssignmentValidate
    } = this.state;

    const { districtPolicy } = this.props;

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
            <StyledLabel>Disable Student Login: </StyledLabel>
            <RadioGroup onChange={this.disableStudentLogin} value={districtPolicy?.disableStudentLogin ? "yes" : "no"}>
              <Radio value="yes">Yes</Radio>
              <Radio value="no">No</Radio>
            </RadioGroup>
          </StyledRow>
          <StyledRow>
            <StyledLabel>
              Allowed IP for password
              <br />
              controlled assessments:
            </StyledLabel>
            <StyledFormItem
              validateStatus={allowIpForAssignmentValidate.validateStatus}
              help={allowIpForAssignmentValidate.errorMsg}
            >
              <Input
                value={districtPolicy.allowedIpForAssignments}
                onChange={this.handleInputIpAddresses}
                placeholder="Enter allowed ip(s), example - 127.0.*.1, 187.0.*.*"
              />
              <HelperText>
                Enter allowed IP(s) for controlled assignments. Range allowed eg: 22.32.0-255.0-255. Wild chars allowed
                eg: 127.0.*.1, 187.0.*.* etc.
              </HelperText>
            </StyledFormItem>
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
    state => ({
      districtPolicy: getPolicies(state),
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
