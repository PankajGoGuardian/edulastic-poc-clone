import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import styled from "styled-components";
import { isEqual, find, clamp } from "lodash";

import { Select, TextField } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";
import { response } from "@edulastic/constants";

import { Checkbox } from "antd";

import { Block } from "../../styled/WidgetOptions/Block";
import { Subtitle } from "../../styled/Subtitle";
import { Row } from "../../styled/WidgetOptions/Row";
import { Col } from "../../styled/WidgetOptions/Col";
import { Label } from "../../styled/WidgetOptions/Label";
import { Widget } from "../../styled/Widget";
import { AddNewChoiceBtn } from "../../styled/AddNewChoiceBtn";

import { Container } from "./components/Options/styled/Container";
import { Delete } from "./components/Options/styled/Delete";
import SpecialCharacters from "../../containers/WidgetOptions/components/SpecialCharacters";

class Layout extends Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
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
      stemnumeration: "",
      widthpx: 140,
      heightpx: 35,
      placeholder: "",
      responsecontainerindividuals: []
    },
    multipleLine: false,
    advancedAreOpen: false,
    fillSections: () => {},
    cleanSections: () => {}
  };

  state = {
    focused: null,
    input: 0
  };

  componentDidMount = () => {
    const { fillSections, t } = this.props;
    const node = ReactDOM.findDOMNode(this);

    fillSections("advanced", t("component.options.display"), node.offsetTop, node.scrollHeight);
  };

  componentDidUpdate(prevProps) {
    const { advancedAreOpen, fillSections, t } = this.props;

    const node = ReactDOM.findDOMNode(this);

    if (prevProps.advancedAreOpen !== advancedAreOpen) {
      fillSections("advanced", t("component.options.display"), node.offsetTop, node.scrollHeight);
    }
  }

  componentWillUnmount() {
    const { cleanSections } = this.props;

    cleanSections();
  }

  handleInputChange = e => {
    this.setState({
      input: +e.target.value
    });
  };

  handleBlur = () => {
    const { onChange, uiStyle } = this.props;
    const { minWidth, maxWidth } = response;
    const width = uiStyle.widthpx;
    let { responsecontainerindividuals: responses } = uiStyle;
    if (uiStyle.globalSettings) {
      responses = responses.map(response => ({
        ...response,
        previewWidth: null
      }));
      if (width < minWidth || width > maxWidth) {
        onChange("ui_style", {
          ...uiStyle,
          widthpx: clamp(width, minWidth, maxWidth),
          responsecontainerindividuals: responses
        });
      } else {
        onChange("ui_style", {
          ...uiStyle,
          responsecontainerindividuals: responses
        });
      }
    }
    if (width < minWidth || width > maxWidth) {
      onChange("ui_style", {
        ...uiStyle,
        widthpx: clamp(width, minWidth, maxWidth),
        responsecontainerindividuals: responses
      });
    }
  };

  handleBlurHeightGlobal = () => {
    const { onChange, uiStyle } = this.props;
    const { minHeight, maxHeight } = response;
    const { heightpx: height } = uiStyle;
    if (height < minHeight || height > maxHeight) {
      onChange("ui_style", {
        ...uiStyle,
        heightpx: clamp(height, minHeight, maxHeight)
      });
    }
  };

  handleBlurIndividualHeight = index => {
    const { uiStyle, onChange } = this.props;
    const { responsecontainerindividuals: resp } = uiStyle;
    const { minHeight, maxHeight } = response;
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
    const { onChange, uiStyle, multipleLine, advancedAreOpen, t } = this.props;

    const changeUiStyle = (prop, value) => {
      onChange("ui_style", {
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
      onChange("ui_style", {
        ...uiStyle,
        responsecontainerindividuals: styleArr
      });
    };

    const addIndividual = () => {
      const { responsecontainerindividuals } = uiStyle;
      const { responseIds } = this.props;
      const ind = responsecontainerindividuals.length;
      const response = find(responseIds, resp => resp.index === ind);
      responsecontainerindividuals.push({
        id: !!response ? response.id : "",
        index: !!response ? response.index : "",
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
      const { minWidth, maxWidth } = response;
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
      <Widget style={{ display: advancedAreOpen ? "block" : "none" }}>
        <Block style={{ paddingTop: 0 }}>
          <Subtitle>{t("component.options.display")}</Subtitle>
          <Row gutter={20}>
            <Col md={12}>
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
          </Row>
          <SpecialCharacters />
          <Row>
            <Checkbox
              checked={!!uiStyle.globalSettings}
              onChange={e => changeUiStyle("globalSettings", e.target.checked)}
            >
              {t("component.options.globalSettings")}
            </Checkbox>
          </Row>
          <Row gutter={20}>
            <Col md={24}>
              <Label>{t("component.options.responsecontainerglobal")}</Label>
            </Col>
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
                minimum={response.minWidth}
                maximum={response.maxWidth}
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
                  onChange={inputtype => changeUiStyle("inputtype", inputtype)}
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
                    onFocus={onFocusHandler(responsecontainerindividual, index)}
                    onBlur={onWidthInputBlur(index)}
                    onChange={this.handleInputChange}
                    value={getIndividualWidthInputValue(responsecontainerindividual, index)}
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
                    value={responsecontainerindividual.heightpx}
                  />
                </Col>
              </Row>
              <Row gutter={20}>
                <Col md={12}>
                  <Label>{t("component.options.inputtype")}</Label>
                  <SelectWrapper>
                    <Select
                      onChange={inputtype => changeIndividualUiStyle("inputtype", inputtype, index)}
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
          ))}
          <Row gutter={20}>
            <Col md={24}>
              <AddNewChoiceBtn onClick={() => addIndividual()}>{t("component.options.add")}</AddNewChoiceBtn>
            </Col>
          </Row>
        </Block>
      </Widget>
    );
  }
}

export default React.memo(withNamespaces("assessment")(Layout));

const SelectWrapper = styled.div`
  & > div {
    min-width: 100%;
  }
`;
