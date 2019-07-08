import React from "react";
import PropTypes from "prop-types";
import { Row, Col, Input, Select } from "antd";

import { Container } from "./styled/Container";
import { ItemBody } from "./styled/ItemBody";
import { selectsData } from "../../../author/TestPage/components/common";
import { SelectSuffixIcon } from "./styled/SelectSuffixIcon";

const SecondBlock = ({ t, onChangeTags, onQuestionDataSelect, depthOfKnowledge = "", authorDifficulty = "", tags }) => (
  <Container>
    <Row gutter={36}>
      <Col md={8}>
        <ItemBody>
          <div className="label">
            <b>{t("component.options.depthOfKnowledge")}</b>
          </div>
          <Select
            style={{ width: "100%" }}
            placeholder={t("component.options.selectDOK")}
            onSelect={onQuestionDataSelect("depthOfKnowledge")}
            value={depthOfKnowledge}
            suffixIcon={<SelectSuffixIcon type="caret-down" />}
          >
            <Select.Option key={"Select DOK"} value={""}>
              {"Select DOK"}
            </Select.Option>
            {selectsData.allDepthOfKnowledge.map(
              el =>
                el.value && (
                  <Select.Option key={el.value} value={el.value}>
                    {el.text}
                  </Select.Option>
                )
            )}
          </Select>
        </ItemBody>
      </Col>
      <Col md={8}>
        <ItemBody>
          <div className="label">
            <b>{t("component.options.difficultyLevel")}</b>
          </div>
          <Select
            style={{ width: "100%" }}
            placeholder={t("component.options.selectDifficulty")}
            onSelect={onQuestionDataSelect("authorDifficulty")}
            value={authorDifficulty}
            suffixIcon={<SelectSuffixIcon type="caret-down" />}
          >
            <Select.Option key={"Select Difficulty Level"} value={""}>
              {"Select Difficulty Level"}
            </Select.Option>
            {selectsData.allAuthorDifficulty.map(
              el =>
                el.value && (
                  <Select.Option key={el.value} value={el.value}>
                    {el.text}
                  </Select.Option>
                )
            )}
          </Select>
        </ItemBody>
      </Col>
      <Col md={8}>
        <ItemBody>
          <div className="label">
            <b>{t("component.options.tags")}</b>
          </div>
          <Input onChange={onChangeTags} value={tags.join()} />
        </ItemBody>
      </Col>
    </Row>
  </Container>
);

SecondBlock.propTypes = {
  t: PropTypes.func.isRequired,
  onChangeTags: PropTypes.func.isRequired,
  onQuestionDataSelect: PropTypes.func.isRequired,
  depthOfKnowledge: PropTypes.string.isRequired,
  authorDifficulty: PropTypes.string.isRequired,
  tags: PropTypes.array
};

SecondBlock.defaultProps = {
  tags: []
};

export default SecondBlock;
