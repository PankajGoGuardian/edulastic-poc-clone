import React, { Component } from "react";
import PropTypes from "prop-types";

import { Select, TextField } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";
import styled from "styled-components";

import { AddNewChoiceBtn } from "../../styled/AddNewChoiceBtn";
import { Block } from "../../styled/WidgetOptions/Block";
import { Row } from "../../styled/WidgetOptions/Row";
import { Col } from "../../styled/WidgetOptions/Col";
import { Label } from "../../styled/WidgetOptions/Label";

import { Container } from "./components/Options/styled/Container";
import { Delete } from "./components/Options/styled/Delete";

import { Widget } from "../../styled/Widget";
import { Subtitle } from "../../styled/Subtitle";

class Layout extends Component {
  render() {
    const { onChange, uiStyle, t } = this.props;
    const changeUiStyle = (prop, value) => {
      onChange("ui_style", {
        ...uiStyle,
        [prop]: value
      });
    };

    const changeIndividualUiStyle = (prop, value, index) => {
      const { responsecontainerindividuals } = uiStyle;
      const item = {};
      Object.defineProperties(item, {
        widthpx: {
          value: responsecontainerindividuals[index].widthpx,
          writable: true
        },
        heightpx: {
          value: responsecontainerindividuals[index].heightpx,
          writable: true
        },
        placeholder: {
          value: responsecontainerindividuals[index].placeholder,
          writable: true
        }
      });
      item[prop] = value;
      responsecontainerindividuals[index] = item;
      onChange("ui_style", {
        ...uiStyle,
        responsecontainerindividuals
      });
    };

    const addIndividual = () => {
      const { responsecontainerindividuals } = uiStyle;
      responsecontainerindividuals.push({
        widthpx: 0,
        heightpx: 0,
        placeholder: ""
      });
      onChange("ui_style", {
        ...uiStyle,
        responsecontainerindividuals
      });
    };

    const removeIndividual = index => {
      const { responsecontainerindividuals } = uiStyle;
      responsecontainerindividuals.splice(index, 1);
      onChange("ui_style", {
        ...uiStyle,
        responsecontainerindividuals
      });
    };

    const textFieldStyles = {
      maxWidth: 280
    };

    return (
      <Widget>
        <Block style={{ paddingTop: 0 }}>
          <Subtitle>{t("component.options.display")}</Subtitle>
          <Row gutter={20}>
            <Col md={8}>
              <Label>{t("component.options.stemNumerationReviewOnly")}</Label>
              <SelectWrapper>
                <Select
                  onChange={val => changeUiStyle("stemnumeration", val)}
                  options={[
                    { value: "numerical", label: t("component.options.numerical") },
                    {
                      value: "uppercase",
                      label: t("component.options.uppercasealphabet")
                    },
                    {
                      value: "lowercase",
                      label: t("component.options.lowercasealphabet")
                    }
                  ]}
                  value={uiStyle.stemnumeration}
                />
              </SelectWrapper>
            </Col>
            <Col md={8}>
              <Label>{t("component.options.fontSize")}</Label>
              <SelectWrapper>
                <Select
                  onChange={fontsize => changeUiStyle("fontsize", fontsize)}
                  options={[
                    { value: "small", label: t("component.options.small") },
                    { value: "normal", label: t("component.options.normal") },
                    { value: "large", label: t("component.options.large") },
                    { value: "xlarge", label: t("component.options.extraLarge") },
                    { value: "xxlarge", label: t("component.options.huge") }
                  ]}
                  value={uiStyle.fontsize}
                />
              </SelectWrapper>
            </Col>
          </Row>
          <Row marginTop={13}>
            <Col md={24}>
              <Label>{t("component.options.responsecontainerglobal")}</Label>
            </Col>
          </Row>
          <Row gutter={20}>
            <Col md={8}>
              <Label>{t("component.options.widthpx")}</Label>
              <TextField
                type="number"
                disabled={false}
                containerStyle={{ width: 350 }}
                style={textFieldStyles}
                onChange={e => changeUiStyle("widthpx", +e.target.value)}
                value={uiStyle.widthpx}
              />
            </Col>
            <Col md={8}>
              <Label>{t("component.options.heightpx")}</Label>
              <TextField
                type="number"
                disabled={false}
                containerStyle={{ width: 350 }}
                style={textFieldStyles}
                onChange={e => changeUiStyle("heightpx", +e.target.value)}
                value={uiStyle.heightpx}
              />
            </Col>
            <Col md={8}>
              <Label>{t("component.options.placeholder")}</Label>
              <TextField
                disabled={false}
                containerStyle={{ width: 350 }}
                style={textFieldStyles}
                onChange={e => changeUiStyle("placeholder", e.target.value)}
                value={uiStyle.placeholder}
              />
            </Col>
          </Row>
          <Row marginTop={13}>
            <Col md={24}>
              <Label>{t("component.options.responsecontainerindividuals")}</Label>
            </Col>
          </Row>
          {uiStyle.responsecontainerindividuals.map((responsecontainerindividual, index) => (
            <Container key={index}>
              <Row>
                <Col md={18}>
                  <Label>{`${t("component.options.responsecontainerindividual")} ${index + 1}`}</Label>
                </Col>
                <Col md={6}>
                  <Delete onClick={() => removeIndividual(index)}>X</Delete>{" "}
                </Col>
              </Row>
              <Row gutter={20}>
                <Col md={8}>
                  <Label>{t("component.options.widthpx")}</Label>
                  <TextField
                    type="number"
                    disabled={false}
                    containerStyle={{ width: 350 }}
                    style={textFieldStyles}
                    onChange={e => changeIndividualUiStyle("widthpx", +e.target.value, index)}
                    value={responsecontainerindividual.widthpx}
                  />
                </Col>
                <Col md={8}>
                  <Label>{t("component.options.heightpx")}</Label>
                  <TextField
                    type="number"
                    disabled={false}
                    containerStyle={{ width: 350 }}
                    style={textFieldStyles}
                    onChange={e => changeIndividualUiStyle("heightpx", +e.target.value, index)}
                    value={responsecontainerindividual.heightpx}
                  />
                </Col>
                <Col md={8}>
                  <Label>{t("component.options.placeholder")}</Label>
                  <TextField
                    disabled={false}
                    containerStyle={{ width: 350 }}
                    style={textFieldStyles}
                    onChange={e => changeIndividualUiStyle("placeholder", e.target.value, index)}
                    value={uiStyle.placeholder}
                  />
                </Col>
              </Row>
            </Container>
          ))}
          <Row>
            <Col md={24}>
              <AddNewChoiceBtn onClick={() => addIndividual()}>{t("component.options.add")}</AddNewChoiceBtn>
            </Col>
          </Row>
        </Block>
      </Widget>
    );
  }
}

Layout.propTypes = {
  onChange: PropTypes.func.isRequired,
  uiStyle: PropTypes.object,
  t: PropTypes.func.isRequired
};

Layout.defaultProps = {
  uiStyle: {
    responsecontainerposition: "bottom",
    fontsize: "normal",
    stemnumeration: "",
    widthpx: 0,
    heightpx: 0,
    placeholder: "",
    responsecontainerindividuals: []
  }
};

export default React.memo(withNamespaces("assessment")(Layout));

const SelectWrapper = styled.div`
  & > div {
    min-width: 100%;
  }
`;
