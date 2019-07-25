import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Button, Row, Select, message } from "antd";
import { getUserName } from "../utils";
import { ConfirmationModal } from "../../src/components/common/ConfirmationModal";
import { BodyContainer } from "./styled";

import { fetchClassStudentsAction, addStudentsAction } from "../../src/actions/classBoard";
import { classStudentsSelector } from "../ducks";

const AddStudentsPopup = ({
  groupId,
  assignmentId,
  closePopup,
  open,
  disabledList,
  fetchGroupMembers,
  studentsList,
  addStudents
}) => {
  const [selectedStudents, setSelectedStudent] = useState([]);

  useEffect(() => {
    fetchGroupMembers({ classId: groupId });
  }, []);

  const submitAction = () => {
    if (!selectedStudents.length) message.warn("Select atleast one student to submit or press cancel");
    addStudents(assignmentId, groupId, selectedStudents, true);
    closePopup();
  };

  return (
    <ConfirmationModal
      centered
      textAlign={"left"}
      title={"Add Students"}
      visible={open}
      onCancel={closePopup}
      footer={[
        <Button ghost key="cancel" onClick={closePopup}>
          CANCEL
        </Button>,
        <Button key="submit" onClick={submitAction}>
          SUBMIT
        </Button>
      ]}
    >
      <BodyContainer>
        <h4> Students </h4>
        <Row>
          <Select
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) => option.props.data.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            mode="multiple"
            style={{ width: "100%" }}
            onChange={value => setSelectedStudent(value)}
            placeholder="Select the students"
          >
            {studentsList.map(x => (
              <Select.Option
                key={x._id}
                value={x._id}
                disabled={disabledList.includes(x._id)}
                data={`${x.firstName}${x.lastName}${x.email}${x.username}`}
              >
                {getUserName(x)}
              </Select.Option>
            ))}
          </Select>
        </Row>
      </BodyContainer>
    </ConfirmationModal>
  );
};

export default connect(
  state => ({
    studentsList: classStudentsSelector(state)
  }),
  {
    fetchGroupMembers: fetchClassStudentsAction,
    addStudents: addStudentsAction
  }
)(AddStudentsPopup);
