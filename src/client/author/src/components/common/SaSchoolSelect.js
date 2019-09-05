import React from "react";
import { connect } from "react-redux";
import { setSettingsSaSchoolAction } from "../../../../student/Login/ducks";
import { Row, Col, Select } from "antd";
import { get } from "lodash";

function SaSchoolSelect({ schools, selected, setSchool }) {
  return (
    <Row>
      <Col span={4} push={19}>
        <Select value={selected} onChange={v => setSchool(v)}>
          {schools.map(s => (
            <Select.Option value={s._id}>{s.name}</Select.Option>
          ))}
        </Select>
      </Col>
    </Row>
  );
}

export default connect(
  state => ({
    schools: get(state, "user.user.orgData.schools", []),
    selected: get(state, "user.saSettingsSchool")
  }),
  {
    setSchool: setSettingsSaSchoolAction
  }
)(SaSchoolSelect);
