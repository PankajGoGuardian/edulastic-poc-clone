import React from "react";
import PropTypes from "prop-types";
// import get from "lodash/get";
import { Row, Col, Select, Modal, message } from "antd";
import { FlexContainer } from "@edulastic/common";
import { getFormattedAttrId } from "@edulastic/common/src/helpers";

import Question from "../../../components/Question/index";
import Input from "./Input";
import { Subtitle } from "../../../styled/Subtitle";
import Label from "../styled/Label";

const Options = ({ fillSections, cleanSections, t, produce, setQuestionData, item }) => {
  const { confirm } = Modal;
  const { Option } = Select;
  const { fractionProperties = {} } = item;
  const { fractionType } = fractionProperties;
  const handleFractionTypeChange = _fractionType => {
    if (_fractionType !== fractionType) {
      confirm({
        title: "Changing the illustration will reset the selections. Do you wish to continue?",
        onOk() {
          setQuestionData(
            produce(item, draft => {
              const obj = {};
              if (draft.fractionProperties.fractionType === "circles") {
                delete draft.fractionProperties.sectors;
                obj.rows = 2;
                obj.columns = 2;
              } else {
                delete draft.fractionProperties.rows;
                delete draft.fractionProperties.columns;
                obj.sectors = 7;
              }
              draft.fractionProperties = {
                ...draft.fractionProperties,
                ...obj,
                fractionType: _fractionType,
                selected: [1],
                count: 1
              };
            })
          );
        }
      });
    }
  };

  const handleDimensionChange = (prop, value) => {
    const regex = new RegExp("^[1-9]+([0-9]*)$", "g");
    if (!regex.test(value)) {
      message.error("Values can only be natural numbers greater than 0");
      return null;
    }
    setQuestionData(
      produce(item, draft => {
        draft.fractionProperties = {
          ...draft.fractionProperties,
          [prop]: +value > 1 ? +value : 1,
          selected: [1]
        };
      })
    );
  };

  return (
    <Question
      section="main"
      label={t("common.options.mainTitle")}
      fillSections={fillSections}
      cleanSections={cleanSections}
    >
      <Subtitle id={getFormattedAttrId(`${item?.title}-${t("common.options.mainTitle")}`)}>
        {t("common.options.mainTitle")}
      </Subtitle>

      <FlexContainer justifyContent="flex-start">
        <Col span={14}>
          <FlexContainer marginBottom="1em" justifyContent="flex-start">
            <Label>Fraction Model: </Label>
            <Select
              value={fractionType}
              placeholder="Fraction Type"
              onChange={handleFractionTypeChange}
              getPopupContainer={triggerNode => triggerNode.parentNode}
            >
              <Option value="circles">Circles</Option>
              <Option value="rectangles">Rectangles</Option>
            </Select>
          </FlexContainer>
        </Col>
      </FlexContainer>
      {fractionType === "circles" ? (
        <Row gutter={16}>
          <Col span={5}>
            <FlexContainer marginBottom="1em" justifyContent="flex-start">
              <Label>Count: </Label>
              <Input
                value={fractionProperties.count}
                placeholder="Fraction count"
                onBlur={value => handleDimensionChange("count", +value)}
              />
            </FlexContainer>
          </Col>
          <Col span={5}>
            <FlexContainer>
              <Label>Sectors: </Label>
              <Input
                size="default"
                value={fractionProperties.sectors || 7}
                placeholder="Sectors"
                onBlur={value => handleDimensionChange("sectors", +value)}
                min={2}
              />
            </FlexContainer>
          </Col>
        </Row>
      ) : (
        <Row gutter={16}>
          <Col span={5}>
            <FlexContainer marginBottom="1em" justifyContent="flex-start">
              <Label>Count: </Label>
              <Input
                value={fractionProperties.count}
                placeholder="Fraction count"
                onBlur={value => handleDimensionChange("count", +value)}
              />
            </FlexContainer>
          </Col>
          <Col span={5}>
            <FlexContainer>
              <Label>Rows: </Label>
              <Input
                size="default"
                value={fractionProperties.rows}
                placeholder="Rows"
                onBlur={value => handleDimensionChange("rows", +value)}
                min={1}
              />
            </FlexContainer>
          </Col>
          <Col span={6}>
            <FlexContainer>
              <Label>Columns: </Label>
              <Input
                size="default"
                value={fractionProperties.columns}
                placeholder="Columns"
                onBlur={value => handleDimensionChange("columns", +value)}
                min={1}
              />
            </FlexContainer>
          </Col>
        </Row>
      )}
    </Question>
  );
};

Options.propTypes = {
  fillSections: PropTypes.func.isRequired,
  cleanSections: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  produce: PropTypes.func.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  item: PropTypes.object
};

Options.defaultProps = {
  item: {}
};

export default Options;
