import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Select } from "antd";
import { TextField } from "@edulastic/common";
import styled from "styled-components";

import { Row } from "../../../styled/WidgetOptions/Row";
import { Col } from "../../../styled/WidgetOptions/Col";
import { Label } from "../../../styled/WidgetOptions/Label";
import { OptionSelect } from "../styled/OptionSelect";

const Container = ({ t, onChange, uiStyle }) => {
  const inputtypeOptions = [
    { value: "text", label: t("component.options.text") },
    { value: "number", label: t("component.options.number") }
  ];

  const pointerOptions = [
    { value: "right", label: t("component.options.right") },
    { value: "left", label: t("component.options.left") },
    { value: "top", label: t("component.options.top") },
    { value: "bottom", label: t("component.options.bottom") }
  ];

  return (
    <Fragment>
      <Row gutter={20}>
        <Col md={12}>
          <Label>{t("component.options.inputtype")}</Label>
          <SelectWrapper>
            <OptionSelect size="large" onChange={type => onChange("inputtype", type)} value={uiStyle.inputtype}>
              {inputtypeOptions.map(({ value: val, label }) => (
                <Select.Option key={val} value={val}>
                  {label}
                </Select.Option>
              ))}
            </OptionSelect>
          </SelectWrapper>
        </Col>
        <Col md={12}>
          <Label>{t("component.options.placeholder")}</Label>
          <TextField
            disabled={false}
            onChange={e => onChange("placeholder", e.target.value)}
            value={uiStyle.placeholder}
          />
        </Col>
      </Row>
      <Row gutter={20}>
        <Col md={12}>
          <Label>{t("component.options.widthpx")}</Label>
          <TextField
            type="number"
            size="large"
            disabled={false}
            onChange={e => onChange("width", +e.target.value > 400 ? 400 : +e.target.value)}
            value={uiStyle.width}
          />
        </Col>
        <Col md={12}>
          <Label>{t("component.options.heightpx")}</Label>
          <TextField
            type="number"
            size="large"
            disabled={false}
            onChange={e => onChange("height", +e.target.value)}
            value={uiStyle.height}
          />
        </Col>
      </Row>
      <Row gutter={20}>
        <Col md={12}>
          <Label>{t("component.options.pointers")}</Label>
          <SelectWrapper>
            <OptionSelect size="large" onChange={val => onChange("pointer", val)} value={uiStyle.pointer}>
              {pointerOptions.map(({ value: val, label }) => (
                <Select.Option key={val} value={val}>
                  {label}
                </Select.Option>
              ))}
            </OptionSelect>
          </SelectWrapper>
        </Col>
      </Row>
    </Fragment>
  );
};

Container.propTypes = {
  t: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  uiStyle: PropTypes.object.isRequired
};

export default Container;

const SelectWrapper = styled.div`
  & > div {
    min-width: 100%;
  }
`;
