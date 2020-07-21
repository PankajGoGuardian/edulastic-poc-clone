import { SelectInputStyled } from "@edulastic/common";
import { Select } from "antd";
import { get } from "lodash";
import React from "react";
import { connect } from "react-redux";
import { setSettingsSaSchoolAction } from "../../../../student/Login/ducks";
import { getSaSchoolsSortedSelector } from "../../selectors/user";

function SaSchoolSelect({ schools, selected, setSchool, role, onChange = () => { } }) {
  return role === "school-admin" ? (
    <SelectInputStyled
      value={selected}
      onChange={v => {
        setSchool(v);
        onChange(v);
      }}
      width="200px"
      height="36px"
      style={{ marginLeft: "auto" }}
    >
      {schools.map(s => (
        <Select.Option value={s._id}>{s.name}</Select.Option>
      ))}
    </SelectInputStyled>
  ) : null;
}

export default connect(
  state => ({
    schools: getSaSchoolsSortedSelector(state),
    role: get(state, "user.user.role"),
    selected: get(state, "user.saSettingsSchool")
  }),
  {
    setSchool: setSettingsSaSchoolAction
  }
)(SaSchoolSelect);
