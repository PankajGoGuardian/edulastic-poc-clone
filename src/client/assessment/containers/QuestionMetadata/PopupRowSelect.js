import React from "react";
import { Row, Col, Select } from "antd";
import { connect } from "react-redux";

import { ItemBody } from "./styled/ItemBody";
import { getFormattedCurriculumsSelector } from "../../../author/src/selectors/dictionaries";
import selectsData from "../../../author/TestPage/components/common/selectsData";

const PopupRowSelect = ({
  formattedCuriculums,
  handleChangeStandard,
  handleChangeGrades,
  handleChangeSubject,
  subject,
  standard,
  grades,
  t
}) => {
  return (
    <Row gutter={24}>
      <Col md={8}>
        <ItemBody>
          <div className="select-label">{t("component.options.subject")}</div>
          <Select style={{ width: "100%" }} value={subject} onChange={handleChangeSubject}>
            {selectsData.allSubjects.map(({ text, value }) =>
              value ? (
                <Select.Option key={value} value={value}>
                  {text}
                </Select.Option>
              ) : (
                ""
              )
            )}
          </Select>
        </ItemBody>
      </Col>
      <Col md={8}>
        <ItemBody>
          <div className="select-label">{t("component.options.standardSet")}</div>
          <Select
            style={{ width: "100%" }}
            showSearch
            filterOption
            value={standard.curriculum}
            onChange={handleChangeStandard}
          >
            {formattedCuriculums.map(({ value, text, disabled }) => (
              <Select.Option key={value} value={text} disabled={disabled}>
                {text}
              </Select.Option>
            ))}
          </Select>
        </ItemBody>
      </Col>
      <Col md={8}>
        <ItemBody>
          <div className="select-label">{t("component.options.grade")}</div>
          <Select mode="multiple" showSearch style={{ width: "100%" }} value={grades} onChange={handleChangeGrades}>
            {selectsData.allGrades.map(({ text, value }) => (
              <Select.Option key={text} value={value}>
                {text}
              </Select.Option>
            ))}
          </Select>
        </ItemBody>
      </Col>
    </Row>
  );
};

export default connect(
  (state, props) => ({
    formattedCuriculums: getFormattedCurriculumsSelector(state, props)
  }),
  null
)(PopupRowSelect);
