import { EduButton,notification } from "@edulastic/common";
import { assignmentPolicyOptions } from "@edulastic/constants";
import { DatePicker, message, Row, Select } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { addStudentsAction, fetchClassStudentsAction } from "../../src/actions/classBoard";
import { ConfirmationModal } from "../../src/components/common/ConfirmationModal";
import { classStudentsSelector } from "../ducks";
import { getUserName } from "../utils";
import { BodyContainer } from "./styled";

const AddStudentsPopup = ({
  groupId,
  assignmentId,
  closePopup,
  open,
  closePolicy,
  disabledList,
  fetchGroupMembers,
  studentsList,
  addStudents
}) => {
  const [selectedStudents, setSelectedStudent] = useState([]);
  const [endDate, setEndDate] = useState(moment().add(1, "day"));
  useEffect(() => {
    fetchGroupMembers({ classId: groupId });
  }, []);

  const disabledEndDate = endDate => {
    if (!endDate) {
      return false;
    }
    return endDate < moment().startOf("day");
  };

  const submitAction = () => {
    if (!selectedStudents.length) notification({ type: "warn", messageKey:"selectAtleastOneStudent"});
    if (endDate < moment()) {
      return notification({ messageKey: "SelectFutureEndDate" });
    }
    if (closePolicy === assignmentPolicyOptions.POLICY_AUTO_ON_DUEDATE) {
      addStudents(assignmentId, groupId, selectedStudents, endDate.valueOf());
    } else {
      addStudents(assignmentId, groupId, selectedStudents);
    }
    closePopup();
  };

  return (
    <ConfirmationModal
      centered
      textAlign="left"
      title="Add Students"
      visible={open}
      onCancel={closePopup}
      footer={[
        <EduButton isGhost key="cancel" onClick={closePopup}>
          CANCEL
        </EduButton>,
        <EduButton data-cy="addButton" key="submit" onClick={submitAction}>
          ADD
        </EduButton>
      ]}
    >
      <BodyContainer>
        <h4> Students </h4>
        <Row>
          <Select
            data-cy="selectStudents"
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) => option.props.data.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            mode="multiple"
            style={{ width: "100%" }}
            onChange={value => setSelectedStudent(value)}
            placeholder="Select the students"
            getPopupContainer={triggerNode => triggerNode.parentNode}
          >
            {studentsList.map(
              x =>
                x.enrollmentStatus !== "0" &&
                x.status !== 0 && (
                  <Select.Option
                    key={x._id}
                    value={x._id}
                    disabled={disabledList.includes(x._id)}
                    data={`${x.firstName}${x.lastName}${x.email}${x.username}`}
                  >
                    {getUserName(x)}
                  </Select.Option>
                )
            )}
          </Select>
        </Row>
        <h4>Close Date</h4>
        <Row>
          <DatePicker
            allowClear={false}
            disabledDate={disabledEndDate}
            disabled={closePolicy !== assignmentPolicyOptions.POLICY_AUTO_ON_DUEDATE}
            style={{ width: "100%", cursor: "pointer" }}
            value={endDate}
            showTime
            showToday={false}
            onChange={v => {
              if (!v) {
                setEndDate(moment().add(1, "day"));
              } else {
                setEndDate(v);
              }
            }}
          />
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
