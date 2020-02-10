import React, { useState } from "react";
import { Select, message } from "antd";
import { apiForms } from "../Data/apiForm";
import ApiFormsMain from "../Components/ApiForm";

import { submit } from "../Components/ApiForm/apis";

const ApiForm = props => {
  const [id, setId] = useState();
  const handleOnChange = _id => setId(_id);
  const onClose = () => setId();
  const handleOnSave = data => {
    const option = apiForms.find(ar => ar.id === id);
    submit(data, option.endPoint, option.method).then(res => {
      if (res?.result) {
        if (res.result.success || res.status === 200) {
          message.success(res?.result?.message || "Success");
          onClose();
        } else {
          message.error(res?.result?.message || "Failed");
        }
      }
    });
  };

  const option = apiForms.find(ar => ar.id === id);

  return (
    <div>
      <Select
        placeholder="Select"
        size="large"
        style={{
          width: "500px"
        }}
        onChange={handleOnChange}
        value={id}
      >
        {apiForms.map(option => {
          return (
            <Select.Option key={option.id} value={option.id}>
              {option.name}
            </Select.Option>
          );
        })}
      </Select>
      {id && <ApiFormsMain fields={option.fields} name={option.name} handleOnSave={handleOnSave} />}
    </div>
  );
};

export default ApiForm;
