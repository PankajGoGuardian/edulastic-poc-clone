import React, { Component } from "react";
import PropTypes from "prop-types";
import { Form, Checkbox, Radio, message } from "antd";
const RadioGroup = Radio.Group;

import {
  StyledFormDiv,
  StyledRow,
  StyledLabel,
  StyledElementDiv,
  StyledSelectTag,
  SaveButton,
  StyledFormItem
} from "./styled";

function validURL(value) {
  var pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
    "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
    "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
    "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
    "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // fragment locator
  for (let i = 0; i < value.length; i++) {
    if (!pattern.test(value[i])) {
      return {
        validateStatus: "error",
        errorMsg: "Enter allowed domain(s), example - gmail.com, edulastic.com"
      };
    }
    return {
      validateStatus: "success",
      errorMsg: null
    };
  }
}

class DistrictPolicyForm extends React.Component {
  constructor(props) {
    super(props);

    const optionalValue = this.initOptionalStatue(this.props.districtPolicy);

    this.state = {
      districtPolicy: {
        ...this.props.districtPolicy
      },
      thirdPartyValue: optionalValue.thirdPartyValue,
      optionalStatus: optionalValue.status,
      allowDomainForTeacher: {
        value: this.props.districtPolicy.allowedDomainForTeachers,
        ...validURL(this.props.districtPolicy.allowedDomainForTeachers)
      },
      allowDomainForStudent: {
        value: this.props.districtPolicy.allowedDomainForStudents,
        ...validURL(this.props.districtPolicy.allowedDomainForStudents)
      }
    };
  }

  initOptionalStatue = districtPolicy => {
    const optionalValue = {
      status: {
        office365Usernames: false,
        firstNameAndLastName: false,
        googleUsernames: false,
        thirdPartyValue: false
      },
      value: {
        office365Usernames: false,
        firstNameAndLastName: false,
        googleUsernames: false,
        googleClassroom: false,
        canvas: false
      },
      thirdPartyValue: 0
    };

    const optionalValueArray = [
      "office365Usernames",
      "firstNameAndLastName",
      "googleUsernames",
      "googleClassroom",
      "canvas"
    ];

    for (const [index, value] of optionalValueArray.entries()) {
      if (districtPolicy.hasOwnProperty(value)) {
        if (value == "googleClassroom" || value == "canvas") {
          optionalValue.status.thirdPartyValue = true;
        } else optionalValue.status[value] = true;
        optionalValue.value[value] = districtPolicy[value];
      } else {
        if (value == "googleClassroom" || value == "canvas") optionalValue.status.thirdPartyValue = false;
        else optionalValueStatus[value] = false;
      }
    }

    if (optionalValue.status.thirdPartyValue) {
      if (optionalValue.value.googleClassroom) optionalValue.thirdPartyValue = 1;
      else if (optionalValue.value.canvas) optionalValue.thirdPartyValue = 2;
    }

    return optionalValue;
  };

  change = (e, keyName) => {
    const { districtPolicy: policyData } = this.state;
    policyData[keyName] = e.target.checked;

    const { optionalStatus } = this.state;
    if (keyName === "office365Usernames" || keyName === "firstNameAndLastName" || keyName === "googleUsernames")
      optionalStatus[keyName] = true;
    if (keyName == "googleClassroom" || keyName === "canvas") optionalStatus["thirdPartyValue"] = true;

    this.setState({
      districtPolicy: policyData,
      optionalStatus: optionalStatus
    });
  };

  handleTagTeacherChange = e => {
    this.setState({
      allowDomainForTeacher: {
        ...validURL(e),
        value: e
      }
    });
  };

  handleTagStudentChange = e => {
    this.setState({
      allowDomainForStudent: {
        ...validURL(e),
        value: e
      }
    });
  };

  thirdpartyIntegration = e => {
    const { districtPolicy: policyData } = this.state;
    if (e.target.value == 1) {
      policyData.googleClassroom = true;
      policyData.canvas = false;
    } else if (e.target.value == 2) {
      policyData.googleClassroom = false;
      policyData.canvas = true;
    }

    this.setState({
      districtPolicy: policyData,
      thirdPartyValue: e.target.value
    });
  };

  onSave = () => {
    const { districtPolicy: policyData, optionalStatus } = this.state;

    if (
      !policyData.userNameAndPassword &&
      !policyData.office365SignOn &&
      !policyData.cleverSignOn &&
      !policyData.googleSignOn
    ) {
      message.error("Please select 1 or more sign-on policies");
      return;
    }

    const updateData = {
      orgId: policyData.orgId,
      orgType: policyData.orgType,
      userNameAndPassword: policyData.userNameAndPassword,
      googleSignOn: policyData.googleSignOn,
      office365SignOn: policyData.office365SignOn,
      cleverSignOn: policyData.cleverSignOn,
      teacherSignUp: policyData.teacherSignUp,
      studentSignUp: policyData.studentSignUp,
      allowedDomainForTeachers: allowDomainForStudent.value,
      allowedDomainForStudents: allowDomainForTeacher.value
    };

    if (optionalStatus.thirdPartyValue) {
      updateData.googleClassroom = policyData.googleClassroom;
      updateData.canvas = policyData.canvas;
    }

    if (optionalStatus.googleUsernames) updateData.googleUsernames = policyData.googleUsernames;
    if (optionalStatus.office365Usernames) updateData.office365Usernames = policyData.office365Usernames;
    if (optionalStatus.firstNameAndLastName) updateData.firstNameAndLastName = policyData.firstNameAndLastName;

    this.props.saveDistrictPolicy(updateData);
  };

  render() {
    const { districtPolicy, thirdPartyValue, allowDomainForStudent, allowDomainForTeacher } = this.state;

    return (
      <StyledFormDiv>
        <Form>
          <StyledRow>
            <StyledLabel>District Signon Policy:</StyledLabel>
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
            <StyledLabel>District Sing-up Policy:</StyledLabel>
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
          <StyledRow>
            <StyledLabel>
              Allowed Domain for
              <br />
              Teachers:
            </StyledLabel>
            <StyledFormItem validateStatus={allowDomainForTeacher.validateStatus} help={allowDomainForTeacher.errorMsg}>
              <StyledSelectTag
                mode="tags"
                defaultValue={districtPolicy.allowedDomainForTeachers}
                tokenSeparators={[","]}
                onChange={this.handleTagTeacherChange}
              />
            </StyledFormItem>
          </StyledRow>
          <StyledRow>
            <StyledLabel>
              Allowed Domain for
              <br />
              Students:
            </StyledLabel>
            <StyledFormItem validateStatus={allowDomainForStudent.validateStatus} help={allowDomainForStudent.errorMsg}>
              <StyledSelectTag
                mode="tags"
                defaultValue={districtPolicy.allowedDomainForStudents}
                tokenSeparators={[","]}
                onChange={this.handleTagStudentChange}
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
            <SaveButton onClick={this.onSave}>Save</SaveButton>
          </StyledRow>
        </Form>
      </StyledFormDiv>
    );
  }
}

export default DistrictPolicyForm;

DistrictPolicyForm.propTypes = {
  districtPolicy: PropTypes.object.isRequired,
  saveDistrictPolicy: PropTypes.func.isRequired
};
