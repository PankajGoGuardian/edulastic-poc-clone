import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { differenceBy, findIndex } from "lodash";

import { Select } from "@edulastic/common";
import { response } from "@edulastic/constants";
import { Input } from "antd";

import { withNamespaces } from "@edulastic/localization";
import { Block } from "../../styled/WidgetOptions/Block";
import { Row } from "../../styled/WidgetOptions/Row";
import { Col } from "../../styled/WidgetOptions/Col";
import { Label } from "../../styled/WidgetOptions/Label";
import { Subtitle } from "../../styled/Subtitle";
import Question from "../../components/Question";
import { AddNewChoiceBtn } from "../../styled/AddNewChoiceBtn";

class Layout extends Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    uiStyle: PropTypes.object,
    fillSections: PropTypes.func,
    cleanSections: PropTypes.func,
    advancedAreOpen: PropTypes.bool,
    responses: PropTypes.array
  };

  static defaultProps = {
    uiStyle: {
      responsecontainerposition: "bottom",
      fontsize: "normal",
      stemnumeration: "",
      widthpx: 0,
      heightpx: 0,
      wordwrap: false,
      responsecontainerindividuals: []
    },
    responses: [],
    advancedAreOpen: false,
    fillSections: () => {},
    cleanSections: () => {}
  };

  handleWidthChange = () => {
    const { onChange, uiStyle, responses } = this.props;
    const { minWidth, maxWidth } = response;
    let width = uiStyle.widthpx;

    if (width < minWidth) {
      width = minWidth;
    } else if (width > maxWidth) {
      width = maxWidth;
    }
    const updatedResponses = responses.map(_response => ({
      ..._response,
      width: `${width}px`
    }));
    onChange("responses", updatedResponses);
  };

  handleHeightChange = () => {
    const { onChange, uiStyle, responses } = this.props;
    const { minHeight, maxHeight } = response;
    let height = uiStyle.heightpx;

    if (height < minHeight) {
      height = minHeight;
    } else if (height > maxHeight) {
      height = maxHeight;
    }

    const updatedResponses = responses.map(_response => ({
      ..._response,
      height: `${height}px`
    }));
    onChange("responses", updatedResponses);
  };

  render() {
    const { onChange, uiStyle, advancedAreOpen, t, fillSections, cleanSections, responses } = this.props;
    const { responsecontainerindividuals = [] } = uiStyle;
    const changeUiStyle = (prop, value) => {
      onChange("ui_style", {
        ...uiStyle,
        [prop]: value
      });
    };

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
      <Question
        section="advanced"
        label={t("component.options.display")}
        advancedAreOpen={advancedAreOpen}
        fillSections={fillSections}
        cleanSections={cleanSections}
      >
        <Block style={{ paddingTop: 0 }}>
          <Subtitle>{t("component.options.display")}</Subtitle>
          <Row gutter={20}>
            <Col md={8}>
              <Label>{t("component.options.responsecontainerposition")}</Label>
              <SelectWrapper>
                <Select
                  onChange={val => changeUiStyle("responsecontainerposition", val)}
                  options={[
                    { value: "top", label: t("component.options.top") },
                    { value: "bottom", label: t("component.options.bottom") },
                    { value: "right", label: t("component.options.right") },
                    { value: "left", label: t("component.options.left") }
                  ]}
                  value={uiStyle.responsecontainerposition}
                />
              </SelectWrapper>
            </Col>
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
          <Row gutter={20}>
            <Col md={12}>
              <Label>{t("component.options.widthpx")}</Label>
              <Input
                type="number"
                size="large"
                disabled={false}
                onBlur={this.handleWidthChange}
                onChange={e => changeUiStyle("widthpx", e.target.value)}
                value={uiStyle.widthpx}
                min={response.minWidth}
                max={response.maxWidth}
              />
            </Col>
            <Col md={12}>
              <Label>{t("component.options.heightpx")}</Label>
              <Input
                type="number"
                size="large"
                disabled={false}
                onBlur={this.handleHeightChange}
                onChange={e => changeUiStyle("heightpx", e.target.value)}
                value={uiStyle.heightpx}
                min={response.minHeight}
                max={response.maxHeight}
              />
            </Col>
          </Row>
        </Block>
        <Block>
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
        </Block>
      </Question>
    );
  }
}

export default React.memo(withNamespaces("assessment")(Layout));

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
