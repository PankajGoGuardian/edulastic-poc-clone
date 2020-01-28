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
          <Select
            data-cy="subject-Select"
            style={{ width: "100%" }}
            value={subject}
            onChange={handleChangeSubject}
            getPopupContainer={triggerNode => triggerNode.parentNode}
          >
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
            data-cy="standardSet-Select"
            style={{ width: "100%" }}
            showSearch
            filterOption
            value={standard.curriculum}
            onChange={handleChangeStandard}
            getPopupContainer={triggerNode => triggerNode.parentNode}
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
          <Select
            data-cy="grade-Select"
            mode="multiple"
            showSearch
            style={{ width: "100%" }}
            value={grades}
            onChange={handleChangeGrades}
            getPopupContainer={triggerNode => triggerNode.parentNode}
          >
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
