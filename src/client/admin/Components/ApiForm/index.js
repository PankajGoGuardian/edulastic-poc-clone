import React, { useState } from "react";
import { Modal, Form, Alert } from "antd";
import Field from "./Field";

const ApiFormsMain = ({ fields, name, handleOnSave, onClose }) => {
  const [data, setData] = useState({});
  const [errors, setErrors] = useState([]);
  const onChange = (value, type) => {
    setData({ ...data, [type]: value });
  };

  const onSave = () => {
    const requiredFields = fields.filter(f => f.required);
    const errors = requiredFields.filter(rf => !data[rf.name]).map(f => f.displayName || f.name);
    if (errors.length) {
      return setErrors(errors);
    }
    onCloseError();
    handleOnSave(data);
  };
  const onCloseError = () => setErrors([]);

  return (
    <Modal
      visible
      title={name}
      maskClosable
      onOk={onSave}
      onCancel={onClose}
      maskClosable
      className="wrapClassName"
      width={800}
      okText="Submit"
      okButtonProps={{ htmlType: "submit" }}
    >
      <Form onSubmit={handleOnSave}>
        {!!errors.length && (
          <Alert message={`${errors.join(", ")} fields are required`} type="error" closable onClose={onCloseError} />
        )}
        {fields.map(field => (
          <Field {...field} onChange={onChange} />
        ))}
      </Form>
    </Modal>
  );
};

export default ApiFormsMain;
