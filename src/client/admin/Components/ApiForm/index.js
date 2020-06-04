import React, { useState, useMemo } from "react";
import { Alert, Button, Form } from "antd";
import Field from "./Field";
import { FirstDiv, H2, OuterDiv } from "../../Common/StyledComponents";

const ApiFormsMain = ({ fields, name, handleOnSave }) => {
  const [data, setData] = useState({});
  const [errors, setErrors] = useState([]);
  const onChange = (value, type) => {
    setData({ ...data, [type]: value });
  };

  const onCloseError = () => setErrors([]);

  const formatData = useMemo(
    () =>
      Object.keys(data).reduce((acc, key) => {
        const field = fields.find(f => f.name === key);
        if (data[key] && field.formatter) {
          acc[key] = field.formatter(data[key]);
        } else {
          acc[key] = data[key];
        }
        return { ...acc };
      }, {}),
    [data]
  );

  const onSave = () => {
    const requiredFields = fields.filter(f => f.required);
    const errorFields = requiredFields.filter(rf => !data[rf.name]).map(f => f.displayName || f.name);
    if (errorFields.length) {
      return setErrors(errorFields);
    }
    onCloseError();
    handleOnSave(formatData);
  };

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
