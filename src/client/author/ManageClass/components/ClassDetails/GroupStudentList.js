import React, { useState } from "react";
import { connect } from "react-redux";
import * as moment from "moment";
import { IconPencilEdit, IconRemove } from "@edulastic/icons";
import { Dropdown } from "antd";
import AddStudentModal from "./AddStudent/AddStudentModal";
import DeleteConfirm from "./DeleteConfirm/DeleteConfirm";
import { TableWrapper, StudentsTable, MenuItems, DropMenu, StyledButton } from "./styled";
import { get, pick, pickBy, identity } from "lodash";
import { selectStudentAction, updateStudentRequestAction } from "../../ducks";

const GroupStudentsList = ({ students, selectedStudent, setSelectedStudents, updateStudentRequest }) => {
  const [isOpen, setModalStatus] = useState(false);
  let formRef = null;

  const toggleModal = key => {
    setModalStatus({ [key]: !isOpen[key] });
  };

  const handleActionMenuClick = ({ key }, user) => {
    setSelectedStudents([user]);
    switch (key) {
      case "deleteStudent":
        toggleModal("delete");
        break;
      case "editStudent":
        toggleModal("add");
        break;
      default:
        break;
    }
  };

  const editStudent = () => {
    if (formRef) {
      const { form } = formRef.props;
      form.validateFields((err, values) => {
        if (!err) {
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
            "password",
            "contactEmails"
          ]);
          const contactEmailsString = get(stdData, "contactEmails", "");
          const contactEmails =
            contactEmailsString && typeof contactEmailsString === "string"
              ? contactEmailsString.split(",").map(x => x.trim())
              : contactEmailsString;
          if (contactEmails?.[0]) {
            stdData.contactEmails = contactEmails;
          } else {
            stdData.contactEmails = [];
          }
          updateStudentRequest({
            userId,
            data: pickBy(stdData, identity)
          });
          toggleModal("add");
        }
      });
    }
    setSelectedStudents([]);
  };

  const saveFormRef = node => {
    formRef = node;
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      defaultSortOrder: "descend",
      sorter: (a, b) => a.firstName > b.firstName,
      render: (_, { firstName, lastName }) => (
        <span>{`${firstName === "Anonymous" || firstName === "" ? "-" : firstName} ${lastName || ""}`}</span>
      )
    },
    {
      title: "Username",
      dataIndex: "username",
      defaultSortOrder: "descend",
      sorter: (a, b) => a.username > b.username,
      render: username => <span>{username}</span>
    },
    {
      title: "Actions",
      align: "center",
      render: user => (
        <Dropdown
          overlay={
            <DropMenu onClick={event => handleActionMenuClick(event, user)}>
              <MenuItems key="editStudent">
                <IconPencilEdit />
                <span>Edit Student</span>
              </MenuItems>
              <MenuItems key="deleteStudent">
                <IconRemove />
                <span>Remove Student</span>
              </MenuItems>
            </DropMenu>
          }
          placement="bottomCenter"
        >
          <StyledButton>ACTIONS</StyledButton>
        </Dropdown>
      )
    }
  ];

  const rowKey = recode => recode.email || recode.username;
  const filteredStudents = students.filter(s => s.enrollmentStatus && !(s.enrollmentStatus == 0));

  return (
    <TableWrapper>
      <DeleteConfirm isOpen={isOpen.delete} handleCancel={() => toggleModal("delete")} />
      <AddStudentModal
        handleAdd={editStudent}
        handleCancel={() => toggleModal("add")}
        isOpen={isOpen.add}
        wrappedComponentRef={saveFormRef}
        stds={selectedStudent}
        isEdit={true}
      />
      <StudentsTable columns={columns} dataSource={filteredStudents} rowKey={rowKey} pagination={false} />
    </TableWrapper>
  );
};

export default connect(
  state => ({
    students: get(state, "manageClass.studentsList", []),
    selectedStudent: get(state, "manageClass.selectedStudent", [])
  }),
  { setSelectedStudents: selectStudentAction, updateStudentRequest: updateStudentRequestAction }
)(GroupStudentsList);
