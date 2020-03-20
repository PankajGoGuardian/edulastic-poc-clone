import { enrollmentApi } from "@edulastic/api";
import {
  IconCircle,
  IconNoVolume,
  IconPencilEdit,
  IconPlus,
  IconPlusCircle,
  IconPrint,
  IconRemove,
  IconVolumeUp
} from "@edulastic/icons";
import { Dropdown, message } from "antd";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { get, unset, split, isEmpty, pick, pickBy, identity } from "lodash";
import PropTypes from "prop-types";
import * as moment from "moment";
import AddStudentModal from "./AddStudent/AddStudentModal";
import { EduButton } from "@edulastic/common";
import InviteMultipleStudentModal from "../../../Student/components/StudentTable/InviteMultipleStudentModal/InviteMultipleStudentModal";
import {
  addStudentRequestAction,
  changeTTSRequestAction,
  selectStudentAction,
  updateStudentRequestAction
} from "../../ducks";
import { getUserOrgData, getUserOrgId } from "../../../src/selectors/user";
import { getUserFeatures } from "../../../../student/Login/ducks";
import AddMultipleStudentsInfoModal from "./AddmultipleStduentsInfoModel";
import DeleteConfirm from "./DeleteConfirm/DeleteConfirm";
import ResetPwd from "./ResetPwd/ResetPwd";
import {
  AddStudentDivider,
  ButtonIconWrap,
  ButtonsWrapper,
  CaretUp,
  CustomRedirectButton,
  DropMenu,
  MenuItems,
  RedirectButton
} from "./styled";
import { getSchoolPolicy, receiveSchoolPolicyAction } from "../../../DistrictPolicy/ducks";
import AddCoTeacher from "./AddCoTeacher/AddCoTeacher";

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
  selectedStudent,
  changeTTS,
  loadStudents,
  features,
  history,
  setSelectedStudents,
  cleverId,
  loadSchoolPolicy,
  policy
}) => {
  const [isOpen, setModalStatus] = useState(modalStatus);
  const [sentReq, setReqStatus] = useState(false);
  const [isEdit, setEditStudentStatues] = useState(false);

  const [isAddMultipleStudentsModal, setIsAddMultipleStudentsModal] = useState(false);

  const [infoModelVisible, setinfoModelVisible] = useState(false);
  const [infoModalData, setInfoModalData] = useState([]);

  const { addCoTeacher, textToSpeech } = features;

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
    const result = await enrollmentApi.addEnrolMultiStudents({
      classId: selectedClass._id,
      data: inviteStudentList
    });
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
            // contactEmails field is in csv of multiple emails
            const contactEmailsString = get(stdData, "contactEmails", "");
            const contactEmails =
              contactEmailsString && typeof contactEmailsString === "string"
                ? contactEmailsString.split(",").map(x => x.trim())
                : contactEmailsString;
            // no need to have length check, as it is already handled in form validator
            if (contactEmails?.[0]) {
              stdData.contactEmails = contactEmails;
            } else {
              stdData.contactEmails = [];
            }
            updateStudentRequest({
              userId,
              data: pickBy(stdData, identity)
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
              // contactEmails is comma seperated emails
              values.contactEmails = contactEmails.split(",").map(x => x.trim());
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
    setSelectedStudents([]);
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
      case "disableSpeech": {
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
      }
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

  useEffect(() => {
    // if school policy does not exists then action will populate district policy
    loadSchoolPolicy(selectedClass.institutionId);
  }, []);

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
        <ButtonsWrapper>
          {active && !cleverId ? (
            <EduButton height="30px" isGhost data-cy="addStudent" onClick={() => toggleModal("add")}>
              <IconPlusCircle />
              ADD STUDENT
            </EduButton>
          ) : null}
          <EduButton
            height="30px"
            isGhost
            data-cy="printRoster"
            onClick={() => history.push(`/author/manageClass/printPreview`)}
          >
            <IconPrint />
            PRINT
          </EduButton>

          <Dropdown
            overlay={
              <DropMenu onClick={handleActionMenuClick}>
                <CaretUp className="fa fa-caret-up" />
                {textToSpeech ? (
                  <MenuItems key="enableSpeech">
                    <IconVolumeUp width={12} />
                    <span>Enable Text to Speech</span>
                  </MenuItems>
                ) : null}
                {textToSpeech ? (
                  <MenuItems key="disableSpeech">
                    <IconNoVolume />
                    <span>Disable Text to Speech</span>
                  </MenuItems>
                ) : null}
                {!cleverId ? (
                  <MenuItems key="deleteStudent">
                    <IconRemove />
                    <span>Remove Students</span>
                  </MenuItems>
                ) : null}
                <MenuItems key="resetPwd">
                  <IconCircle />
                  <span>Reset Password</span>
                </MenuItems>
                {!cleverId ? (
                  <MenuItems key="editStudent">
                    <IconPencilEdit />
                    <span>Edit Stduent</span>
                  </MenuItems>
                ) : null}
                {addCoTeacher ? (
                  <MenuItems key="addCoTeacher">
                    <IconPlus />
                    <span>Add a Co-Teacher</span>
                  </MenuItems>
                ) : null}
              </DropMenu>
            }
            placement="bottomRight"
          >
            <EduButton height="30px" isGhost>
              ACTIONS
            </EduButton>
          </Dropdown>

          {active && !cleverId ? (
            <EduButton height="30px" data-cy="addMultiStu" onClick={handleAddMultipleStudent}>
              ADD MULTIPLE STUDENTS
            </EduButton>
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
              policy={policy}
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
    selectedStudent: get(state, "manageClass.selectedStudent", []),
    studentsList: get(state, "manageClass.studentsList", []),
    features: getUserFeatures(state),
    policy: getSchoolPolicy(state)
  }),
  {
    addStudentRequest: addStudentRequestAction,
    updateStudentRequest: updateStudentRequestAction,
    changeTTS: changeTTSRequestAction,
    setSelectedStudents: selectStudentAction,
    loadSchoolPolicy: receiveSchoolPolicyAction
  }
)(ActionContainer);
