import React from "react";
import { Form, Input, DatePicker } from "antd";
import styled from "styled-components";
import moment from "moment";
import { HeadingSpan } from "../StyledComponents/upgradePlan";

const { TextArea } = Input;
const CharacterLimitSpan = styled.span`
  font-size: 12px;
  font-style: italic;
  position: absolute;
  bottom: 100%;
  right: 0;
`;

const OuterDiv = styled.div`
  position: relative;
  width: 70%;
  margin-top: 20px;
`;

const DatesFormItem = ({ getFieldDecorator, initialStartDate, initialEndDate }) => {
  const disabledDate = val => val < moment().startOf("day");
  const formLayout = { labelCol: { span: 4 }, labelAlign: "left" };
  return (
    <>
      <Form.Item label={<HeadingSpan>Start Date</HeadingSpan>} {...formLayout}>
        {getFieldDecorator("subStartDate", {
          rules: [{ required: true }],
          initialValue: initialStartDate
        })(<DatePicker disabledDate={disabledDate} />)}
      </Form.Item>
      <Form.Item label={<HeadingSpan>End Date</HeadingSpan>} {...formLayout}>
        {getFieldDecorator("subEndDate", {
          rules: [{ required: true }],
          initialValue: initialEndDate
        })(<DatePicker disabledDate={disabledDate} />)}
      </Form.Item>
    </>
  );
};

DatesFormItem.defaultProps = {
  initialStartDate: moment(),
  initialEndDate: moment().add(1, "year")
};

const NotesFormItem = ({ getFieldDecorator, notesFieldName, initialValue, placeholder }) => {
  const max = 200;
  return (
    <OuterDiv>
      <CharacterLimitSpan>{`${max} chars`}</CharacterLimitSpan>
      <Form.Item>
        {getFieldDecorator(notesFieldName, {
          rules: [{ required: true, max }],
          initialValue
        })(<TextArea rows={2} placeholder={placeholder} />)}
      </Form.Item>
    </OuterDiv>
  );
};

NotesFormItem.defaultProps = {
  notesFieldName: "notes",
  initialValue: "",
  placeholder: "Add Notes*"
};

const DatesNotesFormItem = ({
  getFieldDecorator,
  initialStartDate,
  initialEndDate,
  notesFieldName,
  initialValue,
  placeholder
}) => (
  <>
    <DatesFormItem
      getFieldDecorator={getFieldDecorator}
      initialStartDate={initialStartDate}
      initialEndDate={initialEndDate}
    />
    <NotesFormItem
      getFieldDecorator={getFieldDecorator}
      notesFieldName={notesFieldName}
      initialValue={initialValue}
      placeholder={placeholder}
    />
  </>
);

DatesNotesFormItem.defaultProps = {
  ...NotesFormItem.defaultProps,
  ...DatesFormItem.defaultProps
};

export { DatesFormItem, NotesFormItem };

export default DatesNotesFormItem;
