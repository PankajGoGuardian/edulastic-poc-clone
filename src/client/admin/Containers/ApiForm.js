import React, { useState } from "react";
import { Select } from "antd";
import { notification } from "@edulastic/common";
import { adminApi } from "@edulastic/api";

import { apiForms } from "../Data/apiForm";
import ApiFormsMain from "../Components/ApiForm";

import { submit } from "../Components/ApiForm/apis";
import CreateAdmin from "../Components/CreateAdmin";

const CREATE_ADMIN = "create-admin";

const ApiForm = () => {
  const [id, setId] = useState();
  const [districtData, setDistrictData] = useState(null);

  const handleOnChange = _id => setId(_id);

  const handleOnSave = data => {
    const option = apiForms.find(ar => ar.id === id);
    if (option.id === CREATE_ADMIN) {
      adminApi.searchUpdateDistrict({ id: data.districtId }).then(res => {
        if (res?.data?.length) {
          setDistrictData(res.data[0]);
        } else {
          notification({ msg: res?.result?.message || "District not found" });
        }
      });
    } else {
      submit(data, option.endPoint, option.method).then(res => {
        if (res?.result) {
          if (res.result.success || res.status === 200) {
            notification({ type: "success", msg: res?.result?.message, message: "apiFormSucc" });
          } else {
            notification({ msg: res?.result?.message, message: "apiFormErr" });
          }
        }
      });
    }
  };

  const clearDistrictData = () => setDistrictData(null);

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
        {apiForms.map(each => (
          <Select.Option key={each.id} value={each.id}>
            {each.name}
          </Select.Option>
        ))}
      </Select>
      {id && (
        <ApiFormsMain fields={option.fields} name={option.name} handleOnSave={handleOnSave} note={option.note}>
          {districtData && id === CREATE_ADMIN && (
            <CreateAdmin districtData={districtData} clearDistrictData={clearDistrictData} />
          )}
        </ApiFormsMain>
      )}
    </div>
  );
};

export default ApiForm;
