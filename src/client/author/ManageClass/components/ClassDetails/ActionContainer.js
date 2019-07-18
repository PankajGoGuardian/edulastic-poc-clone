import React, { useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { get, unset, split, isEmpty, pick, pickBy, identity } from "lodash";
import PropTypes from "prop-types";
import { Menu, Dropdown, Tooltip, message, Icon, Modal, Table, Spin } from "antd";
import * as moment from "moment";
import AddStudentModal from "./AddStudent/AddStudentModal";
import InviteMultipleStudentModal from "../../../Student/components/StudentTable/InviteMultipleStudentModal/InviteMultipleStudentModal";
import ResetPwd from "./ResetPwd/ResetPwd";
import DeleteConfirm from "./DeleteConfirm/DeleteConfirm";
import AddCoTeacher from "./AddCoTeacher/AddCoTeacher";

import { addStudentRequestAction, updateStudentRequestAction, changeTTSRequestAction } from "../../ducks";
import { enrollmentApi } from "@edulastic/api";
import { getUserOrgData, getUserOrgId, getUserRole } from "../../../src/selectors/user";
import { getUserFeatures } from "../../../../student/Login/ducks";
import AddMultipleStudentsInfoModal from "./AddmultipleStduentsInfoModel";

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
import FeaturesSwitch from "../../../../features/components/FeaturesSwitch";
import { FaTruckMonster } from "react-icons/fa";

const modalStatus = {};

const ActionContainer = ({
  updateStudentRequest,
  addStudentRequest,
  selectedClass,
  userOrgId,
  orgData,
  studentsList,
  submitted,
  added,
  printPreview,
  studentLoaded,
  selectedStudent,
  changeTTS,
  loadStudents,
  features
}) => {
  const [isOpen, setModalStatus] = useState(modalStatus);
  const [sentReq, setReqStatus] = useState(false);
  const [isEdit, setEditStudentStatues] = useState(false);

  const [isAddMultipleStudentsModal, setIsAddMultipleStudentsModal] = useState(false);

  const [infoModelVisible, setinfoModelVisible] = useState(false);
  const [infoModalData, setInfoModalData] = useState([]);

  const { _id: classId, active } = selectedClass;
  let formRef = null;

  const toggleModal = key => {
    setModalStatus({ [key]: !isOpen[key] });
    setEditStudentStatues(false);
  };

  if (added && sentReq) {
    setReqStatus(false);
    setModalStatus(false);
  }

  const handleAddMultipleStudent = () => {
    setIsAddMultipleStudentsModal(true);
  };
  const closeInviteStudentModal = () => {
    setIsAddMultipleStudentsModal(false);
  };
  const sendInviteStudent = async inviteStudentList => {
    setIsAddMultipleStudentsModal(false);
    const result = await enrollmentApi.addEnrolMultiStudents({ classId: selectedClass._id, data: inviteStudentList });
    setInfoModalData(result.data.result);
    setinfoModelVisible(true);
    loadStudents({ classId });
  };

  const addStudent = () => {
    if (formRef) {
      const { form } = formRef.props;
      form.validateFields((err, values) => {
        if (!err) {
          if (isEdit) {
            if (values.dob) {
              values.dob = moment(values.dob).format("x");
            }
            const std = { ...selectedStudent[0], ...values };
            const userId = std._id || std.userId;
            std.currentSignUpState = "DONE";
            std.username = values.email;
            const stdData = pick(std, [
              "districtId",
              "dob",
              "ellStatus",
              "email",
              "firstName",
              "gender",
              "institutionIds",
              "lastName",
              "race",
              "sisId",
              "studentNumber",
              "frlStatus",
              "iepStatus",
              "sedStatus",
              "username",
              "contactEmails"
            ]);
            const contactEmails = get(stdData, "contactEmails");
            if (contactEmails) {
              stdData.contactEmails = [contactEmails];
            }
            updateStudentRequest({
              userId,
              data: stdData
            });
            setModalStatus(false);
          } else {
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

            unset(values, ["confirmPassword"]);
            unset(values, ["fullName"]);

            addStudentRequest(pickBy(values, identity));
            setReqStatus(true);
          }
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
          const isEnabled = selectedStudent.find(std => std.tts === "yes");
          if (isEnabled) {
            return showMessage("error", "Atleast one of the selected student(s) is already enabled");
          }
          const stdIds = selectedStudent.map(std => std._id).join(",");
          changeTTS({ userId: stdIds, ttsStatus: "yes" });
        }
        break;
      case "disableSpeech":
        if (isEmpty(selectedStudent)) {
          return showMessage("error", "Select 1 or more students to disable text to speech");
        }
        const isDisabled = selectedStudent.find(std => std.tts === "no");
        if (isDisabled) {
          return showMessage("error", "Atleast one of the selected student(s) is already disabled");
        }
        if (changeTTS) {
          const stdIds = selectedStudent.map(std => std._id).join(",");
          changeTTS({ userId: stdIds, ttsStatus: "no" });
        }
        break;
      case "deleteStudent":
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
      case "editStudent":
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
      <FeaturesSwitch inputFeatures="textToSpeech" actionOnInaccessible="hidden" key="enableSpeech" groupId={classId}>
        <MenuItem key="enableSpeech">
          <Icon type="caret-right" />
          Enable Text To Speech
        </MenuItem>
      </FeaturesSwitch>
      <FeaturesSwitch inputFeatures="textToSpeech" actionOnInaccessible="hidden" key="disableSpeech" groupId={classId}>
        <MenuItem key="disableSpeech">
          <Icon type="sound" />
          Disable Text To Speech
        </MenuItem>
      </FeaturesSwitch>
      <MenuItem key="deleteStudent">
        <Icon type="delete" />
        Remove Selected Student(s)
      </MenuItem>
      <MenuItem key="resetPwd">
        <Icon type="key" />
        Reset Password
      </MenuItem>
      <MenuItem key="editStudent">
        <Icon type="edit" />
        Edit Student
      </MenuItem>
      <FeaturesSwitch inputFeatures="addCoTeacher" actionOnInaccessible="hidden" key="addCoTeacher" groupId={classId}>
        <MenuItem key="addCoTeacher">
          <Icon type="switcher" />
          Add a Co-Teacher
        </MenuItem>
      </FeaturesSwitch>
    </Menu>
  );

  return (
    <>
      {infoModelVisible && (
        <AddMultipleStudentsInfoModal
          infoModelVisible={infoModelVisible}
          setinfoModelVisible={setinfoModelVisible}
          infoModalData={infoModalData}
          setInfoModalData={setInfoModalData}
        />
      )}

      {isOpen.add && (
        <AddStudentModal
          handleAdd={addStudent}
          handleCancel={() => toggleModal("add")}
          isOpen={isOpen.add}
          submitted={submitted}
          wrappedComponentRef={saveFormRef}
          stds={selectedStudent}
          isEdit={isEdit}
          loadStudents={loadStudents}
        />
      )}

      <ResetPwd
        isOpen={isOpen.resetPwd}
        handleCancel={() => toggleModal("resetPwd")}
        selectedStudent={selectedStudent}
      />

      <DeleteConfirm isOpen={isOpen.delete} handleCancel={() => toggleModal("delete")} />

      <AddCoTeacher
        isOpen={isOpen.addCoTeacher}
        selectedClass={selectedClass}
        handleCancel={() => toggleModal("addCoTeacher")}
      />

      <AddStudentDivider>
        <TitleWarapper>Student</TitleWarapper>
        <DividerDiv />
        <ButtonsWrapper>
          {active ? (
            <Tooltip placement="bottomLeft" title="Add Student">
              <CircleIconButton
                type="primary"
                shape="circle"
                icon="plus"
                size="large"
                onClick={() => toggleModal("add")}
              />
            </Tooltip>
          ) : null}
          <Link to={"/author/manageClass/printPreview"}>
            <CircleIconButton type="primary" shape="circle" icon="printer" size="large" disabled={!studentLoaded} />
          </Link>
          {studentsList.length > 0 && active ? (
            <Dropdown overlay={actionMenu} trigger={["click"]}>
              <ActionButton type="primary" ghost>
                Actions <StyledIcon type="caret-down" theme="filled" size={16} />
              </ActionButton>
            </Dropdown>
          ) : null}

          {active ? (
            <AddStudentButton onClick={handleAddMultipleStudent}>Add Multiple Students</AddStudentButton>
          ) : null}
          {isAddMultipleStudentsModal && (
            <InviteMultipleStudentModal
              modalVisible={isAddMultipleStudentsModal}
              inviteStudents={sendInviteStudent}
              closeModal={closeInviteStudentModal}
              userOrgId={userOrgId}
              setinfoModelVisible={setinfoModelVisible}
              setInfoModalData={setInfoModalData}
              orgData={orgData}
              studentsList={studentsList}
              selectedClass={selectedClass}
              setIsAddMultipleStudentsModal={setIsAddMultipleStudentsModal}
              loadStudents={loadStudents}
              features={features}
            />
          )}
        </ButtonsWrapper>
      </AddStudentDivider>
    </>
  );
};

ActionContainer.propTypes = {
  addStudentRequest: PropTypes.func.isRequired,
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
    userOrgId: getUserOrgId(state),
    orgData: getUserOrgData(state),
    selectedClass: get(state, "manageClass.entity"),
    submitted: get(state, "manageClass.submitted"),
    added: get(state, "manageClass.added"),
    studentLoaded: get(state, "manageClass.loaded"),
    selectedStudent: get(state, "manageClass.selectedStudent", []),
    studentsList: get(state, "manageClass.studentsList", []),
    features: getUserFeatures(state)
  }),
  {
    addStudentRequest: addStudentRequestAction,
    updateStudentRequest: updateStudentRequestAction,
    changeTTS: changeTTSRequestAction
  }
)(ActionContainer);
