import React, { Component } from "react";
import { Select, Row, Col, Input } from "antd";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { differenceBy, findIndex } from "lodash";

import { withNamespaces } from "@edulastic/localization";
import { getFormattedAttrId } from "@edulastic/common/src/helpers";
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
    const {
      questionData,
      onChange,
      uiStyle,
      advancedAreOpen,
      t,
      fillSections,
      cleanSections,
      responses,
      item
    } = this.props;

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

    const changeIndividualUiStyle = (prop, value, id) => {
      onChange(
        "responses",
        responses.map(resp => {
          if (resp.id === id) {
            resp[prop] = value;
          }
          return resp;
        })
      );
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
            <Subtitle id={getFormattedAttrId(`${item?.title}-${t("component.options.display")}`)}>
              {t("component.options.display")}
            </Subtitle>
            <MarginRow gutter={20}>
              <Col md={12}>
                <Label>{t("component.options.stemNumerationReviewOnly")}</Label>
                <SelectWrapper>
                  <OptionSelect
                    size="large"
                    onChange={val => changeUiStyle("stemNumeration", val)}
                    value={uiStyle.stemNumeration || "normal"}
                    getPopupContainer={triggerNode => triggerNode.parentNode}
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
                    value={uiStyle.fontsize || "normal"}
                    getPopupContainer={triggerNode => triggerNode.parentNode}
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
                  value={uiStyle.heightpx || 35}
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
                    getPopupContainer={triggerNode => triggerNode.parentNode}
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
            {responses.map((response, resIndex) => {
              if (!response.id) {
                return null;
              }
              const resId = response.id;
              return (
                <Container key={resId}>
                  <MarginRow gutter={20}>
                    <Col md={12}>
                      <Label>{`${t("component.options.responsecontainerindividual")} ${resIndex + 1}`}</Label>
                    </Col>
                  </MarginRow>
                  <MarginRow gutter={20}>
                    <Col md={12}>
                      <Label>{t("component.options.widthpx")}</Label>
                      <Input
                        type="number"
                        size="large"
                        disabled={false}
                        containerStyle={{ width: 350 }}
                        onChange={e => changeIndividualUiStyle("width", +e.target.value, resId)}
                        value={parseInt(response.width, 10)}
                      />
                    </Col>
                    <Col md={12}>
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
                  </MarginRow>
                </Container>
              );
            })}
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
    stemNumeration: "",
    widthpx: 0,
    heightpx: 0,
    wordwrap: false
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
