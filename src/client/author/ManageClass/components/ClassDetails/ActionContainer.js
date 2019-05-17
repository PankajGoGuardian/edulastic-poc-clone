import React, { useState } from "react";
import { connect } from "react-redux";
import { get, unset, split } from "lodash";
import PropTypes from "prop-types";
import { Menu, Dropdown, Tooltip } from "antd";
import * as moment from "moment";
import AddStudentModal from "./AddStudent/AddStudentModal";
import { addStudentRequestAction } from "../../ducks";
import { getUserOrgData } from "../../../src/selectors/user";

import {
  DividerDiv,
  TitleWarapper,
  ButtonsWrapper,
  AddStudentDivider,
  AddStudentButton,
  CircleIconButton,
  ActionButton,
  StyledIcon
} from "./styled";

const menu = (
  <Menu>
    <Menu.Item key="0">1st menu item</Menu.Item>
    <Menu.Item key="1">2nd menu item</Menu.Item>
    <Menu.Item key="3">3rd menu item</Menu.Item>
  </Menu>
);

const ActionContainer = ({
  addStudentRequest,
  selctedClass,
  orgData,
  submitted,
  added,
  printPreview,
  studentLoaded
}) => {
  const [isOpen, setModalStatus] = useState(false);
  const [sentReq, setReqStatus] = useState(false);

  let formRef = null;

  const toggleModal = () => {
    setModalStatus(!isOpen);
  };

  if (added && sentReq) {
    setReqStatus(false);
    setModalStatus(false);
  }

  const addStudent = () => {
    if (formRef) {
      const { form } = formRef.props;
      form.validateFields((err, values) => {
        if (!err) {
          const { fullName } = values;
          const tempName = split(fullName, " ");
          const firstName = tempName[0];
          const lastName = tempName[1];

          values.classCode = selctedClass.code;
          values.role = "student";
          values.districtId = orgData.districtId;
          values.institutionIds = orgData.institutionIds;
          values.firstName = firstName;
          values.lastName = lastName;

          const contactEmails = get(values, "contactEmails");
          if (contactEmails) {
            values.contactEmails = [contactEmails];
          }

          if (values.dob) {
            values.dob = moment(values.dob).format("x");
          }

          unset(values, ["confirmPwd"]);
          unset(values, ["fullName"]);

          addStudentRequest(values);
          setReqStatus(true);
        }
      });
    }
  };

  const saveFormRef = node => {
    formRef = node;
  };

  return (
    <>
      <AddStudentModal
        handleAdd={addStudent}
        handleCancel={toggleModal}
        isOpen={isOpen}
        submitted={submitted}
        wrappedComponentRef={saveFormRef}
      />
      <AddStudentDivider>
        <TitleWarapper>Student</TitleWarapper>
        <DividerDiv />
        <ButtonsWrapper>
          <Tooltip placement="bottomLeft" title="Add Student">
            <CircleIconButton type="primary" shape="circle" icon="plus" size="large" onClick={toggleModal} />
          </Tooltip>
          <CircleIconButton
            type="primary"
            shape="circle"
            icon="printer"
            size="large"
            disabled={!studentLoaded}
            onClick={printPreview}
          />
          <Dropdown overlay={menu} trigger={["click"]}>
            <ActionButton type="primary" ghost>
              Actions <StyledIcon type="caret-down" theme="filled" size={16} />
            </ActionButton>
          </Dropdown>
          <AddStudentButton>Add Multiple Students</AddStudentButton>
        </ButtonsWrapper>
      </AddStudentDivider>
    </>
  );
};

ActionContainer.propTypes = {
  addStudentRequest: PropTypes.func.isRequired,
  printPreview: PropTypes.func.isRequired,
  selctedClass: PropTypes.object.isRequired,
  orgData: PropTypes.object.isRequired,
  submitted: PropTypes.bool.isRequired,
  studentLoaded: PropTypes.bool.isRequired,
  added: PropTypes.any.isRequired
};

ActionContainer.defaultProps = {};

export default connect(
  state => ({
    orgData: getUserOrgData(state),
    selctedClass: get(state, "manageClass.entity"),
    submitted: get(state, "manageClass.submitted"),
    added: get(state, "manageClass.added"),
    studentLoaded: get(state, "manageClass.loaded")
  }),
  {
    addStudentRequest: addStudentRequestAction
  }
)(ActionContainer);
