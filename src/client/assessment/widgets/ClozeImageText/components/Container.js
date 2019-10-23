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

const Container = ({ t, onChange, uiStyle, responses = [], changeStyle }) => {
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

  const changeIndividualUiStyle = (prop, value, id) => {
    changeStyle(
      "responses",
      responses.map(resp => {
        if (resp.id === id) {
          resp[prop] = value;
        }
      })
    );
  };

  const removeIndividual = resId => {
    const newResponses = responses.filter(resp => resp.id !== resId);
    changeStyle("responses", newResponses);
  };

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
          <TextField
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
      {responses.map((response, resIndex) => {
        if (!response.id) {
          return null;
        }
        const resId = response.id;
        return (
          <IndividualContainer key={resId}>
            <Row gutter={20}>
              <Col md={12}>
                <Label>{`${t("component.options.responsecontainerindividual")} ${resIndex + 1}`}</Label>
              </Col>
              <Col md={12}>
                <Delete onClick={() => removeIndividual(resId)}>X</Delete>
              </Col>
            </Row>
            <Row gutter={20}>
              <Col md={8}>
                <Label>{t("component.options.widthpx")}</Label>
                <Input
                  type="number"
                  size="large"
                  disabled={false}
                  containerStyle={{ width: 350 }}
                  onChange={e => changeIndividualUiStyle("width", +e.target.value, resId)}
                  value={parseInt(response.width)}
                />
              </Col>
              <Col md={8}>
                <Label>{t("component.options.heightpx")}</Label>
                <Input
                  type="number"
                  size="large"
                  disabled={false}
                  containerStyle={{ width: 350 }}
                  onChange={e => changeIndividualUiStyle("height", +e.target.value, resId)}
                  value={parseInt(response.height, 10)}
                />
              </Col>
              <Col md={8}>
                <Label>{t("component.options.placeholder")}</Label>
                <Input
                  size="large"
                  disabled={false}
                  containerStyle={{ width: 350 }}
                  onChange={e => changeIndividualUiStyle("placeholder", e.target.value, resId)}
                  value={response.placeholder}
                />
              </Col>
            </Row>
          </IndividualContainer>
        );
      })}
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
