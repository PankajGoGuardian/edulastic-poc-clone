//@ts-check
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Button, Row, Select } from "antd";
import { ConfirmationModal } from "../../src/components/common/ConfirmationModal";
import { BodyContainer } from "./styled";

import { fetchClassStudentsAction } from "../../src/actions/classBoard";
import { classStudentsSelector } from "../ducks";

const AddStudentsPopup = ({ groupId, closePopup, open, disabledList, fetchGroupMembers, studentsList }) => {
  const [selectedStudents, setSelectedStudent] = useState([]);
  useEffect(() => {
    fetchGroupMembers({ classId: groupId });
  }, []);
  const submitAction = () => {};
  return (
    <ConfirmationModal
      centered
      textAlign={"left"}
      title={"Add Students"}
      visible={open}
      onCancel={() => closePopup()}
      footer={[
        <Button ghost key="cancel" onClick={() => closePopup()}>
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
            filterOption={(input, option) => option.props.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            mode="multiple"
            style={{ width: "100%" }}
            onChange={e => console.log(e)}
            placeholder="Select the students"
          >
            {studentsList.map(x => (
              <Select.Option
                key={x._id}
                value={x._id}
                disabled={disabledList.includes(x._id)}
                data={`${x.firstName},${x.firstName},${x.username}, ${x.email}`}
              >
                {x.username}
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
    fetchGroupMembers: fetchClassStudentsAction
  }
)(AddStudentsPopup);
