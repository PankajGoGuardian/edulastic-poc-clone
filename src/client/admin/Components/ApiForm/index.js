import React, { useState } from "react";
import { Alert, Button, Form } from "antd";
import Field from "./Field";
import { FirstDiv, H2, OuterDiv } from "../../Common/StyledComponents";

const ApiFormsMain = ({ fields, name, handleOnSave }) => {
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
    <div>
      <OuterDiv>
        <H2>{name}</H2>
        <FirstDiv>
          <Form style={{ width: "100%" }}>
            {!!errors.length && (
              <Alert
                message={`${errors.join(", ")} fields are required`}
                type="error"
                closable
                onClose={onCloseError}
              />
            )}
            {fields.map(field => (
              <Field {...field} onChange={onChange} />
            ))}
            <Button type="primary" htmlType="submit" onClick={onSave}>
              Submit
            </Button>
          </Form>
        </FirstDiv>
      </OuterDiv>
    </div>
  );
};

export default ApiFormsMain;
