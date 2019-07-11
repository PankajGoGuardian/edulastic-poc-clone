import React, { Component } from "react";
import PropTypes from "prop-types";
import { isEqual, clamp } from "lodash";

import { Select, TextField } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";
import { response as Dimensions } from "@edulastic/constants";

import { AddNewChoiceBtn } from "../../../../styled/AddNewChoiceBtn";
import { Row } from "../../../../styled/WidgetOptions/Row";
import { Col } from "../../../../styled/WidgetOptions/Col";
import { Label } from "../../../../styled/WidgetOptions/Label";

import { Container } from "./styled/Container";
import { Delete } from "./styled/Delete";
import { Subtitle } from "../../../../styled/Subtitle";
import Question from "../../../../components/Question";

class Layout extends Component {
  state = {
    focused: null,
    input: 0
  };

  globalHeight = React.createRef();

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
      onChange("ui_style", {
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
      onChange("ui_style", {
        ...uiStyle,
        responsecontainerindividuals: resp
      });
    }
  };

  render() {
    const { onChange, uiStyle, advancedAreOpen, t, fillSections, cleanSections } = this.props;

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

    const textFieldStyles = {
      maxWidth: 280
    };

    return (
      <Question
        section="advanced"
        label={t("component.options.display")}
        advancedAreOpen={advancedAreOpen}
        fillSections={fillSections}
        cleanSections={cleanSections}
      >
        <Subtitle>{t("component.options.display")}</Subtitle>
        <Row>
          {/* <Col md={6}>
            <Label>{t("component.options.stemNumerationReviewOnly")}</Label>
            <Select
              style={{ width: "80%" }}
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
          </Col> */}
          <Col md={6}>
            <Label>{t("component.options.fontSize")}</Label>
            <Select
              style={{ width: "80%" }}
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
          </Col>
        </Row>
        <Row marginTop={13}>
          <Col md={12}>
            <Label>{t("component.options.responsecontainerglobal")}</Label>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Label>{t("component.options.widthpx")}</Label>
            <TextField
              ref={ref => {
                this.widthInput = ref;
              }}
              type="number"
              disabled={false}
              containerStyle={{ width: 350 }}
              style={textFieldStyles}
              onFocus={onFocusHandler()}
              onBlur={onWidthInputBlur()}
              onChange={this.handleInputChange}
              value={getMainWidthInputValue()}
            />
          </Col>
          <Col md={6}>
            <Label>{t("component.options.heightpx")}</Label>
            <TextField
              type="number"
              ref={this.globalHeight}
              disabled={false}
              containerStyle={{ width: 350 }}
              style={textFieldStyles}
              onBlur={this.handleBlurGlobalHeight}
              onChange={e => changeUiStyle("heightpx", +e.target.value)}
              value={uiStyle.heightpx}
            />
          </Col>
          {/* <Col md={6}>
            <Label>{t("component.options.placeholder")}</Label>
            <TextField
              disabled={false}
              containerStyle={{ width: 350 }}
              style={textFieldStyles}
              onChange={e => changeUiStyle("placeholder", e.target.value)}
              value={uiStyle.placeholder}
            />
          </Col> */}
        </Row>
        <Row marginTop={13}>
          <Col md={12}>
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
                <Delete onClick={() => removeIndividual(index)}>X</Delete>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Label>{t("component.options.widthpx")}</Label>
                <TextField
                  ref={ref => {
                    this[`individualWidth${index}`] = ref;
                  }}
                  type="number"
                  disabled={false}
                  containerStyle={{ width: 350 }}
                  style={textFieldStyles}
                  onFocus={onFocusHandler(responsecontainerindividual, index)}
                  onBlur={onWidthInputBlur(index)}
                  onChange={this.handleInputChange}
                  value={getIndividualWidthInputValue(responsecontainerindividual, index)}
                />
              </Col>
              <Col md={6}>
                <Label>{t("component.options.heightpx")}</Label>
                <TextField
                  type="number"
                  disabled={false}
                  containerStyle={{ width: 350 }}
                  style={textFieldStyles}
                  onBlur={() => this.handleBlurIndividualHeight(index)}
                  onChange={e => changeIndividualUiStyle("heightpx", +e.target.value, index)}
                  value={responsecontainerindividual.heightpx}
                />
              </Col>
              <Col md={6}>
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
          <Col md={12}>
            <AddNewChoiceBtn onClick={() => addIndividual()}>{t("component.options.add")}</AddNewChoiceBtn>
          </Col>
        </Row>
      </Question>
    );
  }
}

Layout.propTypes = {
  onChange: PropTypes.func.isRequired,
  uiStyle: PropTypes.object,
  t: PropTypes.func.isRequired,
  outerStyle: PropTypes.object,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
  advancedAreOpen: PropTypes.bool
};

Layout.defaultProps = {
  outerStyle: {},
  uiStyle: {
    responsecontainerposition: "bottom",
    fontsize: "normal",
    stemnumeration: "",
    widthpx: 0,
    heightpx: 0,
    placeholder: "",
    responsecontainerindividuals: []
  },
  advancedAreOpen: false,
  fillSections: () => {},
  cleanSections: () => {}
};

export default React.memo(withNamespaces("assessment")(Layout));
