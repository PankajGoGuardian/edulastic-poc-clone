import React from "react";
import PropTypes from "prop-types";
// import get from "lodash/get";
import { Select, Modal, message } from "antd";
import { FlexContainer } from "@edulastic/common";
import { getFormattedAttrId } from "@edulastic/common/src/helpers";

import Question from "../../../components/Question/index";
import Input from "./Input";
import { Subtitle } from "../../../styled/Subtitle";
import { Label } from "../../../styled/WidgetOptions/Label";
import { Row } from "../../../styled/WidgetOptions/Row";
import { Col } from "../../../styled/WidgetOptions/Col";
import { SelectInputStyled, TextInputStyled } from "../../../styled/InputStyles";

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

      <Row gutter={24}>
        <Col span={12}>
          <Label>Fraction Model</Label>
          <SelectInputStyled
            value={fractionType}
            placeholder="Fraction Type"
            onChange={handleFractionTypeChange}
            getPopupContainer={triggerNode => triggerNode.parentNode}
          >
            <Option value="circles">Circles</Option>
            <Option value="rectangles">Rectangles</Option>
          </SelectInputStyled>
        </Col>
      </Row>
      {fractionType === "circles" ? (
        <Row gutter={24}>
          <Col span={12}>
            <Label>Count</Label>
            <Input
              type="number"
              value={fractionProperties.count}
              placeholder="Fraction count"
              onBlur={value => handleDimensionChange("count", +value)}
            />
          </Col>
          <Col span={12}>
            <Label>Sectors</Label>
            <Input
              type="number"
              size="default"
              value={fractionProperties.sectors || 7}
              placeholder="Sectors"
              onBlur={value => handleDimensionChange("sectors", +value)}
              min={2}
            />
          </Col>
        </Row>
      ) : (
        <Row gutter={24}>
          <Col span={8}>
            <Label>Count</Label>
            <Input
              type="number"
              value={fractionProperties.count}
              placeholder="Fraction count"
              onBlur={value => handleDimensionChange("count", +value)}
            />
          </Col>
          <Col span={8}>
            <Label>Rows</Label>
            <Input
              type="number"
              size="default"
              value={fractionProperties.rows}
              placeholder="Rows"
              onBlur={value => handleDimensionChange("rows", +value)}
              min={1}
            />
          </Col>
          <Col span={8}>
            <Label>Columns</Label>
            <Input
              type="number"
              size="default"
              value={fractionProperties.columns}
              placeholder="Columns"
              onBlur={value => handleDimensionChange("columns", +value)}
              min={1}
            />
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
