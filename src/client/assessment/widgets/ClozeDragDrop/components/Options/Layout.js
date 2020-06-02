import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Select, TextField, Checkbox , notification} from "@edulastic/common";
import { Input, message } from "antd";
import { withNamespaces } from "@edulastic/localization";
import { isEqual, clamp } from "lodash";

import { getFormattedAttrId } from "@edulastic/common/src/helpers";
import { response as Dimensions, ChoiceDimensions } from "@edulastic/constants";
import { CustomStyleBtn } from "../../../../styled/ButtonStyles";
import { Row } from "../../../../styled/WidgetOptions/Row";
import { Col } from "../../../../styled/WidgetOptions/Col";
import { Label } from "../../../../styled/WidgetOptions/Label";
import { H4InnerTitle } from "../../../../styled/InnerTitle";

import { Container } from "./styled/Container";
import { Delete } from "./styled/Delete";
import { Subtitle } from "../../../../styled/Subtitle";
import Question from "../../../../components/Question";
import { TextInputStyled } from "../../../../styled/InputStyles";
import { CheckboxLabel } from "../../../../styled/CheckboxWithLabel";

const { maxWidth: choiceMaxW, minWidth: choiceMinW } = ChoiceDimensions;
class Layout extends Component {
  state = {
    focused: null,
    input: 0
  };

  handleInputChange = e => {
    this.setState({
      input: +e.target.value
    });
  };

  handleBlurGlobalHeight = () => {
    const { onChange, uiStyle } = this.props;
    const { minHeight, maxHeight } = Dimensions;
    if (uiStyle.heightpx < minHeight || uiStyle.heightpx > maxHeight) {
      const height = clamp(uiStyle.heightpx, minHeight, maxHeight);
      onChange("uiStyle", {
        ...uiStyle,
        heightpx: height
      });
    }
  };

  handleBlurIndividualHeight = index => {
    const { uiStyle, onChange } = this.props;
    const { responsecontainerindividuals: resp } = uiStyle;
    const { minHeight, maxHeight } = Dimensions;
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
    const { onChange, uiStyle, t, advancedAreOpen, fillSections, cleanSections, questionType } = this.props;

    const changeUiStyle = (prop, value) => {
      if (prop === "responseContainerWidth" && value < 1) {
        notification({ messageKey:"widthShouldBeGreaterThanZero"});
        return null;
      }
      onChange("uiStyle", {
        ...uiStyle,
        [prop]: value
      });
    };

    const changeIndividualUiStyle = (prop, value, index) => {
      // const newStyles = cloneDeep(uiStyle);
      const { responsecontainerindividuals } = uiStyle;
      const ind = responsecontainerindividuals.findIndex(cont => cont.index === index);
      if (ind !== -1) {
        responsecontainerindividuals[ind][prop] = value;
        onChange("uiStyle", { ...uiStyle, responsecontainerindividuals });
      }
      // newStyles.responsecontainerindividuals[index][prop] = value;
      // onChange("uiStyle", newStyles);
    };

    const addIndividual = () => {
      const { responsecontainerindividuals } = uiStyle;
      const { responseIDs } = this.props;
      const ind = responsecontainerindividuals.length;
      const response = responseIDs.find(resp => resp.index === ind);
      if (!response) {
        return;
      }
      responsecontainerindividuals.push({
        id: response.id,
        index: response.index,
        widthpx: 0,
        heightpx: 0,
        wordwrap: false
      });
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

    const calculateRightWidth = value => {
      const { minWidth, maxWidth } = Dimensions;
      return clamp(value, minWidth, maxWidth);
    };

    const onWidthInputBlur = index => () => {
      const { input } = this.state;
      if (index !== undefined) {
        changeIndividualUiStyle("widthpx", calculateRightWidth(input), index);
      } else {
        changeUiStyle("widthpx", calculateRightWidth(input));
      }

      this.setState({ input: 0, focused: null });
    };

    const getIndividualWidthInputValue = (responsecontainerindividual, index) =>
      // eslint-disable-next-line react/destructuring-assignment
      isEqual(this[`individualWidth${index}`], this.state.focused)
        ? // eslint-disable-next-line react/destructuring-assignment
          this.state.input || 0
        : responsecontainerindividual.widthpx;

    const getMainWidthInputValue = () =>
      // eslint-disable-next-line react/destructuring-assignment
      isEqual(this.widthInput, this.state.focused) ? this.state.input || 0 : uiStyle.widthpx;

    const onFocusHandler = (responsecontainerindividual, index) => () => {
      if (responsecontainerindividual !== undefined && index !== undefined) {
        this.setState({
          focused: this[`individualWidth${index}`],
          input: responsecontainerindividual.widthpx
        });
      } else {
        this.setState({ focused: this.widthInput, input: uiStyle.widthpx });
      }
    };

    return (
      <Question
        section="advanced"
        label={t("component.options.display")}
        advancedAreOpen={advancedAreOpen}
        fillSections={fillSections}
        cleanSections={cleanSections}
      >
        <Subtitle id={getFormattedAttrId(`${questionType}-${t("component.options.display")}`)}>
          {t("component.options.display")}
        </Subtitle>
        <Row gutter={24}>
          <Col md={12}>
            <Label>{t("component.options.responsecontainerposition")}</Label>
            <FieldWrapper>
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
            </FieldWrapper>
          </Col>
          <Col md={12}>
            <Label>{t("component.options.stemNumerationReviewOnly")}</Label>
            <FieldWrapper>
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
            </FieldWrapper>
          </Col>
          <Col md={12}>
            <Label>{t("component.options.fontSize")}</Label>
            <FieldWrapper>
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
            </FieldWrapper>
          </Col>
          <Col md={12}>
            <Label>{t("component.options.choiceMinWidth")}</Label>
            <TextInputStyled
              type="number"
              min="1"
              defaultValue={uiStyle.choiceMinWidth || choiceMinW}
              onBlur={event => changeUiStyle("choiceMinWidth", +event.target.value)}
              label={t("component.options.choiceMinWidth")}
            />
          </Col>
        </Row>
        <Row gutter={24} type={"flex"} align={"middle"}>
          <Col md={12}>
            <Label>{t("component.options.choiceMaxWidth")}</Label>
            <TextInputStyled
              type="number"
              min="1"
              onBlur={event => changeUiStyle("choiceMaxWidth", +event.target.value)}
              defaultValue={uiStyle.choiceMaxWidth || choiceMaxW}
            />
          </Col>
          <Col md={12} marginBottom="0px">
            <CheckboxLabel
              checked={!!uiStyle.globalSettings}
              onChange={() => changeUiStyle("globalSettings", !uiStyle.globalSettings)}
            >
              {t("component.options.globalSettings")}
            </CheckboxLabel>
          </Col>
        </Row>

        <Row gutter={24} marginTop={15}>
          <Col md={12}>
            <Label>{t("component.options.responsecontainerglobal")}</Label>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col md={12}>
            <Label>{t("component.options.widthpx")}</Label>
            <TextInputStyled
              type="number"
              ref={ref => {
                this.widthInput = ref;
              }}
              disabled={false}
              onFocus={onFocusHandler()}
              onBlur={onWidthInputBlur()}
              onChange={this.handleInputChange}
              value={getMainWidthInputValue()}
            />
          </Col>
          <Col md={12}>
            <Label>{t("component.options.heightpx")}</Label>
            <TextInputStyled
              type="number"
              disabled={false}
              onBlur={this.handleBlurGlobalHeight}
              onChange={e => changeUiStyle("heightpx", +e.target.value)}
              value={uiStyle.heightpx}
            />
          </Col>
          <Col md={12}>
            <CheckboxLabel onChange={() => changeUiStyle("wordwrap", !uiStyle.wordwrap)} checked={uiStyle.wordwrap}>
              {t("component.options.wordwrap")}
            </CheckboxLabel>
          </Col>
        </Row>

        <H4InnerTitle margin="20px 0px 10px">{t("component.options.responsecontainerindividuals")}</H4InnerTitle>
        {uiStyle.responsecontainerindividuals.map((responsecontainerindividual, index) => (
          <Row key={index}>
            <CustomStyleBtn
              onClick={() => removeIndividual(index)}
              width="40px"
              height="30px"
              padding="0px"
              margin="0px"
              style={{ float: "right", position: "relative", zIndex: 1 }}
            >
              X
            </CustomStyleBtn>
            <H4InnerTitle margin="10px 0px 20px">
              {`${t("component.options.responsecontainerindividual")} ${index + 1}`}
            </H4InnerTitle>
            <Row gutter={24}>
              <Col md={12}>
                <Label>{t("component.options.widthpx")}</Label>
                <TextInputStyled
                  type="number"
                  ref={ref => {
                    this[`individualWidth${index}`] = ref;
                  }}
                  disabled={false}
                  onFocus={onFocusHandler(responsecontainerindividual, index)}
                  onBlur={onWidthInputBlur(index)}
                  onChange={this.handleInputChange}
                  value={getIndividualWidthInputValue(responsecontainerindividual, index)}
                />
              </Col>
              <Col md={12}>
                <Label>{t("component.options.heightpx")}</Label>
                <TextInputStyled
                  type="number"
                  disabled={false}
                  onBlur={() => this.handleBlurIndividualHeight(index)}
                  onChange={e => changeIndividualUiStyle("heightpx", +e.target.value, index)}
                  value={responsecontainerindividual.heightpx}
                />
              </Col>
              <Col md={12}>
                <CheckboxLabel
                  onChange={() => changeIndividualUiStyle("wordwrap", !responsecontainerindividual.wordwrap, index)}
                  checked={responsecontainerindividual.wordwrap}
                >
                  {t("component.options.wordwrap")}
                </CheckboxLabel>
              </Col>
            </Row>
          </Row>
        ))}
        <Row gutter={24}>
          <Col md={12}>
            <CustomStyleBtn onClick={() => addIndividual()}>{t("component.options.add")}</CustomStyleBtn>
          </Col>
        </Row>
      </Question>
    );
  }
}

Layout.propTypes = {
  onChange: PropTypes.func.isRequired,
  uiStyle: PropTypes.object,
  responseIDs: PropTypes.array,
  t: PropTypes.func.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
  advancedAreOpen: PropTypes.bool
};

Layout.defaultProps = {
  responseIDs: PropTypes.array,
  uiStyle: {
    responsecontainerposition: "bottom",
    fontsize: "normal",
    stemNumeration: "",
    widthpx: 0,
    heightpx: 0,
    wordwrap: false,
    responsecontainerindividuals: []
  },
  advancedAreOpen: false,
  fillSections: () => {},
  cleanSections: () => {}
};

export default React.memo(withNamespaces("assessment")(Layout));

const FieldWrapper = styled.div`
  & > div {
    min-width: 100%;
  }
`;
