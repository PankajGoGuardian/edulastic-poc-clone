import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import { Select, message } from "antd";
import { isString } from "lodash";
import { Checkbox } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";

import { RENDERING_BASE, FRACTIONS_FORMAT } from "../../Builder/config/constants";
import { getFraction } from "../../Builder/fraction";
import Extras from "../../../../containers/Extras";
import { MoreOptionsInput } from "../../common/styled_components";

import { Row } from "../../../../styled/WidgetOptions/Row";
import { Col } from "../../../../styled/WidgetOptions/Col";
import { Label } from "../../../../styled/WidgetOptions/Label";
import { Subtitle } from "../../../../styled/Subtitle";

import { QuestionSection, ScoreSettings } from "..";

class AxisLabelsMoreOptions extends Component {
  constructor(props) {
    super(props);

    const {
      graphData: {
        numberlineAxis: { ticksDistance }
      }
    } = this.props;

    this.state = {
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

  scoringTypes = [{ label: "Exact match", value: "exactMatch" }, { label: "Partial match", value: "partialMatch" }];

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

  handleInputChange = event => {
    const {
      target: { name, value }
    } = event;
    const { graphData, setOptions } = this.props;
    const { ui_style } = graphData;
    setOptions({ ...ui_style, [name]: value });
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
    const { currentFractionItem, currentRenderingBaseItem, ticksDistance } = this.state;

    const {
      t,
      fontSizeList,
      fractionsFormatList,
      renderingBaseList,
      fillSections,
      cleanSections,
      graphData,
      setValidation,
      advancedAreOpen
    } = this.props;

    const { canvas, ui_style, numberlineAxis } = graphData;

    return (
      <Fragment>
        <QuestionSection
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
        </QuestionSection>

        <QuestionSection
          section="advanced"
          label="Layout"
          cleanSections={cleanSections}
          fillSections={fillSections}
          advancedAreOpen={advancedAreOpen}
        >
          <Subtitle>{t("component.graphing.layoutoptionstitle")}</Subtitle>

          <Row gutter={60}>
            <Col md={12}>
              <Label>{t("component.graphing.layoutoptions.width")}</Label>
              <MoreOptionsInput
                type="text"
                name="layout_width"
                placeholder="0"
                value={ui_style.layout_width === 0 ? null : ui_style.layout_width}
                onChange={this.handleOptionsInputChange}
              />
            </Col>

            <Col md={12}>
              <Label>{t("component.graphing.layoutoptions.height")}</Label>
              <MoreOptionsInput
                type="text"
                name="layout_height"
                value={ui_style.layout_height}
                onChange={this.handleInputChange}
              />
            </Col>

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
              <Label>{t("component.graphing.layoutoptions.lineposition")}</Label>
              <MoreOptionsInput
                type="text"
                name="line_position"
                placeholder="0"
                value={ui_style.line_position === 0 ? null : ui_style.line_position}
                onChange={this.handleOptionsInputChange}
              />
            </Col>

            <Col md={12}>
              <Label>{t("component.graphing.layoutoptions.titleposition")}</Label>
              <MoreOptionsInput
                type="text"
                name="title_position"
                placeholder="0"
                value={ui_style.title_position === 0 ? null : ui_style.title_position}
                onChange={this.handleOptionsInputChange}
              />
            </Col>

            <Col md={12}>
              <Label>{t("component.graphing.layoutoptions.pointboxposition")}</Label>
              <MoreOptionsInput
                type="text"
                name="point_box_position"
                placeholder="0"
                value={ui_style.point_box_position === 0 ? null : ui_style.point_box_position}
                onChange={this.handleOptionsInputChange}
              />
            </Col>

            <Col md={12}>
              <Label>{t("component.graphing.layoutoptions.separationdistancex")}</Label>
              <MoreOptionsInput
                type="text"
                name="separationDistanceX"
                placeholder="0"
                value={numberlineAxis.separationDistanceX === 0 ? null : numberlineAxis.separationDistanceX}
                onChange={this.handleNumberlineInputChange}
              />
            </Col>

            <Col md={12}>
              <Label>{t("component.graphing.layoutoptions.separationdistancey")}</Label>
              <MoreOptionsInput
                type="text"
                placeholder="0"
                name="separationDistanceY"
                value={numberlineAxis.separationDistanceY === 0 ? null : numberlineAxis.separationDistanceY}
                onChange={this.handleNumberlineInputChange}
              />
            </Col>

            <Col md={12}>
              <Checkbox
                label={t("component.graphing.layoutoptions.showleftarrow")}
                onChange={() => this.handleNumberlineCheckboxChange("leftArrow", numberlineAxis.leftArrow)}
                name="leftArrow"
                checked={numberlineAxis.leftArrow}
              />
            </Col>

            <Col md={12}>
              <Checkbox
                label={t("component.graphing.layoutoptions.showrightarrow")}
                name="rightArrow"
                onChange={() => this.handleNumberlineCheckboxChange("rightArrow", numberlineAxis.rightArrow)}
                checked={numberlineAxis.rightArrow}
              />
            </Col>

            <Col md={12}>
              <Label>{t("component.graphing.layoutoptions.fontSize")}</Label>
              <Select
                data-cy="fontSize"
                style={{ width: "100%" }}
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

        <QuestionSection
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
        </QuestionSection>

        <QuestionSection
          section="advanced"
          label="Labels"
          cleanSections={cleanSections}
          fillSections={fillSections}
          advancedAreOpen={advancedAreOpen}
        >
          <Subtitle>{t("component.graphing.labelstitle")}</Subtitle>

          <Row gutter={60}>
            <Col md={12}>
              <Label>{t("component.graphing.labelsoptions.frequency")}</Label>
              <MoreOptionsInput
                value={numberlineAxis.labelsFrequency === 0 ? null : numberlineAxis.labelsFrequency}
                onChange={this.handleNumberlineInputChange}
                name="labelsFrequency"
                type="number"
              />
            </Col>
            <Col md={12}>
              <Label>{t("component.graphing.labelsoptions.displayspecificpoints")}</Label>
              <MoreOptionsInput
                type="text"
                name="specificPoints"
                onChange={this.handleNumberlineInputChange}
                value={numberlineAxis.specificPoints}
              />
            </Col>
            <Col md={12}>
              <Checkbox
                label={t("component.graphing.labelsoptions.showmin")}
                name="labelShowMin"
                onChange={() => this.handleNumberlineCheckboxChange("labelShowMin", numberlineAxis.labelShowMin)}
                checked={numberlineAxis.labelShowMin}
              />
            </Col>
            <Col md={12}>
              <Checkbox
                label={t("component.graphing.labelsoptions.showmax")}
                name="labelShowMax"
                onChange={() => this.handleNumberlineCheckboxChange("labelShowMax", numberlineAxis.labelShowMax)}
                checked={numberlineAxis.labelShowMax}
              />
            </Col>
          </Row>
        </QuestionSection>

        <Extras isSection cleanSections={cleanSections} fillSections={fillSections} advancedAreOpen={advancedAreOpen}>
          <Extras.Distractors />
          <Extras.Hints />
        </Extras>
      </Fragment>
    );
  }
}

AxisLabelsMoreOptions.propTypes = {
  t: PropTypes.func.isRequired,
  cleanSections: PropTypes.func.isRequired,
  fillSections: PropTypes.func.isRequired,
  graphData: PropTypes.object.isRequired,
  fontSizeList: PropTypes.array.isRequired,
  fractionsFormatList: PropTypes.array.isRequired,
  renderingBaseList: PropTypes.array.isRequired,
  setOptions: PropTypes.func.isRequired,
  setNumberline: PropTypes.func.isRequired,
  setCanvas: PropTypes.func.isRequired,
  setValidation: PropTypes.func.isRequired,
  advancedAreOpen: PropTypes.bool
};

AxisLabelsMoreOptions.defaultProps = {
  advancedAreOpen: false
};

const enhance = compose(withNamespaces("assessment"));

export default enhance(AxisLabelsMoreOptions);
