import { CheckboxLabel, RadioBtn, RadioGrp, notification, TextInputStyled, EduButton } from "@edulastic/common";
import { Form } from "antd";
import { produce } from "immer";
import { get } from "lodash";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { getUserOrgId, getUserRole } from "../../../src/selectors/user";
// actions
import {
  changeDistrictPolicyAction,
  createDistrictPolicyAction,
  getPolicies,
  receiveDistrictPolicyAction,
  receiveSchoolPolicyAction,
  updateDistrictPolicyAction
} from "../../ducks";
import { HelperText, StyledElementDiv, StyledFormDiv, StyledFormItem, StyledLabel, StyledRow } from "./styled";

const _3RDPARTYINTEGRATION = {
  googleClassroom: 1,
  canvas: 2,
  schoology: 3,
  classlink: 4,
  none: 5
};

function validURL(value) {
  if (value.length == 0)
    return {
      validateStatus: "success",
      errorMsg: ""
    };

  const pattern = new RegExp(/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z0-9]{2,})+/);

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
      loadDistrictPolicy({ orgId: userOrgId, orgType: "district" });
    }
  }

  componentDidUpdate(prevProps) {
    /**
     * school selection is changed
     */
    const { schoolId, loadSchoolPolicy } = this.props;
    if (prevProps.schoolId != schoolId && schoolId) {
      loadSchoolPolicy(schoolId);
    }
  }

  change = (e, keyName) => {
    const { districtPolicy, changeDistrictPolicyData, role } = this.props;
    const districtPolicyData = { ...districtPolicy };
    districtPolicyData[keyName] = e.target.checked;
    changeDistrictPolicyData({ ...districtPolicyData, schoolLevel: role === "school-admin" });
  };

  handleTagTeacherChange = e => {
    const { districtPolicy, changeDistrictPolicyData, role } = this.props;
    const districtPolicyData = { ...districtPolicy };
    this.setState({
      allowDomainForTeacherValidate: {
        ...validURL(e.target.value)
      }
    });

    districtPolicyData.allowedDomainForTeachers = e.target.value;
    changeDistrictPolicyData({ ...districtPolicyData, schoolLevel: role === "school-admin" });
  };

  handleTagStudentChange = e => {
    const { districtPolicy, changeDistrictPolicyData, role } = this.props;
    const districtPolicyData = { ...districtPolicy };
    this.setState({
      allowDomainForStudentValidate: {
        ...validURL(e.target.value)
      }
    });

    districtPolicyData.allowedDomainForStudents = e.target.value;
    changeDistrictPolicyData({ ...districtPolicyData, schoolLevel: role === "school-admin" });
  };

  handleTagSchoolChange = e => {
    const { districtPolicy, changeDistrictPolicyData, role } = this.props;
    const districtPolicyData = { ...districtPolicy };
    this.setState({
      allowDomainForSchoolValidate: {
        ...validURL(e.target.value)
      }
    });

    districtPolicyData.allowedDomainsForDistrict = e.target.value;
    changeDistrictPolicyData({ ...districtPolicyData, schoolLevel: role === "school-admin" });
  };

  thirdpartyIntegration = e => {
    const { districtPolicy, changeDistrictPolicyData, role } = this.props;
    const districtPolicyData = { ...districtPolicy };
    // initially make all false and according to target make flag true
    districtPolicyData.googleClassroom = false;
    districtPolicyData.canvas = false;
    districtPolicyData.schoology = false;
    districtPolicyData.classlink = false;
    switch (e.target.value) {
      case 1:
        districtPolicyData.googleClassroom = true;
        break;
      case 2:
        districtPolicyData.canvas = true;
        break;
      case 3:
        districtPolicyData.schoology = true;
        break;
      case 4:
        districtPolicyData.classlink = true;
        break;
      default:
        break;
    }
    changeDistrictPolicyData({ ...districtPolicyData, schoolLevel: role === "school-admin" });
  };

  disableStudentLogin = event => {
    const { districtPolicy = {}, changeDistrictPolicyData, role } = this.props;

    const isStudentLoginDisabled = event.target.value;

    const nextState = produce(districtPolicy, draftState => {
      draftState.disableStudentLogin = isStudentLoginDisabled === "yes";
    });

    changeDistrictPolicyData({ ...nextState, schoolLevel: role === "school-admin" });
  };

  enforceDistrictSignonPolicy = e => {
    const { districtPolicy = {}, changeDistrictPolicyData, role } = this.props;

    const { value } = e.target;

    const nextState = produce(districtPolicy, draftState => {
      draftState.enforceDistrictSignonPolicy = value === "yes";
    });

    changeDistrictPolicyData({ ...nextState, schoolLevel: role === "school-admin" });
  };

  isValidIp = (ipAddress = "") => {
    const validIpAddressPattern = /^(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.(((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])-(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9]))|25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[*0-9])\.(((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])-(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9]))|25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[*0-9])$/;
    return validIpAddressPattern.test(ipAddress); // will return true if valid
  };

  mapIpAddresses = (ipAddressesString = "", checkerror = false) => {
    if (ipAddressesString === "") return [];
    return ipAddressesString.split(",").map((ipAddress = "") => {
      const trimmedIpAddress = ipAddress.trim();
      if (checkerror && !this.isValidIp(trimmedIpAddress)) {
        throw new Error("Enter allowed IP(s), example - 128.0.*.1, 187.0.*.*"); // will return map with error
      }
      return trimmedIpAddress;
    });
  };

  changeAllowIpField = (ipAddresses = []) => {
    const { districtPolicy = {}, changeDistrictPolicyData, role } = this.props;

    const nextState = produce(districtPolicy, draftState => {
      draftState.allowedIpForAssignments = ipAddresses;
    });

    changeDistrictPolicyData({ ...nextState, schoolLevel: role === "school-admin" });
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
    const { role, schoolId, districtPolicy, userOrgId, updateDistrictPolicy, createDistrictPolicy } = this.props;
    const isSchoolLevel = role === "school-admin";
    const districtPolicyData = { ...districtPolicy };
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
      !districtPolicyData.googleSignOn &&
      !districtPolicyData.atlasSignOn
    ) {
      notification({ messageKey: "pleaseSelectOneOrMoreSignOnParticles" });
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
      orgId: isSchoolLevel ? schoolId : userOrgId,
      orgType: isSchoolLevel ? "institution" : "district",
      userNameAndPassword: districtPolicyData.userNameAndPassword,
      googleSignOn: districtPolicyData.googleSignOn,
      office365SignOn: districtPolicyData.office365SignOn,
      cleverSignOn: districtPolicyData.cleverSignOn,
      atlasSignOn: districtPolicyData.atlasSignOn,
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
      googleClassroom: districtPolicyData.googleClassroom || false,
      canvas: districtPolicyData.canvas || false,
      allowedIpForAssignments: districtPolicyData.allowedIpForAssignments || [],
      disableStudentLogin: districtPolicyData.disableStudentLogin || false,
      schoology: districtPolicyData.schoology || false,
      classlink: districtPolicyData.classlink || false,
      enforceDistrictSignonPolicy: districtPolicyData.enforceDistrictSignonPolicy || false
    };
    if (Object.prototype.hasOwnProperty.call(districtPolicyData, "_id")) {
      updateDistrictPolicy(updateData);
    } else {
      createDistrictPolicy(updateData);
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
    const thirdPartyValue = districtPolicy.googleClassroom
      ? _3RDPARTYINTEGRATION.googleClassroom
      : districtPolicy.canvas
      ? _3RDPARTYINTEGRATION.canvas
      : districtPolicy.schoology
      ? _3RDPARTYINTEGRATION.schoology
      : districtPolicy.classlink
      ? _3RDPARTYINTEGRATION.classlink
      : _3RDPARTYINTEGRATION.none;
    let saveBtnStr = "Save";
    if (Object.prototype.hasOwnProperty.call(districtPolicy, "_id")) {
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
              <CheckboxLabel
                checked={districtPolicy.userNameAndPassword}
                onChange={e => this.change(e, "userNameAndPassword")}
              >
                Username and password
              </CheckboxLabel>
              <CheckboxLabel checked={districtPolicy.googleSignOn} onChange={e => this.change(e, "googleSignOn")}>
                Google Single signon
              </CheckboxLabel>
              <CheckboxLabel checked={districtPolicy.office365SignOn} onChange={e => this.change(e, "office365SignOn")}>
                Office365 Single signon
              </CheckboxLabel>
              <CheckboxLabel checked={districtPolicy.atlasSignOn} onChange={e => this.change(e, "atlasSignOn")}>
                Classlink Single signon
              </CheckboxLabel>
              <CheckboxLabel checked={districtPolicy.cleverSignOn} onChange={e => this.change(e, "cleverSignOn")}>
                Clever instance signon
              </CheckboxLabel>
            </StyledElementDiv>
          </StyledRow>
          <StyledRow>
            <StyledLabel> {isSchoolLevel ? "School" : "District"} Sign-up Policy:</StyledLabel>
            <StyledElementDiv>
              <CheckboxLabel checked={districtPolicy.teacherSignUp} onChange={e => this.change(e, "teacherSignUp")}>
                Allow Teachers to sign-up
              </CheckboxLabel>
              <CheckboxLabel checked={districtPolicy.studentSignUp} onChange={e => this.change(e, "studentSignUp")}>
                Allow Students to sign-up
              </CheckboxLabel>
            </StyledElementDiv>
          </StyledRow>
          <StyledRow>
            <StyledLabel>
              Student Enrollment <br />
              Policy:
            </StyledLabel>
            <StyledElementDiv>
              <CheckboxLabel
                checked={districtPolicy.searchAndAddStudents}
                onChange={e => this.change(e, "searchAndAddStudents")}
              >
                Allow Teachers to search and enroll
              </CheckboxLabel>
            </StyledElementDiv>
          </StyledRow>
          <StyledRow>
            <StyledLabel>
              Allow student addition <br />
              with:
            </StyledLabel>
            <StyledElementDiv>
              <CheckboxLabel checked={districtPolicy.googleUsernames} onChange={e => this.change(e, "googleUsernames")}>
                Google Usernames
              </CheckboxLabel>
              <CheckboxLabel
                checked={districtPolicy.office365Usernames}
                onChange={e => this.change(e, "office365Usernames")}
              >
                Office 365 Usernames
              </CheckboxLabel>
              <CheckboxLabel
                checked={districtPolicy.firstNameAndLastName}
                onChange={e => this.change(e, "firstNameAndLastName")}
              >
                Firstname and Lastname
              </CheckboxLabel>
            </StyledElementDiv>
          </StyledRow>
          {isSchoolLevel ? null : (
            <StyledRow>
              <StyledLabel>Allow School Level Admin</StyledLabel>
              <StyledElementDiv>
                <CheckboxLabel
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
              <TextInputStyled
                value={districtPolicy.allowedDomainForTeachers}
                onChange={this.handleTagTeacherChange}
                placeholder="Enter allowed domain(s), example - gmail.com, edulastic.com"
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
              <TextInputStyled
                value={districtPolicy.allowedDomainForStudents}
                onChange={this.handleTagStudentChange}
                placeholder="Enter allowed domain(s), example - gmail.com, edulastic.com"
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
              <TextInputStyled
                value={districtPolicy.allowedDomainsForDistrict}
                onChange={this.handleTagSchoolChange}
                placeholder="Enter allowed domain(s), example - gmail.com, edulastic.com"
              />
            </StyledFormItem>
          </StyledRow>
          <StyledRow>
            <StyledLabel>3rd-party integrations:</StyledLabel>
            <RadioGrp onChange={this.thirdpartyIntegration} value={thirdPartyValue}>
              <RadioBtn value={1}>Google Classroom</RadioBtn>
              <RadioBtn value={2}>Canvas</RadioBtn>
              <RadioBtn value={3}>Schoology</RadioBtn>
              <RadioBtn value={4}>ClassLink</RadioBtn>
              <RadioBtn value={5}>None</RadioBtn>
              {/* None signifies that no 3rd party integration is enabled */}
            </RadioGrp>
          </StyledRow>
          <StyledRow>
            <StyledLabel>Disable Student Login: </StyledLabel>
            <RadioGrp onChange={this.disableStudentLogin} value={districtPolicy?.disableStudentLogin ? "yes" : "no"}>
              <RadioBtn value="yes">Yes</RadioBtn>
              <RadioBtn value="no">No</RadioBtn>
            </RadioGrp>
          </StyledRow>
          <StyledRow>
            <StyledLabel>
              Enforced District Sign-On
              <br /> policy:{" "}
            </StyledLabel>
            <RadioGrp
              onChange={this.enforceDistrictSignonPolicy}
              value={districtPolicy?.enforceDistrictSignonPolicy ? "yes" : "no"}
            >
              <RadioBtn value="yes">Yes</RadioBtn>
              <RadioBtn value="no">No</RadioBtn>
            </RadioGrp>
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
              <TextInputStyled
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
          <StyledRow type="flex" justify="center">
            <EduButton onClick={this.onSave}>{saveBtnStr}</EduButton>
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
