import React, { useState } from "react";
import { connect } from "react-redux";
import { get, unset, split, isEmpty } from "lodash";
import PropTypes from "prop-types";
import { Menu, Dropdown, Tooltip, message, Icon } from "antd";
import * as moment from "moment";
import AddStudentModal from "./AddStudent/AddStudentModal";
import DeleteConfirm from "./DeleteConfirm/DeleteConfirm";
import { addStudentRequestAction, changeTTSRequestAction, updateStudentRequestAction } from "../../ducks";
import { getUserOrgData } from "../../../src/selectors/user";

import {
  DividerDiv,
  TitleWarapper,
  ButtonsWrapper,
  AddStudentDivider,
  AddStudentButton,
  CircleIconButton,
  ActionButton,
  StyledIcon,
  MenuItem
} from "./styled";

const modalStatus = {};

const ActionContainer = ({
  addStudentRequest,
  selectedClass,
  orgData,
  submitted,
  added,
  printPreview,
  studentLoaded,
  selectedStudent,
  changeTTS
}) => {
  const [isOpen, setModalStatus] = useState(modalStatus);
  const [sentReq, setReqStatus] = useState(false);
  const [isEdit, setEditStudentStatues] = useState(false);

  let formRef = null;

  const toggleModal = key => {
    setModalStatus({ [key]: !isOpen[key] });
    setEditStudentStatues(false);
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

          values.classCode = selectedClass.code;
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

  const showMessage = (type, msg) => {
    message.open({ type, content: msg });
  };

  const handleActionMenuClick = ({ key }) => {
    switch (key) {
      case "enableSpeech":
        if (isEmpty(selectedStudent)) {
          return showMessage("error", "Select 1 or more students to enable text to speech");
        }
        if (changeTTS) {
          const stdIds = selectedStudent.map(std => std._id);
          changeTTS({ userId: stdIds, ttsStatus: "yes" });
        }
        break;
      case "disableSpeech":
        if (isEmpty(selectedStudent)) {
          return showMessage("error", "Select 1 or more students to disable text to speech");
        }
        if (changeTTS) {
          const stdIds = selectedStudent.map(std => std._id);
          changeTTS({ userId: stdIds, ttsStatus: "no" });
        }
        break;
      case "delete":
        if (isEmpty(selectedStudent)) {
          return showMessage("error", "Select 1 or more students to remove");
        }
        toggleModal("delete");
        break;
      case "resetPwd":
        if (isEmpty(selectedStudent)) {
          return showMessage("error", "Select 1 or more students to change password");
        }
        toggleModal("resetPwd");
        break;
      case "edit":
        if (isEmpty(selectedStudent)) {
          return showMessage("error", "Please select a student to update");
        }
        if (selectedStudent.length > 1) {
          return showMessage("error", "Please select only one student");
        }
        toggleModal("add");
        setEditStudentStatues(true);
        break;
      case "addCoTeacher":
        toggleModal("addCoTeacher");
        break;
      default:
        break;
    }
  };

  const actionMenu = (
    <Menu onClick={handleActionMenuClick}>
      <MenuItem key="enableSpeech">
        <Icon type="caret-right" />
        Enable Text To Speech
      </MenuItem>
      <MenuItem key="disableSpeech">
        <Icon type="sound" />
        Disable Text To Speech
      </MenuItem>
      <MenuItem key="delete">
        <Icon type="delete" />
        Remove Selected Student(s)
      </MenuItem>
      <MenuItem key="resetPwd">
        <Icon type="key" />
        Reset Password
      </MenuItem>
      <MenuItem key="edit">
        <Icon type="edit" />
        Edit Student
      </MenuItem>
      <MenuItem key="addCoTeacher">
        <Icon type="switcher" />
        Add a Co-Teacher
      </MenuItem>
    </Menu>
  );

  return (
    <>
      <AddStudentModal
        handleAdd={addStudent}
        handleCancel={() => toggleModal("add")}
        isOpen={isOpen.add}
        submitted={submitted}
        wrappedComponentRef={saveFormRef}
        stds={selectedStudent}
        isEdit={isEdit}
      />

      <DeleteConfirm isOpen={isOpen.delete} handleCancel={() => toggleModal("delete")} />

      <AddStudentDivider>
        <TitleWarapper>Student</TitleWarapper>
        <DividerDiv />
        <ButtonsWrapper>
          <Tooltip placement="bottomLeft" title="Add Student">
            <CircleIconButton
              type="primary"
              shape="circle"
              icon="plus"
              size="large"
              onClick={() => toggleModal("add")}
            />
          </Tooltip>
          <CircleIconButton
            type="primary"
            shape="circle"
            icon="printer"
            size="large"
            disabled={!studentLoaded}
            onClick={printPreview}
          />
          <Dropdown overlay={actionMenu} trigger={["click"]}>
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
  selectedClass: PropTypes.object.isRequired,
  orgData: PropTypes.object.isRequired,
  submitted: PropTypes.bool.isRequired,
  studentLoaded: PropTypes.bool.isRequired,
  added: PropTypes.any.isRequired,
  selectedStudent: PropTypes.array.isRequired,
  changeTTS: PropTypes.func.isRequired
};

ActionContainer.defaultProps = {};

export default connect(
  state => ({
    orgData: getUserOrgData(state),
    selectedClass: get(state, "manageClass.entity"),
    submitted: get(state, "manageClass.submitted"),
    added: get(state, "manageClass.added"),
    studentLoaded: get(state, "manageClass.loaded"),
    selectedStudent: get(state, "manageClass.selectedStudent", [])
  }),
  {
    addStudentRequest: addStudentRequestAction,
    updateStudentRequest: updateStudentRequestAction,
    changeTTS: changeTTSRequestAction
  }
)(ActionContainer);
