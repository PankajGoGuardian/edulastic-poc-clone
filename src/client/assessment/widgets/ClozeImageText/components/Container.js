import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Select, Input } from "antd";
import { TextField } from "@edulastic/common";
import styled from "styled-components";
import { differenceBy, findIndex } from "lodash";

import { response } from "@edulastic/constants";
import { Row } from "../../../styled/WidgetOptions/Row";
import { Col } from "../../../styled/WidgetOptions/Col";
import { Label } from "../../../styled/WidgetOptions/Label";
import { OptionSelect } from "../styled/OptionSelect";
import { AddNewChoiceBtn } from "../../../styled/AddNewChoiceBtn";

const Container = ({ t, onChange, uiStyle, responses, changeStyle }) => {
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

  const { responsecontainerindividuals = [] } = uiStyle;

  const addNewResponseContainer = () => {
    const diff = differenceBy(responses, responsecontainerindividuals, "id");
    const _response = diff[0];
    if (_response) {
      const index = findIndex(responses, res => res.id === _response.id);
      responsecontainerindividuals[index] = {
        index,
        widthpx: 0,
        heightpx: 0,
        placeholder: "",
        id: _response.id
      };
      onChange("ui_style", {
        ...uiStyle,
        responsecontainerindividuals
      });
    }
  };

  const changeIndividualUiStyle = (prop, value, index) => {
    const item = responsecontainerindividuals[index];
    item[prop] = value;
    responsecontainerindividuals[index] = item;
    onChange("ui_style", {
      ...uiStyle,
      responsecontainerindividuals
    });
  };

  const removeIndividual = index => {
    responsecontainerindividuals[index] = {};
    onChange("ui_style", {
      ...uiStyle,
      responsecontainerindividuals
    });
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
      {responsecontainerindividuals &&
        responsecontainerindividuals.map(responsecontainerindividual => {
          if (!responsecontainerindividual.id) {
            return null;
          }
          const resIndex = responsecontainerindividual.index;
          return (
            <IndividualContainer key={resIndex}>
              <Row gutter={20}>
                <Col md={12}>
                  <Label>{`${t("component.options.responsecontainerindividual")} ${resIndex + 1}`}</Label>
                </Col>
                <Col md={12}>
                  <Delete onClick={() => removeIndividual(resIndex)}>X</Delete>
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
                    onChange={e => changeIndividualUiStyle("widthpx", +e.target.value, resIndex)}
                    value={responsecontainerindividual.widthpx}
                  />
                </Col>
                <Col md={8}>
                  <Label>{t("component.options.heightpx")}</Label>
                  <Input
                    type="number"
                    size="large"
                    disabled={false}
                    containerStyle={{ width: 350 }}
                    onChange={e => changeIndividualUiStyle("heightpx", +e.target.value, resIndex)}
                    value={responsecontainerindividual.heightpx}
                  />
                </Col>
                <Col md={8}>
                  <Label>{t("component.options.placeholder")}</Label>
                  <Input
                    size="large"
                    disabled={false}
                    containerStyle={{ width: 350 }}
                    onChange={e => changeIndividualUiStyle("placeholder", e.target.value, resIndex)}
                    value={responsecontainerindividual.placeholder}
                  />
                </Col>
              </Row>
            </IndividualContainer>
          );
        })}
      <Row gutter={20}>
        <Col md={6}>
          <Label>{t("component.options.responsecontainerindividuals")}</Label>
          <AddNewChoiceBtn onClick={addNewResponseContainer}>
            {t("component.options.addnewresponsecontainer")}
          </AddNewChoiceBtn>
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
