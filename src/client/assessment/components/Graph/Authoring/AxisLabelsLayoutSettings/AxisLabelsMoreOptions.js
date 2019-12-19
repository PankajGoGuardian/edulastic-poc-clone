import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import { Select, message } from "antd";
import { Checkbox } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";

import { fractionStringToNumber } from "../../../../utils/helpers";
import { FRACTION_FORMATS } from "../../../../constants/constantsForQuestions";
import { RENDERING_BASE } from "../../Builder/config/constants";
import Extras from "../../../../containers/Extras";
import { MoreOptionsInput } from "../../common/styled_components";

import { Row } from "../../../../styled/WidgetOptions/Row";
import { Col } from "../../../../styled/WidgetOptions/Col";
import { Label } from "../../../../styled/WidgetOptions/Label";
import { Subtitle } from "../../../../styled/Subtitle";

import { ScoreSettings } from "..";
import Question from "../../../Question";
import { getFormattedAttrId } from "@edulastic/common/src/helpers";

class AxisLabelsMoreOptions extends Component {
  constructor(props) {
    super(props);

    const {
      graphData: {
        numberlineAxis: { ticksDistance }
      }
    } = this.props;

    this.state = {
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

  getFractionFormatSettings = () => {
    const { t } = this.props;
    return [
      { label: t("component.options.fractionFormatOptions.decimal"), value: FRACTION_FORMATS.decimal },
      { label: t("component.options.fractionFormatOptions.fraction"), value: FRACTION_FORMATS.fraction },
      { label: t("component.options.fractionFormatOptions.mixedFraction"), value: FRACTION_FORMATS.mixedFraction }
    ];
  };

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
      canvas: { xMin, xMax }
    } = graphData;

    const parsedValue = fractionStringToNumber(value);
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
    const { uiStyle } = graphData;

    if (!value) {
      setOptions({ ...uiStyle, [name]: "" });
    } else {
      setOptions({ ...uiStyle, [name]: value });
    }
  };

  handleInputChange = event => {
    const {
      target: { name, value }
    } = event;
    const { graphData, setOptions } = this.props;
    const { uiStyle } = graphData;
    setOptions({ ...uiStyle, [name]: value });
  };

  getFontSizeItem = () => {
    const { fontSizeList, graphData } = this.props;
    const { numberlineAxis } = graphData;
    return fontSizeList.find(item => item.value === parseInt(numberlineAxis.fontSize, 10));
  };

  getResponseBoxPositionItem = () => {
    const { responseBoxPositionList, graphData } = this.props;
    const { numberlineAxis } = graphData;
    return responseBoxPositionList.find(item => item.id === (numberlineAxis.responseBoxPosition || "bottom"));
  };

  changeFontSize = event => {
    const { setNumberline, graphData } = this.props;
    const { numberlineAxis } = graphData;
    setNumberline({ ...numberlineAxis, fontSize: event });
  };

  changeFractionsFormat = e => {
    const { setNumberline, graphData } = this.props;
    const { numberlineAxis } = graphData;
    setNumberline({ ...numberlineAxis, fractionsFormat: e });
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

  changeResponseBoxPosition = event => {
    const { setNumberline, graphData } = this.props;
    const { numberlineAxis } = graphData;
    setNumberline({ ...numberlineAxis, responseBoxPosition: event });
  };

  render() {
    const { currentRenderingBaseItem, ticksDistance } = this.state;

    const {
      t,
      fontSizeList,
      renderingBaseList,
      responseBoxPositionList,
      fillSections,
      cleanSections,
      graphData,
      setValidation,
      advancedAreOpen
    } = this.props;

    const { canvas, uiStyle, numberlineAxis } = graphData;
    const { fractionsFormat } = numberlineAxis;

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
          <Subtitle id={getFormattedAttrId(`${graphData?.title}-${t("component.graphing.display")}`)}>
            {t("component.graphing.display")}
          </Subtitle>

          <Row gutter={60}>
            <Col md={12}>
              <Label>{t("component.graphing.layoutoptions.width")}</Label>
              <MoreOptionsInput
                type="text"
                name="layoutWidth"
                placeholder="0"
                value={uiStyle.layoutWidth === 0 ? null : uiStyle.layoutWidth}
                onChange={this.handleOptionsInputChange}
              />
            </Col>

            <Col md={12}>
              <Label>{t("component.graphing.layoutoptions.height")}</Label>
              <MoreOptionsInput
                type="text"
                name="layoutHeight"
                value={uiStyle.layoutHeight}
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
                name="linePosition"
                placeholder="0"
                value={uiStyle.linePosition === 0 ? null : uiStyle.linePosition}
                onChange={this.handleOptionsInputChange}
              />
            </Col>
          </Row>

          <Row gutter={60}>
            <Col md={12}>
              <Label>{t("component.graphing.layoutoptions.titleposition")}</Label>
              <MoreOptionsInput
                type="text"
                name="titlePosition"
                placeholder="0"
                value={uiStyle.titlePosition === 0 ? null : uiStyle.titlePosition}
                onChange={this.handleOptionsInputChange}
              />
            </Col>
          </Row>

          <Row gutter={60}>
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
                getPopupContainer={triggerNode => triggerNode.parentNode}
                value={this.getFontSizeItem().label}
              >
                {fontSizeList.map(option => (
                  <Select.Option data-cy={option.id} key={option.value}>
                    {t(option.label)}
                  </Select.Option>
                ))}
              </Select>
            </Col>

            <Col md={12}>
              <Label>{t("component.options.responsecontainerposition")}</Label>
              <Select
                data-cy="responseBoxPosition"
                style={{ width: "100%" }}
                onChange={this.changeResponseBoxPosition}
                getPopupContainer={triggerNode => triggerNode.parentNode}
                value={this.getResponseBoxPositionItem().label}
              >
                {responseBoxPositionList.map(option => (
                  <Select.Option data-cy={option.id} key={option.id}>
                    {option.label}
                  </Select.Option>
                ))}
              </Select>
            </Col>
          </Row>
        </Question>

        <Question
          section="advanced"
          label="Ticks"
          cleanSections={cleanSections}
          fillSections={fillSections}
          advancedAreOpen={advancedAreOpen}
        >
          <Subtitle id={getFormattedAttrId(`${graphData?.title}-${t("component.graphing.ticksoptionstitle")}`)}>
            {t("component.graphing.ticksoptionstitle")}
          </Subtitle>
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
                  <Label>{t("component.options.fractionFormat")}</Label>
                  <Select
                    style={{ width: "100%" }}
                    onChange={this.changeFractionsFormat}
                    getPopupContainer={triggerNode => triggerNode.parentNode}
                    value={fractionsFormat || FRACTION_FORMATS.decimal}
                  >
                    {this.getFractionFormatSettings().map(option => (
                      <Select.Option data-cy={option.value} key={option.value}>
                        {option.label}
                      </Select.Option>
                    ))}
                  </Select>
                </Col>
                <Col md={24}>
                  <Label>{t("component.graphing.ticksoptions.renderingbase")}</Label>
                  <Select
                    style={{ width: "100%" }}
                    onChange={this.changeRenderingBase}
                    getPopupContainer={triggerNode => triggerNode.parentNode}
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
          <Subtitle id={getFormattedAttrId(`${graphData?.title}-${t("component.graphing.labelstitle")}`)}>
            {t("component.graphing.labelstitle")}
          </Subtitle>

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
                label={t("component.graphing.labelsoptions.showLabels")}
                name="showLabels"
                onChange={() => this.handleNumberlineCheckboxChange("showLabels", numberlineAxis.showLabels)}
                checked={numberlineAxis.showLabels}
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
        </Question>

        <Extras
          isSection={false}
          cleanSections={cleanSections}
          fillSections={fillSections}
          advancedAreOpen={advancedAreOpen}
          item={graphData}
        >
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
  renderingBaseList: PropTypes.array.isRequired,
  responseBoxPositionList: PropTypes.array.isRequired,
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
