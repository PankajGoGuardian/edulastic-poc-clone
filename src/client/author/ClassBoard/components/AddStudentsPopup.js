import {
  EduButton,
  FieldLabel,
  notification,
  CustomModalStyled,
  DatePickerStyled,
  SelectInputStyled
} from "@edulastic/common";
import { assignmentPolicyOptions } from "@edulastic/constants";
import { Row, Select } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { addStudentsAction, fetchClassStudentsAction } from "../../src/actions/classBoard";
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
    if (!selectedStudents.length) notification({ type: "warn", messageKey: "selectAtleastOneStudent" });
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
    <CustomModalStyled
      centered
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
        <Row>
          <FieldLabel> Students </FieldLabel>
          <SelectInputStyled
            data-cy="selectStudents"
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) => option.props.data.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            mode="multiple"
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
          </SelectInputStyled>
        </Row>
        <Row>
          <FieldLabel>Close Date</FieldLabel>
          <DatePickerStyled
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
    </CustomModalStyled>
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
