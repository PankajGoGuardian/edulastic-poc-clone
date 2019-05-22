import React from "react";
import { Form, Input } from "antd";

const { TextArea } = Input;

const NotesFormItem = ({ getFieldDecorator, fieldName, initialValue, placeholder }) => (
  <Form.Item>
    {getFieldDecorator(fieldName, {
      rules: [{ required: true, max: 200 }],
      initialValue
    })(<TextArea rows={4} placeholder={placeholder} />)}
  </Form.Item>
);

NotesFormItem.defaultProps = {
  fieldName: "notes",
  initialValue: "",
  placeholder: "Add Notes*"
};

export default NotesFormItem;
