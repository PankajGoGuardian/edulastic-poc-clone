/* eslint-disable react/prop-types */
import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { clamp, differenceBy } from "lodash";

import { Select, TextField } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";
import { response as responseDimensions } from "@edulastic/constants";

import { Checkbox } from "antd";

import { getFormattedAttrId } from "@edulastic/common/src/helpers";
import { Block } from "../../styled/WidgetOptions/Block";
import { Subtitle } from "../../styled/Subtitle";
import { Row } from "../../styled/WidgetOptions/Row";
import { Col } from "../../styled/WidgetOptions/Col";
import { Label } from "../../styled/WidgetOptions/Label";
import { AddNewChoiceBtn } from "../../styled/AddNewChoiceBtn";

import { Container } from "./components/Options/styled/Container";
import { Delete } from "./components/Options/styled/Delete";
import SpecialCharacters from "../../containers/WidgetOptions/components/SpecialCharacters";
import Question from "../../components/Question";

class Layout extends Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    responseIds: PropTypes.array.isRequired,
    uiStyle: PropTypes.object,
    t: PropTypes.func.isRequired,
    multipleLine: PropTypes.bool,
    fillSections: PropTypes.func,
    cleanSections: PropTypes.func,
    advancedAreOpen: PropTypes.bool
  };

  static defaultProps = {
    uiStyle: {
      responsecontainerposition: "bottom",
      fontsize: "normal",
      stemNumeration: "",
      widthpx: 140,
      heightpx: 36,
      placeholder: "",
      responsecontainerindividuals: []
    },
    multipleLine: false,
    advancedAreOpen: false,
    fillSections: () => {},
    cleanSections: () => {}
  };

  handleBlur = () => {
    const { onChange, uiStyle } = this.props;
    const { minWidth, maxWidth } = responseDimensions;
    const width = uiStyle.widthpx;
    let { responsecontainerindividuals: responses } = uiStyle;
    if (uiStyle.globalSettings) {
      responses = responses.map(response => ({
        ...response,
        previewWidth: null
      }));
      if (width < minWidth || width > maxWidth) {
        onChange("uiStyle", {
          ...uiStyle,
          widthpx: clamp(width, minWidth, maxWidth),
          responsecontainerindividuals: responses
        });
      } else {
        onChange("uiStyle", {
          ...uiStyle,
          responsecontainerindividuals: responses
        });
      }
    }
    if (width < minWidth || width > maxWidth) {
      onChange("uiStyle", {
        ...uiStyle,
        widthpx: clamp(width, minWidth, maxWidth),
        responsecontainerindividuals: responses
      });
    }
  };

  handleBlurHeightGlobal = () => {
    const { onChange, uiStyle } = this.props;
    const { minHeight, maxHeight } = responseDimensions;
    const { heightpx: height } = uiStyle;
    if (height < minHeight || height > maxHeight) {
      onChange("uiStyle", {
        ...uiStyle,
        heightpx: clamp(height, minHeight, maxHeight)
      });
    }
  };

  handleBlurIndividualHeight = index => {
    const { uiStyle, onChange } = this.props;
    const { responsecontainerindividuals: resp } = uiStyle;
    const { minHeight, maxHeight } = responseDimensions;
    let height = resp[index].heightpx;
    if (height && (height < minHeight || height > maxHeight)) {
      height = clamp(height, minHeight, maxHeight);
      resp[index].heightpx = height;
      onChange("uiStyle", {
        ...uiStyle,
        responsecontainerindividuals: resp
      });
    }
  };

  render() {
    const {
      onChange,
      uiStyle,
      multipleLine,
      advancedAreOpen,
      t,
      fillSections,
      cleanSections,
      handleIndividualTypeChange,
      handleGlobalTypeChange,
      item
    } = this.props;

    const changeUiStyle = (prop, value) => {
      onChange("uiStyle", {
        ...uiStyle,
        [prop]: value
      });
    };

    const changeIndividualUiStyle = (prop, value, index) => {
      const { responsecontainerindividuals: styleArr } = uiStyle;
      const ind = styleArr.findIndex(el => el.index === index);
      if (ind !== -1) {
        styleArr[ind][prop] = value;
      }
      onChange("uiStyle", {
        ...uiStyle,
        responsecontainerindividuals: styleArr
      });
    };

    const addIndividual = () => {
      const { responsecontainerindividuals } = uiStyle;
      // update response containers only if it is already defined due to style updates
      let flag = false;

      const resp = responsecontainerindividuals.map(responsecontainerindividual => {
        if (!flag && responsecontainerindividual.id && !responsecontainerindividual.placeholder) {
          flag = true;
          return {
            ...responsecontainerindividual,
            placeholder: " "
          };
        }
        return responsecontainerindividual;
      });
      if (flag) {
        flag = false;
        onChange("uiStyle", {
          ...uiStyle,
          responsecontainerindividuals: resp.sort((r1, r2) => r1.index - r2.index)
        });
      }

      // limit addition of response containers to response ids
      const { responseIds } = this.props;
      const diff = differenceBy(responseIds, responsecontainerindividuals, "id");
      const _response = diff[0];
      if (_response) {
        responsecontainerindividuals.push({
          id: _response.id,
          index: _response.index,
          widthpx: 0,
          heightpx: 0,
          placeholder: " "
        });
        onChange("uiStyle", {
          ...uiStyle,
          responsecontainerindividuals: responsecontainerindividuals.sort((r1, r2) => r1.index - r2.index)
        });
      }
    };

    const removeIndividual = index => {
      const { responsecontainerindividuals } = uiStyle;
      responsecontainerindividuals.splice(index, 1);
      onChange("uiStyle", {
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
          <Subtitle id={getFormattedAttrId(`${item?.title}-${t("component.options.display")}`)}>
            {t("component.options.display")}
          </Subtitle>
          <Row gutter={20}>
            <Col md={12}>
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
            <Col md={12}>
              <Label>{t("component.options.stemNumerationReviewOnly")}</Label>
              <SelectWrapper>
                <Select
                  onChange={val => changeUiStyle("stemNumeration", val)}
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
                  value={uiStyle.stemNumeration}
                />
              </SelectWrapper>
            </Col>
          </Row>
          <SpecialCharacters />
          <Row gutter={20}>
            <Col md={24}>
              <Label>{t("component.options.responsecontainerglobal")}</Label>
            </Col>
          </Row>
          <Row>
            <Checkbox
              checked={!!uiStyle.globalSettings}
              onChange={e => changeUiStyle("globalSettings", e.target.checked)}
            >
              {t("component.options.autoexpandoninput")}
            </Checkbox>
          </Row>
          <Row gutter={20}>
            <Col md={24}>
              <Checkbox checked={!!multipleLine} onChange={e => onChange("multiple_line", e.target.checked)}>
                {t("component.options.multiline")}
              </Checkbox>
            </Col>
          </Row>
          <Row gutter={20}>
            <Col md={12}>
              <Label>{t("component.options.widthpx")}</Label>
              <TextField
                type="number"
                disabled={false}
                containerStyle={{ width: 350 }}
                ref={ref => {
                  this.widthInput = ref;
                }}
                // onFocus={onFocusHandler()}
                onBlur={this.handleBlur}
                onChange={e => changeUiStyle("widthpx", +e.target.value)}
                value={uiStyle.widthpx}
                minimum={responseDimensions.minWidth}
                maximum={responseDimensions.maxWidth}
              />
            </Col>
            <Col md={12}>
              <Label>{t("component.options.heightpx")}</Label>
              <TextField
                type="number"
                disabled={false}
                containerStyle={{ width: 350 }}
                onBlur={this.handleBlurHeightGlobal}
                onChange={e => changeUiStyle("heightpx", +e.target.value)}
                value={uiStyle.heightpx}
              />
            </Col>
          </Row>
          <Row gutter={20}>
            <Col md={12}>
              <Label>{t("component.options.inputtype")}</Label>
              <SelectWrapper>
                <Select
                  onChange={handleGlobalTypeChange}
                  options={[
                    { value: "text", label: t("component.options.text") },
                    { value: "number", label: t("component.options.number") }
                  ]}
                  value={uiStyle.inputtype}
                />
              </SelectWrapper>
            </Col>
            <Col md={12}>
              <Label>{t("component.options.placeholder")}</Label>
              <TextField
                disabled={false}
                containerStyle={{ width: 350 }}
                onChange={e => changeUiStyle("placeholder", e.target.value)}
                value={uiStyle.placeholder}
              />
            </Col>
          </Row>
          <Row gutter={20}>
            <Col md={24}>
              <Label>{t("component.options.responsecontainerindividuals")}</Label>
            </Col>
          </Row>
          {uiStyle.responsecontainerindividuals.map((responsecontainerindividual, index) =>
            responsecontainerindividual.placeholder ? (
              <Container key={index}>
                <Row>
                  <Col md={18}>
                    <Label>{`${t("component.options.responsecontainerindividual")} ${index + 1}`}</Label>
                  </Col>
                  <Col md={6}>
                    <Delete onClick={() => removeIndividual(index)}>X</Delete>
                  </Col>
                </Row>
                <Row gutter={20}>
                  <Col md={12}>
                    <Label>{t("component.options.widthpx")}</Label>
                    <TextField
                      ref={ref => {
                        this[`individualWidth${index}`] = ref;
                      }}
                      type="number"
                      disabled={false}
                      containerStyle={{ width: 350 }}
                      // TODO
                      // change from 'onChange' to 'onBlur for all
                      onChange={e => changeIndividualUiStyle("widthpx", +e.target.value, index)}
                      value={responsecontainerindividual.widthpx || uiStyle.widthpx}
                    />
                  </Col>
                  <Col md={12}>
                    <Label>{t("component.options.heightpx")}</Label>
                    <TextField
                      type="number"
                      disabled={false}
                      containerStyle={{ width: 350 }}
                      onBlur={() => this.handleBlurIndividualHeight(index)}
                      onChange={e => changeIndividualUiStyle("heightpx", +e.target.value, index)}
                      value={responsecontainerindividual.heightpx || uiStyle.heightpx}
                    />
                  </Col>
                </Row>
                <Row gutter={20}>
                  <Col md={12}>
                    <Label>{t("component.options.inputtype")}</Label>
                    <SelectWrapper>
                      <Select
                        // eslint-disable-next-line react/jsx-no-bind
                        onChange={handleIndividualTypeChange.bind(this, index)}
                        options={[
                          { value: "text", label: t("component.options.text") },
                          { value: "number", label: t("component.options.number") }
                        ]}
                        value={responsecontainerindividual.inputtype}
                      />
                    </SelectWrapper>
                  </Col>
                  <Col md={12}>
                    <Label>{t("component.options.placeholder")}</Label>
                    <TextField
                      disabled={false}
                      containerStyle={{ width: 350 }}
                      onChange={e => changeIndividualUiStyle("placeholder", e.target.value, index)}
                      value={responsecontainerindividual.placeholder}
                    />
                  </Col>
                </Row>
              </Container>
            ) : null
          )}
          <Row gutter={20}>
            <Col md={24}>
              <AddNewChoiceBtn onClick={() => addIndividual()}>{t("component.options.add")}</AddNewChoiceBtn>
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
