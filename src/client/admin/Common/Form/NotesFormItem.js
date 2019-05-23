import React from "react";
import { Form, Input } from "antd";
import styled from "styled-components";

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
`;

const NotesFormItem = ({ getFieldDecorator, fieldName, initialValue, placeholder }) => {
  const max = 200;
  return (
    <OuterDiv>
      <CharacterLimitSpan>{`${max} chars`}</CharacterLimitSpan>
      <Form.Item>
        {getFieldDecorator(fieldName, {
          rules: [{ required: true, max }],
          initialValue
        })(<TextArea rows={4} placeholder={placeholder} />)}
      </Form.Item>
    </OuterDiv>
  );
};

NotesFormItem.defaultProps = {
  fieldName: "notes",
  initialValue: "",
  placeholder: "Add Notes*"
};

export default NotesFormItem;
