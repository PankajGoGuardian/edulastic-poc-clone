import React from "react";
import get from "lodash/get";
import { Input, Row, Col, Select, Modal, Checkbox } from "antd";
import { FlexContainer } from "@edulastic/common";

import Question from "../../../components/Question/index";
import { Subtitle } from "../../../styled/Subtitle";
import Label from "../styled/Label";

const Options = ({ fillSections, cleanSections, t, produce, setQuestionData, item }) => {
  const { confirm } = Modal;
  const { Option } = Select;
  const { fractionProperties = {} } = item;
  const fractionType = fractionProperties.fractionType;
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

  const handleOptionsChange = (prop, value) => {
    setQuestionData(
      produce(item, draft => {
        draft.options = {
          ...draft.options,
          [prop]: value
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
      <Subtitle>{t("common.options.mainTitle")}</Subtitle>

      <FlexContainer justifyContent="flex-start">
        <Col span={14}>
          <FlexContainer marginBottom="1em" justifyContent="flex-start">
            <Label>Fraction Model: </Label>
            <Select value={fractionType} placeholder="Fraction Type" onChange={handleFractionTypeChange}>
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
                type="number"
                placeholder="Fraction Type"
                onChange={e => handleDimensionChange("count", +e.target.value)}
              />
            </FlexContainer>
          </Col>
          <Col span={5}>
            <FlexContainer>
              <Label>Sectors: </Label>
              <Input
                size="default"
                type="number"
                value={fractionProperties.sectors || 7}
                placeholder="Sectors"
                onChange={e => handleDimensionChange("sectors", +e.target.value)}
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
                type="number"
                value={fractionProperties.count}
                placeholder="Fraction Type"
                onChange={e => handleDimensionChange("count", +e.target.value)}
              />
            </FlexContainer>
          </Col>
          <Col span={5}>
            <FlexContainer>
              <Label>Rows: </Label>
              <Input
                size="default"
                type="number"
                value={fractionProperties.rows}
                placeholder="Rows"
                onChange={e => handleDimensionChange("rows", +e.target.value)}
                min={1}
              />
            </FlexContainer>
          </Col>
          <Col span={6}>
            <FlexContainer>
              <Label>Columns: </Label>
              <Input
                size="default"
                type="number"
                value={fractionProperties.columns}
                placeholder="Columns"
                onChange={e => handleDimensionChange("columns", +e.target.value)}
                min={1}
              />
            </FlexContainer>
          </Col>
        </Row>
      )}
      <Row gutter={20} style={{ margin: "10px 0px" }}>
        <Checkbox
          checked={get(item, "options.hideAnnotations", false)}
          onChange={e => handleOptionsChange("hideAnnotations", e.target.checked)}
        >
          {t("common.options.hideAnnotations")}
        </Checkbox>
      </Row>
    </Question>
  );
};

export default Options;
