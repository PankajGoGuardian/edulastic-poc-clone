import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import { withNamespaces } from "@edulastic/localization";
import { Checkbox } from "@edulastic/common";
import { Select } from "antd";

import { RENDERING_BASE } from "../../Builder/config/constants";
import Extras from "../../../../containers/Extras";
import {
  MoreOptionsContainer,
  MoreOptionsInput,
  MoreOptionsLabel,
  MoreOptionsRow,
  MoreOptionsSubHeading,
  MoreOptionsColumnContainer,
  MoreOptionsColumn
} from "../../common/styled_components";

import { Row } from "../../../../styled/WidgetOptions/Row";
import { Col } from "../../../../styled/WidgetOptions/Col";
import { Label } from "../../../../styled/WidgetOptions/Label";
import { Subtitle } from "../../../../styled/Subtitle";

import { QuestionSection, ScoreSettings, SegmentsToolsSettings } from "..";

class AxisSegmentsMoreOptions extends Component {
  state = {
    layout: "horizontal",
    minWidth: "550px",
    currentRenderingBaseItem: {
      id: RENDERING_BASE.LINE_MINIMUM_VALUE,
      value: "Line minimum value",
      label: "Line minimum value",
      selected: true
    }
  };

  scoringTypes = [
    { label: "Exact match", value: "exactMatch" },
    { label: "Partial match", value: "partialMatch" },
    { label: "Partial match per response", value: "partialMatchV2" }
  ];

  handleNumberlineCheckboxChange = (name, checked) => {
    const { numberlineAxis, setNumberline } = this.props;
    setNumberline({ ...numberlineAxis, [name]: !checked });
  };

  handleNumberlineInputChange = event => {
    const {
      target: { name, value }
    } = event;

    const { numberlineAxis, setNumberline } = this.props;
    if (name !== "specificPoints" && !value) {
      setNumberline({ ...numberlineAxis, [name]: 0 });
    } else {
      setNumberline({ ...numberlineAxis, [name]: value });
    }
  };

  handleCanvasInputChange = event => {
    const {
      target: { name, value }
    } = event;

    const { canvasConfig, setCanvas } = this.props;

    if (!value) {
      setCanvas({ ...canvasConfig, [name]: 0 });
    } else {
      setCanvas({ ...canvasConfig, [name]: value });
    }
  };

  handleOptionsInputChange = event => {
    const {
      target: { name, value }
    } = event;

    const { options, setOptions } = this.props;
    if (!value) {
      setOptions({ ...options, [name]: 0 });
    } else {
      setOptions({ ...options, [name]: parseInt(value, 10) });
    }
  };

  getFontSizeItem = () => {
    const { fontSizeList, numberlineAxis } = this.props;
    const selectedItem = fontSizeList.find(item => item.value === parseInt(numberlineAxis.fontSize, 10));

    return selectedItem;
  };

  changeFontSize = event => {
    const { setNumberline, numberlineAxis } = this.props;

    setNumberline({ ...numberlineAxis, fontSize: event });
  };

  handleSelect = (name, value) => {
    this.setState({
      [name]: value
    });
  };

  handleCheckbox = (name, checked) => {
    this.setState({
      [name]: !checked
    });
  };

  handleInputChange = event => {
    const {
      target: { name, value }
    } = event;
    this.setState({ [name]: value });
  };

  changeRenderingBase = e => {
    const { setNumberline, numberlineAxis, renderingBaseList } = this.props;
    const findItem = renderingBaseList.find(renderingItem => renderingItem.value.toLowerCase() === e.toLowerCase());

    if (findItem) {
      findItem.selected = true;

      setNumberline({ ...numberlineAxis, renderingBase: findItem.id });

      this.setState(() => ({
        currentRenderingBaseItem: findItem
      }));
    }
  };

  render() {
    const {
      t,
      orientationList,
      fontSizeList,
      renderingBaseList,
      canvasConfig,
      options,
      numberlineAxis,
      fillSections,
      cleanSections,
      setValidation,
      graphData,
      toolbar,
      setControls
    } = this.props;
    const { layout, minWidth, currentRenderingBaseItem } = this.state;
    return (
      <Fragment>
        <QuestionSection
          padding="0px"
          section="advanced"
          label="Scoring"
          cleanSections={cleanSections}
          fillSections={fillSections}
        >
          <ScoreSettings scoringTypes={this.scoringTypes} setValidation={setValidation} graphData={graphData} />
        </QuestionSection>

        <QuestionSection section="advanced" label="Layout" cleanSections={cleanSections} fillSections={fillSections}>
          <Subtitle>{t("component.graphing.layoutoptionstitle")}</Subtitle>

          <Row gutter={60}>
            <Col md={12}>
              <Label>{t("component.options.orientation")}</Label>
              <Select
                style={{ width: "100%" }}
                onChange={val => this.handleSelect("layout", val)}
                options={orientationList}
                value={layout}
              >
                {orientationList.map(option => (
                  <Select.Option data-cy={option.value} key={option.value}>
                    {option.label}
                  </Select.Option>
                ))}
              </Select>
            </Col>
            {layout === "horizontal" && (
              <Col md={12}>
                <Label>{t("component.graphing.layoutoptions.width")}</Label>
                <MoreOptionsInput
                  type="text"
                  name="layout_width"
                  onChange={this.handleOptionsInputChange}
                  value={options.layout_width}
                />
              </Col>
            )}
          </Row>

          {layout === "vertical" && (
            <Row gutter={60}>
              <Col md={12}>
                <Label>{t("component.graphing.layoutoptions.minWidth")}</Label>
                <MoreOptionsInput type="text" name="minWidth" onChange={this.handleInputChange} value={minWidth} />
              </Col>
              <Col md={12}>
                <Label>{t("component.graphing.layoutoptions.height")}</Label>
                <MoreOptionsInput
                  type="text"
                  name="layout_height"
                  onChange={this.handleOptionsInputChange}
                  value={options.layout_height}
                />
              </Col>
            </Row>
          )}

          <Row gutter={60}>
            <Col md={12}>
              <Label>{t("component.graphing.layoutoptions.linemargin")}</Label>
              <MoreOptionsInput
                type="text"
                name="margin"
                placeholder="0"
                value={canvasConfig.margin === 0 ? null : canvasConfig.margin}
                onChange={this.handleCanvasInputChange}
              />
            </Col>
            <Col md={12}>
              <Label>{t("component.graphing.layoutoptions.spacingBtwStacked")}</Label>
              <MoreOptionsInput
                type="text"
                name="stackResponsesSpacing"
                placeholder="0"
                onChange={this.handleNumberlineInputChange}
                value={numberlineAxis.stackResponsesSpacing === 0 ? null : numberlineAxis.stackResponsesSpacing}
              />
            </Col>
          </Row>
          <Row gutter={60}>
            <Col md={12} marginBottom="0px">
              <Row>
                <Col md={24}>
                  <Checkbox
                    label={t("component.graphing.layoutoptions.showMinArrow")}
                    onChange={() => this.handleNumberlineCheckboxChange("leftArrow", numberlineAxis.leftArrow)}
                    name="leftArrow"
                    checked={numberlineAxis.leftArrow}
                  />
                </Col>
                <Col md={24}>
                  <Checkbox
                    label={t("component.graphing.layoutoptions.stackResponses")}
                    name="stackResponses"
                    onChange={() =>
                      this.handleNumberlineCheckboxChange("stackResponses", numberlineAxis.stackResponses)
                    }
                    checked={numberlineAxis.stackResponses}
                  />
                </Col>
                <Col md={24}>
                  <Checkbox
                    label={t("component.graphing.layoutoptions.showMaxArrow")}
                    onChange={() => this.handleNumberlineCheckboxChange("rightArrow", numberlineAxis.rightArrow)}
                    name="rightArrow"
                    checked={numberlineAxis.rightArrow}
                  />
                </Col>
              </Row>
            </Col>
            <Col md={12}>
              <Label>{t("component.graphing.layoutoptions.fontSize")}</Label>
              <Select
                style={{ width: "100%" }}
                data-cy="fontSize"
                onChange={this.changeFontSize}
                value={this.getFontSizeItem().label}
              >
                {fontSizeList.map(option => (
                  <Select.Option data-cy={option.id} key={option.value}>
                    {t(option.label)}
                  </Select.Option>
                ))}
              </Select>
            </Col>
          </Row>
        </QuestionSection>

        <QuestionSection section="advanced" label="Toolbar" cleanSections={cleanSections} fillSections={fillSections}>
          <SegmentsToolsSettings onChange={setControls} toolbar={toolbar} />
        </QuestionSection>

        <QuestionSection section="advanced" label="Ticks" cleanSections={cleanSections} fillSections={fillSections}>
          <Subtitle>{t("component.graphing.ticksoptionstitle")}</Subtitle>
          <Row gutter={60}>
            <Col md={12}>
              <Label>{t("component.graphing.ticksoptions.tickdistance")}</Label>
              <MoreOptionsInput
                type="number"
                name="ticksDistance"
                onChange={this.handleNumberlineInputChange}
                value={numberlineAxis.ticksDistance}
              />
            </Col>
            <Col md={12}>
              <Label>{t("component.graphing.ticksoptions.minorTicks")}</Label>
              <MoreOptionsInput
                type="text"
                name="minorTicks"
                onChange={this.handleNumberlineInputChange}
                value={numberlineAxis.minorTicks}
              />
            </Col>
          </Row>
          <Row gutter={60}>
            <Col md={12}>
              <Row gutter={60}>
                <Col md={24}>
                  <Checkbox
                    label={t("component.graphing.ticksoptions.showticks")}
                    name="showTicks"
                    onChange={() => this.handleNumberlineCheckboxChange("showTicks", numberlineAxis.showTicks)}
                    checked={numberlineAxis.showTicks}
                  />
                </Col>
                <Col md={24}>
                  <Checkbox
                    label={t("component.graphing.labelsoptions.showmax")}
                    name="showMax"
                    onChange={() => this.handleNumberlineCheckboxChange("showMax", numberlineAxis.showMax)}
                    checked={numberlineAxis.showMax}
                  />
                </Col>
                <Col md={24} marginBottom="0px">
                  <Checkbox
                    label={t("component.graphing.labelsoptions.showmin")}
                    name="showMin"
                    onChange={() => this.handleNumberlineCheckboxChange("showMin", numberlineAxis.showMin)}
                    checked={numberlineAxis.showMin}
                  />
                </Col>
              </Row>
            </Col>
            <Col md={12}>
              <Label>{t("component.graphing.ticksoptions.renderingbase")}</Label>
              <Select
                style={{ width: "100%" }}
                onChange={this.changeRenderingBase}
                value={currentRenderingBaseItem.value}
              >
                {renderingBaseList.map(option => (
                  <Select.Option data-cy={option.value} key={option.value}>
                    {t(option.label)}
                  </Select.Option>
                ))}
              </Select>
            </Col>
          </Row>
        </QuestionSection>

        <QuestionSection section="advanced" label="Labels" cleanSections={cleanSections} fillSections={fillSections}>
          <Subtitle>{t("component.graphing.labelstitle")}</Subtitle>
          <Row gutter={60}>
            <Col md={12}>
              <Label>{t("component.graphing.labelsoptions.displayspecificpoints")}</Label>
              <MoreOptionsInput
                type="text"
                name="specificPoints"
                onChange={this.handleNumberlineInputChange}
                value={numberlineAxis.specificPoints}
              />
            </Col>
          </Row>
          <Row gutter={60}>
            <Col md={24}>
              <Checkbox
                label={t("component.graphing.labelsoptions.showLabels")}
                name="showLabels"
                onChange={() => this.handleNumberlineCheckboxChange("showLabels", numberlineAxis.showLabels)}
                checked={numberlineAxis.showLabels}
              />
            </Col>
            <Col md={24}>
              <Checkbox
                label={t("component.graphing.labelsoptions.showmax")}
                name="labelShowMax"
                onChange={() => this.handleNumberlineCheckboxChange("labelShowMax", numberlineAxis.labelShowMax)}
                checked={numberlineAxis.labelShowMax}
              />
            </Col>
            <Col md={24}>
              <Checkbox
                label={t("component.graphing.labelsoptions.showmin")}
                name="labelShowMin"
                onChange={() => this.handleNumberlineCheckboxChange("labelShowMin", numberlineAxis.labelShowMin)}
                checked={numberlineAxis.labelShowMin}
              />
            </Col>
          </Row>
        </QuestionSection>

        <QuestionSection
          section="advanced"
          label={t("component.options.extras")}
          cleanSections={cleanSections}
          fillSections={fillSections}
          marginLast={0}
          padding="0px"
          bgColor="none"
        >
          <Extras isSection>
            <Extras.Distractors />
            <Extras.Hints />
          </Extras>
        </QuestionSection>
      </Fragment>
    );
  }
}

AxisSegmentsMoreOptions.propTypes = {
  t: PropTypes.func.isRequired,
  cleanSections: PropTypes.func.isRequired,
  fillSections: PropTypes.func.isRequired,
  numberlineAxis: PropTypes.object.isRequired,
  canvasConfig: PropTypes.object.isRequired,
  options: PropTypes.object.isRequired,
  setCanvas: PropTypes.func.isRequired,
  setNumberline: PropTypes.func.isRequired,
  setOptions: PropTypes.func.isRequired,
  orientationList: PropTypes.array,
  fontSizeList: PropTypes.array,
  renderingBaseList: PropTypes.array,
  setValidation: PropTypes.func.isRequired,
  graphData: PropTypes.object.isRequired,
  setControls: PropTypes.func.isRequired,
  toolbar: PropTypes.object.isRequired
};

AxisSegmentsMoreOptions.defaultProps = {
  orientationList: [],
  fontSizeList: [],
  renderingBaseList: []
};

const enhance = compose(withNamespaces("assessment"));

export default enhance(AxisSegmentsMoreOptions);
