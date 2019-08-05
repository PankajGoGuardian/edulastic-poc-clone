import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import { message, Select } from "antd";
import { isString } from "lodash";
import { withNamespaces } from "@edulastic/localization";
import { Checkbox } from "@edulastic/common";

import { FRACTIONS_FORMAT, RENDERING_BASE } from "../../Builder/config/constants";
import { getFraction } from "../../Builder/fraction";
import Extras from "../../../../containers/Extras";
import { MoreOptionsInput } from "../../common/styled_components";

import { Row } from "../../../../styled/WidgetOptions/Row";
import { Col } from "../../../../styled/WidgetOptions/Col";
import { Label } from "../../../../styled/WidgetOptions/Label";
import { Subtitle } from "../../../../styled/Subtitle";

import { ScoreSettings, SegmentsToolsSettings } from "..";
import Question from "../../../Question";

class AxisSegmentsMoreOptions extends Component {
  constructor(props) {
    super(props);

    const {
      graphData: {
        numberlineAxis: { ticksDistance }
      }
    } = this.props;

    this.state = {
      layout: "horizontal",
      minWidth: "550px",
      currentFractionItem: {
        id: FRACTIONS_FORMAT.NOT_NORMALIZED,
        value: "Not normalized and mixed fractions",
        label: "Not normalized and mixed fractions",
        selected: true
      },
      currentRenderingBaseItem: {
        id: RENDERING_BASE.LINE_MINIMUM_VALUE,
        value: "Line minimum value",
        label: "Line minimum value",
        selected: true
      },
      ticksDistance
    };
  }

  scoringTypes = [
    { label: "Exact match", value: "exactMatch" },
    { label: "Partial match", value: "partialMatch" },
    { label: "Partial match per response", value: "partialMatchV2" }
  ];

  handleNumberlineCheckboxChange = (name, checked) => {
    const { graphData, setNumberline } = this.props;
    const { numberlineAxis } = graphData;
    setNumberline({ ...numberlineAxis, [name]: !checked });
  };

  handleTicksDistanceInputChange = event => {
    const {
      target: { value }
    } = event;
    this.setState({ ticksDistance: value });
  };

  handleTicksDistanceInputBlur = () => {
    const { ticksDistance: value } = this.state;
    const { graphData, setNumberline } = this.props;
    const {
      numberlineAxis,
      canvas: { x_min: xMin, x_max: xMax }
    } = graphData;

    let parsedValue = null;
    if (isString(value) && value.indexOf("/") !== -1) {
      const fracTicksDistance = getFraction(value);
      parsedValue = fracTicksDistance ? fracTicksDistance.decim : NaN;
    } else {
      parsedValue = parseFloat(value);
    }

    if (Number.isNaN(parsedValue)) {
      setNumberline({ ...numberlineAxis, ticksDistance: value });
      return;
    }

    if (Math.abs(xMax - xMin) / parsedValue > 20) {
      const ticksDistance = +(Math.abs(xMax - xMin) / 20).toFixed(1);
      message.warn(
        `For the range from "${xMin}" to "${xMax}" the minimum tick distance "${ticksDistance}" is recommended`
      );
      this.setState({ ticksDistance });
      setNumberline({ ...numberlineAxis, ticksDistance });
      return;
    }

    setNumberline({ ...numberlineAxis, ticksDistance: value });
  };

  handleNumberlineInputChange = event => {
    const {
      target: { name, value }
    } = event;
    const { graphData, setNumberline } = this.props;
    const { numberlineAxis } = graphData;

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
    const { graphData, setCanvas } = this.props;
    const { canvas } = graphData;
    if (!value) {
      setCanvas({ ...canvas, [name]: 0 });
    } else {
      setCanvas({ ...canvas, [name]: value });
    }
  };

  handleOptionsInputChange = event => {
    const {
      target: { name, value }
    } = event;
    const { graphData, setOptions } = this.props;
    const { ui_style } = graphData;

    if (!value) {
      setOptions({ ...ui_style, [name]: 0 });
    } else {
      setOptions({ ...ui_style, [name]: parseInt(value, 10) });
    }
  };

  getFontSizeItem = () => {
    const { fontSizeList, graphData } = this.props;
    const { numberlineAxis } = graphData;
    return fontSizeList.find(item => item.value === parseInt(numberlineAxis.fontSize, 10));
  };

  changeFontSize = event => {
    const { setNumberline, graphData } = this.props;
    const { numberlineAxis } = graphData;
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

  changeFractionsFormat = e => {
    const { setNumberline, graphData, fractionsFormatList } = this.props;
    const { numberlineAxis } = graphData;
    const findItem = fractionsFormatList.find(fractionItem => fractionItem.value.toLowerCase() === e.toLowerCase());

    if (findItem) {
      findItem.selected = true;

      setNumberline({ ...numberlineAxis, fractionsFormat: findItem.id });

      this.setState(() => ({
        currentFractionItem: findItem
      }));
    }
  };

  changeRenderingBase = e => {
    const { setNumberline, graphData, renderingBaseList } = this.props;
    const { numberlineAxis } = graphData;
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
      fractionsFormatList,
      fillSections,
      cleanSections,
      setValidation,
      graphData,
      setControls,
      advancedAreOpen
    } = this.props;

    const { layout, minWidth, currentRenderingBaseItem, currentFractionItem, ticksDistance } = this.state;

    const { canvas, ui_style, numberlineAxis, toolbar } = graphData;

    return (
      <Fragment>
        <Question
          padding="0px"
          section="advanced"
          label="Scoring"
          cleanSections={cleanSections}
          fillSections={fillSections}
          advancedAreOpen={advancedAreOpen}
        >
          <ScoreSettings
            scoringTypes={this.scoringTypes}
            setValidation={setValidation}
            graphData={graphData}
            advancedAreOpen={advancedAreOpen}
          />
        </Question>

        <Question
          section="advanced"
          label={t("component.graphing.display")}
          cleanSections={cleanSections}
          fillSections={fillSections}
          advancedAreOpen={advancedAreOpen}
        >
          <Subtitle>{t("component.graphing.display")}</Subtitle>

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
                  value={ui_style.layout_width}
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
                  value={ui_style.layout_height}
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
                value={canvas.margin === 0 ? null : canvas.margin}
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
                    label={t("component.graphing.layoutoptions.showMaxArrow")}
                    onChange={() => this.handleNumberlineCheckboxChange("rightArrow", numberlineAxis.rightArrow)}
                    name="rightArrow"
                    checked={numberlineAxis.rightArrow}
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
        </Question>

        <Question
          section="advanced"
          label="Toolbar"
          cleanSections={cleanSections}
          fillSections={fillSections}
          advancedAreOpen={advancedAreOpen}
        >
          <SegmentsToolsSettings onChange={setControls} toolbar={toolbar} />
        </Question>

        <Question
          section="advanced"
          label="Ticks"
          cleanSections={cleanSections}
          fillSections={fillSections}
          advancedAreOpen={advancedAreOpen}
        >
          <Subtitle>{t("component.graphing.ticksoptionstitle")}</Subtitle>
          <Row gutter={60}>
            <Col md={12}>
              <Label>{t("component.graphing.ticksoptions.tickdistance")}</Label>
              <MoreOptionsInput
                type="text"
                name="ticksDistance"
                placeholder="1, 1/2, 1 1/2"
                onChange={this.handleTicksDistanceInputChange}
                onBlur={this.handleTicksDistanceInputBlur}
                value={ticksDistance}
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
              <Row>
                <Col md={24} marginBottom="0px">
                  <Checkbox
                    label={t("component.graphing.ticksoptions.showticks")}
                    name="showTicks"
                    onChange={() => this.handleNumberlineCheckboxChange("showTicks", numberlineAxis.showTicks)}
                    checked={numberlineAxis.showTicks}
                  />
                </Col>
                <Col md={24} marginBottom="0px">
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
                <Col md={12} marginBottom="0px">
                  <Checkbox
                    label={t("component.graphing.ticksoptions.snaptoticks")}
                    name="snapToTicks"
                    onChange={() => this.handleNumberlineCheckboxChange("snapToTicks", numberlineAxis.snapToTicks)}
                    checked={numberlineAxis.snapToTicks}
                  />
                </Col>
              </Row>
            </Col>
            <Col md={12}>
              <Row>
                <Col md={24}>
                  <Label>{t("component.graphing.ticksoptions.fractionsformat")}</Label>
                  <Select
                    style={{ width: "100%" }}
                    onChange={this.changeFractionsFormat}
                    value={currentFractionItem.label}
                  >
                    {fractionsFormatList.map(option => (
                      <Select.Option data-cy={option.value} key={option.value}>
                        {t(option.label)}
                      </Select.Option>
                    ))}
                  </Select>
                </Col>
                <Col md={24}>
                  <Label>{t("component.graphing.ticksoptions.renderingbase")}</Label>
                  <Select
                    style={{ width: "100%" }}
                    onChange={this.changeRenderingBase}
                    value={currentRenderingBaseItem.label}
                  >
                    {renderingBaseList.map(option => (
                      <Select.Option data-cy={option.value} key={option.value}>
                        {t(option.label)}
                      </Select.Option>
                    ))}
                  </Select>
                </Col>
              </Row>
            </Col>
          </Row>
        </Question>

        <Question
          section="advanced"
          label="Labels"
          cleanSections={cleanSections}
          fillSections={fillSections}
          advancedAreOpen={advancedAreOpen}
        >
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
        </Question>

        <Extras isSection cleanSections={cleanSections} fillSections={fillSections} advancedAreOpen={advancedAreOpen}>
          <Extras.Distractors />
          <Extras.Hints />
        </Extras>
      </Fragment>
    );
  }
}

AxisSegmentsMoreOptions.propTypes = {
  t: PropTypes.func.isRequired,
  cleanSections: PropTypes.func.isRequired,
  fillSections: PropTypes.func.isRequired,
  setCanvas: PropTypes.func.isRequired,
  setNumberline: PropTypes.func.isRequired,
  setOptions: PropTypes.func.isRequired,
  orientationList: PropTypes.array.isRequired,
  fontSizeList: PropTypes.array.isRequired,
  renderingBaseList: PropTypes.array.isRequired,
  fractionsFormatList: PropTypes.array.isRequired,
  setValidation: PropTypes.func.isRequired,
  graphData: PropTypes.object.isRequired,
  setControls: PropTypes.func.isRequired,
  advancedAreOpen: PropTypes.bool
};

AxisSegmentsMoreOptions.defaultProps = {
  advancedAreOpen: false
};

const enhance = compose(withNamespaces("assessment"));

export default enhance(AxisSegmentsMoreOptions);
