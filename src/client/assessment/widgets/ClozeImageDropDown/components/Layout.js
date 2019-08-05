import React, { Component } from "react";
import { Select, Row, Col, Input } from "antd";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { differenceBy, findIndex } from "lodash";

import { withNamespaces } from "@edulastic/localization";
import { response } from "@edulastic/constants";
import styled from "styled-components";
import { setQuestionDataAction, getQuestionDataSelector } from "../../../../author/QuestionEditor/ducks";

import { AddNewChoiceBtn } from "../../../styled/AddNewChoiceBtn";
import { Label } from "../../../styled/WidgetOptions/Label";

import { OptionSelect } from "../styled/OptionSelect";
import { OptionCheckbox } from "../styled/OptionCheckbox";

import Container from "./styled/Container";
import Delete from "./styled/Delete";

import { Block } from "../../../styled/WidgetOptions/Block";
import { Subtitle } from "../../../styled/Subtitle";
import Question from "../../../components/Question";

class Layout extends Component {
  handleWidthChange = () => {
    const { onChange, uiStyle, responses } = this.props;
    const { minWidth, maxWidth } = response;
    const width = parseInt(uiStyle.widthpx, 10);
    let updatedResponses;
    if (width < minWidth) {
      updatedResponses = responses.map(_response => ({
        ..._response,
        width: minWidth
      }));
    }

    if (width > maxWidth) {
      updatedResponses = responses.map(_response => ({
        ..._response,
        width: maxWidth
      }));
    }

    updatedResponses = responses.map(_response => ({
      ..._response,
      width
    }));
    onChange("responses", updatedResponses);
  };

  handleHeightChange = () => {
    const { onChange, uiStyle, responses } = this.props;
    const { minHeight, maxHeight } = response;
    const height = parseInt(uiStyle.heightpx, 10);
    let updatedResponses;

    if (height < minHeight) {
      updatedResponses = responses.map(_response => ({
        ..._response,
        height: minHeight
      }));
    }

    if (height > maxHeight) {
      updatedResponses = responses.map(_response => ({
        ..._response,
        height: maxHeight
      }));
    }

    updatedResponses = responses.map(_response => ({
      ..._response,
      height
    }));
    onChange("responses", updatedResponses);
  };

  render() {
    const { questionData, onChange, uiStyle, advancedAreOpen, t, fillSections, cleanSections, responses } = this.props;

    const changeUiStyle = (prop, value) => {
      const { maxHeight, maxWidth } = response;

      let newValue = value;
      if (prop === "widthpx") {
        if (+value > maxWidth) {
          newValue = maxWidth;
        }
      }
      if (prop === "heightpx") {
        if (+value > maxHeight) {
          newValue = maxHeight;
        }
      }
      onChange("uiStyle", {
        ...uiStyle,
        [prop]: newValue
      });
    };

    const changeIndividualUiStyle = (prop, value, index) => {
      const { responsecontainerindividuals } = uiStyle;
      const item = responsecontainerindividuals[index];
      item[prop] = value;
      responsecontainerindividuals[index] = item;
      onChange("uiStyle", {
        ...uiStyle,
        responsecontainerindividuals
      });
    };

    const removeIndividual = index => {
      const { responsecontainerindividuals } = uiStyle;
      responsecontainerindividuals.splice(index, 1);
      onChange("uiStyle", {
        ...uiStyle,
        responsecontainerindividuals
      });
    };

    const addNewResponseContainer = () => {
      const { responsecontainerindividuals } = uiStyle;
      responsecontainerindividuals.push({
        widthpx: 0,
        heightpx: 0,
        placeholder: ""
      });
      onChange("uiStyle", {
        ...uiStyle,
        responsecontainerindividuals
      });
    };

    const stemnumerationOptions = [
      { value: "numerical", label: t("component.options.numerical") },
      { value: "uppercase", label: t("component.options.uppercasealphabet") },
      { value: "lowercase", label: t("component.options.lowercasealphabet") }
    ];

    const fontsizeOptions = [
      { value: "small", label: t("component.options.small") },
      { value: "normal", label: t("component.options.normal") },
      { value: "large", label: t("component.options.large") },
      { value: "xlarge", label: t("component.options.extraLarge") },
      { value: "xxlarge", label: t("component.options.huge") }
    ];

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
      <React.Fragment>
        <Question
          section="advanced"
          label={t("component.options.display")}
          advancedAreOpen={advancedAreOpen}
          fillSections={fillSections}
          cleanSections={cleanSections}
        >
          <Block style={{ paddingTop: 0 }}>
            <Subtitle>{t("component.options.display")}</Subtitle>
            <MarginRow gutter={20}>
              <Col md={12}>
                <OptionCheckbox
                  checked={questionData.imagescale}
                  onChange={e => onChange("imagescale", e.target.checked)}
                  size="large"
                >
                  {t("component.options.imagescale")}
                </OptionCheckbox>
              </Col>
              <Col md={12}>
                <OptionCheckbox
                  checked={questionData.verticaltop}
                  onChange={e => onChange("verticaltop", e.target.checked)}
                  size="large"
                >
                  {t("component.options.verticaltop")}
                </OptionCheckbox>
              </Col>
            </MarginRow>
            <MarginRow gutter={20}>
              <Col md={12}>
                <Label>{t("component.options.stemNumerationReviewOnly")}</Label>
                <SelectWrapper>
                  <OptionSelect
                    size="large"
                    onChange={val => changeUiStyle("stemnumeration", val)}
                    value={uiStyle.stemnumeration}
                  >
                    {stemnumerationOptions.map(({ value: val, label }) => (
                      <Select.Option key={val} value={val}>
                        {label}
                      </Select.Option>
                    ))}
                  </OptionSelect>
                </SelectWrapper>
              </Col>
              <Col md={12}>
                <Label>{t("component.options.fontSize")}</Label>
                <SelectWrapper>
                  <OptionSelect
                    size="large"
                    onChange={fontsize => changeUiStyle("fontsize", fontsize)}
                    value={uiStyle.fontsize}
                  >
                    {fontsizeOptions.map(({ value: val, label }) => (
                      <Select.Option key={val} value={val}>
                        {label}
                      </Select.Option>
                    ))}
                  </OptionSelect>
                </SelectWrapper>
              </Col>
            </MarginRow>
            <MarginRow gutter={20}>
              <Col md={12}>
                <Label>{t("component.options.inputtype")}</Label>
                <SelectWrapper>
                  <OptionSelect
                    size="large"
                    onChange={inputtype => changeUiStyle("inputtype", inputtype)}
                    value={uiStyle.inputtype}
                  >
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
                <Input
                  disabled={false}
                  size="large"
                  onChange={e => changeUiStyle("placeholder", e.target.value)}
                  value={uiStyle.placeholder}
                />
              </Col>
            </MarginRow>
            <MarginRow gutter={20}>
              <Col md={12}>
                <Label>{t("component.options.widthpx")}</Label>
                <Input
                  type="number"
                  size="large"
                  disabled={false}
                  onBlur={this.handleWidthChange}
                  onChange={e => changeUiStyle("widthpx", e.target.value)}
                  value={uiStyle.widthpx}
                  max={response.maxWidth}
                  min={response.minWidth}
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
                  max={response.maxHeight}
                  min={response.minHeight}
                />
              </Col>
            </MarginRow>
            <MarginRow gutter={20}>
              <Col md={12}>
                <Label>{t("component.options.pointers")}</Label>
                <SelectWrapper>
                  <OptionSelect
                    size="large"
                    onChange={inputtype => changeUiStyle("pointers", inputtype)}
                    value={uiStyle.pointers}
                  >
                    {pointerOptions.map(({ value: val, label }) => (
                      <Select.Option key={val} value={val}>
                        {label}
                      </Select.Option>
                    ))}
                  </OptionSelect>
                </SelectWrapper>
              </Col>
            </MarginRow>
            {uiStyle.responsecontainerindividuals &&
              uiStyle.responsecontainerindividuals.map(responsecontainerindividual => {
                if (!responsecontainerindividual.id) {
                  return null;
                }
                const resIndex = responsecontainerindividual.index;
                return (
                  <Container key={resIndex}>
                    <MarginRow gutter={20}>
                      <Col md={12}>
                        <Label>{`${t("component.options.responsecontainerindividual")} ${resIndex + 1}`}</Label>
                      </Col>
                      <Col md={12}>
                        <Delete onClick={() => removeIndividual(resIndex)}>X</Delete>
                      </Col>
                    </MarginRow>
                    <MarginRow gutter={20}>
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
                    </MarginRow>
                  </Container>
                );
              })}
            <MarginRow gutter={20}>
              <Col md={6}>
                <Label>{t("component.options.responsecontainerindividuals")}</Label>
                <AddNewChoiceBtn onClick={addNewResponseContainer}>
                  {t("component.options.addnewresponsecontainer")}
                </AddNewChoiceBtn>
              </Col>
            </MarginRow>
          </Block>
        </Question>
      </React.Fragment>
    );
  }
}

Layout.propTypes = {
  questionData: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  uiStyle: PropTypes.object,
  t: PropTypes.func.isRequired,
  advancedAreOpen: PropTypes.bool,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
  responses: PropTypes.array
};

Layout.defaultProps = {
  uiStyle: {
    responsecontainerposition: "bottom",
    fontsize: "normal",
    stemnumeration: "",
    widthpx: 0,
    heightpx: 0,
    wordwrap: false,
    responsecontainerindividuals: []
  },
  advancedAreOpen: false,
  responses: [],
  fillSections: () => {},
  cleanSections: () => {}
};

const enhance = compose(
  withNamespaces("assessment"),
  connect(
    state => ({
      questionData: getQuestionDataSelector(state)
    }),
    {
      setQuestionData: setQuestionDataAction
    }
  )
);

export default enhance(Layout);

const MarginRow = styled(Row)`
  margin-bottom: 30px;
`;

const SelectWrapper = styled.div`
  & > div {
    min-width: 100%;
  }
`;
