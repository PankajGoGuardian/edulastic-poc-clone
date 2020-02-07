import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Select, Input } from "antd";
import { TextField } from "@edulastic/common";
import styled from "styled-components";

import { response } from "@edulastic/constants";
import { Row } from "../../../styled/WidgetOptions/Row";
import { Col } from "../../../styled/WidgetOptions/Col";
import { Label } from "../../../styled/WidgetOptions/Label";
import { OptionSelect } from "../styled/OptionSelect";
import { SelectInputStyled, TextInputStyled } from "../../../styled/InputStyles";

const Container = ({ t, onChange, uiStyle, responses = [], changeStyle }) => {
  const inputtypeOptions = [
    { value: "text", label: t("component.options.text") },
    { value: "number", label: t("component.options.number") }
  ];

  const changeIndividualUiStyle = (prop, value, id) => {
    changeStyle(
      "responses",
      responses.map(resp => {
        if (resp.id === id) {
          resp[prop] = value;
        }
        return resp;
      })
    );
  };

  return (
    <Fragment>
      <Row gutter={24}>
        <Col md={12}>
          <Label>{t("component.options.inputtype")}</Label>
          <SelectWrapper>
            <SelectInputStyled
              size="large"
              onChange={type => onChange("inputtype", type)}
              value={uiStyle.inputtype}
              getPopupContainer={triggerNode => triggerNode.parentNode}
            >
              {inputtypeOptions.map(({ value: val, label }) => (
                <Select.Option key={val} value={val}>
                  {label}
                </Select.Option>
              ))}
            </SelectInputStyled>
          </SelectWrapper>
        </Col>
        <Col md={12}>
          <Label>{t("component.options.placeholder")}</Label>
          <TextInputStyled
            disabled={false}
            onChange={e => onChange("placeholder", e.target.value)}
            value={uiStyle.placeholder}
          />
        </Col>
      </Row>
      <Row gutter={24}>
        <Col md={12}>
          <Label>{t("component.options.widthpx")}</Label>
          <TextInputStyled
            type="number"
            size="large"
            minimum={30}
            disabled={false}
            onBlur={() =>
              changeStyle(
                "responses",
                responses.map(_response => ({
                  ..._response,
                  width: parseInt(uiStyle.widthpx, 10)
                }))
              )
            }
            onChange={e =>
              onChange("widthpx", +e.target.value > response.maxWidth ? response.maxWidth : +e.target.value)
            }
            value={uiStyle.widthpx}
          />
        </Col>
        <Col md={12}>
          <Label>{t("component.options.heightpx")}</Label>
          <TextInputStyled
            type="number"
            size="large"
            minimum={30}
            disabled={false}
            onBlur={() =>
              changeStyle(
                "responses",
                responses.map(_response => ({
                  ..._response,
                  height: parseInt(uiStyle.heightpx, 10)
                }))
              )
            }
            onChange={e =>
              onChange("heightpx", +e.target.value > response.maxHeight ? response.maxHeight : +e.target.value)
            }
            value={uiStyle.heightpx}
          />
        </Col>
      </Row>
    </Fragment>
  );
};

Container.propTypes = {
  t: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  changeStyle: PropTypes.func.isRequired,
  uiStyle: PropTypes.object.isRequired,
  responses: PropTypes.array
};

Container.defaultProps = {
  responses: []
};

export default Container;

const SelectWrapper = styled.div`
  & > div {
    min-width: 100%;
  }
`;

const IndividualContainer = styled.div`
  position: relative;
`;

const Delete = styled.div`
  padding: 3px 10px;
  border-radius: 3px;
  background: lightgray;
  position: absolute;
  right: 10px;
  top: 0;
`;
