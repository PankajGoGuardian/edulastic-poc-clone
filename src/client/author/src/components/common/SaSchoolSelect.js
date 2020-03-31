import React from "react";
import { connect } from "react-redux";
import { Row, Col, Select } from "antd";
import { get } from "lodash";
import { setSettingsSaSchoolAction } from "../../../../student/Login/ducks";
import { getSaSchoolsSortedSelector } from "../../selectors/user";

function SaSchoolSelect({ schools, selected, setSchool, role }) {
  return role === "school-admin" ? (
    <Row>
      <Col span={4} push={19}>
        <Select value={selected} onChange={v => setSchool(v)}>
          {schools.map(s => (
            <Select.Option value={s._id}>{s.name}</Select.Option>
          ))}
        </Select>
      </Col>
    </Row>
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
