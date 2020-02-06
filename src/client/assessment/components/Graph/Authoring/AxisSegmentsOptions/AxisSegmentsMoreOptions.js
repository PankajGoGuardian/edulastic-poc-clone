import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import { message, Select } from "antd";
import { withNamespaces } from "@edulastic/localization";
import { Checkbox } from "@edulastic/common";

import { fractionStringToNumber } from "../../../../utils/helpers";
import { FRACTION_FORMATS } from "../../../../constants/constantsForQuestions";
import { RENDERING_BASE } from "../../Builder/config/constants";
import Extras from "../../../../containers/Extras";
import { MoreOptionsInput } from "../../common/styled_components";

import { Row } from "../../../../styled/WidgetOptions/Row";
import { Col } from "../../../../styled/WidgetOptions/Col";
import { Label } from "../../../../styled/WidgetOptions/Label";
import { Subtitle } from "../../../../styled/Subtitle";

import { ScoreSettings, SegmentsToolsSettings } from "..";
import Question from "../../../Question";
import { getFormattedAttrId } from "@edulastic/common/src/helpers";
import { SelectInputStyled, TextInputStyled } from "../../../../styled/InputStyles";
import { CheckboxLabel } from "../../../../styled/CheckboxWithLabel";

class AxisSegmentsMoreOptions extends Component {
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

  scoringTypes = [
    { label: "Exact match", value: "exactMatch" },
    { label: "Partial match", value: "partialMatch" }
    // { label: "Partial match per response", value: "partialMatchV2" }
  ];

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
      setOptions({ ...uiStyle, [name]: 0 });
    } else {
      setOptions({ ...uiStyle, [name]: parseInt(value, 10) });
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
    const { graphData, setOptions } = this.props;
    const { uiStyle } = graphData;

    const newUiStyle = { ...uiStyle, [name]: value };
    if (name === "orientation") {
      const { layoutHeight, layoutWidth } = newUiStyle;
      if (newUiStyle.orientation === "horizontal") {
        newUiStyle.layoutWidth = layoutHeight;
        newUiStyle.layoutHeight = layoutWidth;
      } else if (newUiStyle.orientation === "vertical") {
        newUiStyle.layoutWidth = layoutHeight;
        newUiStyle.layoutHeight = layoutWidth;
      }
    }
    setOptions(newUiStyle);
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
    const { graphData, setOptions } = this.props;
    const { uiStyle } = graphData;
    setOptions({ ...uiStyle, [name]: value });
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

  render() {
    const {
      t,
      orientationList,
      fontSizeList,
      renderingBaseList,
      fillSections,
      cleanSections,
      setValidation,
      graphData,
      setControls,
      advancedAreOpen
    } = this.props;

    const { currentRenderingBaseItem, ticksDistance } = this.state;
    const { canvas, uiStyle, numberlineAxis, toolbar } = graphData;
    const { fractionsFormat } = numberlineAxis;
    const orientation = uiStyle.orientation || "horizontal";

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

          <Row gutter={24}>
            <Col md={12}>
              <Label>{t("component.options.orientation")}</Label>
              <SelectInputStyled
                getPopupContainer={triggerNode => triggerNode.parentNode}
                onChange={val => this.handleSelect("orientation", val)}
                options={orientationList}
                value={uiStyle.orientation || orientation}
              >
                {orientationList.map(option => (
                  <Select.Option data-cy={option.value} key={option.value}>
                    {t(option.label)}
                  </Select.Option>
                ))}
              </SelectInputStyled>
            </Col>
            {orientation === "horizontal" && (
              <Col md={12}>
                <Label>{t("component.graphing.layoutoptions.width")}</Label>
                <TextInputStyled
                  type="text"
                  name="layoutWidth"
                  onChange={this.handleOptionsInputChange}
                  value={uiStyle.layoutWidth}
                />
              </Col>
            )}
          </Row>

          {orientation === "vertical" && (
            <Row gutter={24}>
              <Col md={12}>
                <Label>{t("component.graphing.layoutoptions.minWidth")}</Label>
                <TextInputStyled
                  type="text"
                  name="layoutWidth"
                  onChange={this.handleOptionsInputChange}
                  value={uiStyle.layoutWidth}
                />
              </Col>
              <Col md={12}>
                <Label>{t("component.graphing.layoutoptions.height")}</Label>
                <TextInputStyled
                  type="text"
                  name="layoutHeight"
                  onChange={this.handleOptionsInputChange}
                  value={uiStyle.layoutHeight}
                />
              </Col>
            </Row>
          )}

          <Row gutter={24}>
            <Col md={12}>
              <Label>{t("component.graphing.layoutoptions.linemargin")}</Label>
              <TextInputStyled
                type="text"
                name="margin"
                placeholder="0"
                value={canvas.margin === 0 ? null : canvas.margin}
                onChange={this.handleCanvasInputChange}
              />
            </Col>
            <Col md={12}>
              <Label>{t("component.graphing.layoutoptions.spacingBtwStacked")}</Label>
              <TextInputStyled
                type="text"
                name="stackResponsesSpacing"
                placeholder="0"
                onChange={this.handleNumberlineInputChange}
                value={numberlineAxis.stackResponsesSpacing === 0 ? null : numberlineAxis.stackResponsesSpacing}
              />
            </Col>
            <Col md={12}>
              <Label>{t("component.graphing.layoutoptions.fontSize")}</Label>
              <SelectInputStyled
                data-cy="fontSize"
                getPopupContainer={triggerNode => triggerNode.parentNode}
                onChange={this.changeFontSize}
                value={this.getFontSizeItem().label}
              >
                {fontSizeList.map(option => (
                  <Select.Option data-cy={option.id} key={option.value}>
                    {option.label}
                  </Select.Option>
                ))}
              </SelectInputStyled>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col md={24}>
              <CheckboxLabel
                onChange={() => this.handleNumberlineCheckboxChange("leftArrow", numberlineAxis.leftArrow)}
                name="leftArrow"
                checked={numberlineAxis.leftArrow}
              >
                {t("component.graphing.layoutoptions.showMinArrow")}
              </CheckboxLabel>
            </Col>
            <Col md={24}>
              <CheckboxLabel
                onChange={() => this.handleNumberlineCheckboxChange("rightArrow", numberlineAxis.rightArrow)}
                name="rightArrow"
                checked={numberlineAxis.rightArrow}
              >
                {t("component.graphing.layoutoptions.showMaxArrow")}
              </CheckboxLabel>
            </Col>
            <Col md={24}>
              <CheckboxLabel
                name="stackResponses"
                onChange={() => this.handleNumberlineCheckboxChange("stackResponses", numberlineAxis.stackResponses)}
                checked={numberlineAxis.stackResponses}
              >
                {t("component.graphing.layoutoptions.stackResponses")}
              </CheckboxLabel>
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
          <Subtitle id={getFormattedAttrId(`${graphData?.title}-${t("component.graphing.ticksoptionstitle")}`)}>
            {t("component.graphing.ticksoptionstitle")}
          </Subtitle>
          <Row gutter={24}>
            <Col md={12}>
              <Label>{t("component.graphing.ticksoptions.tickdistance")}</Label>
              <TextInputStyled
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
              <TextInputStyled
                type="text"
                name="minorTicks"
                onChange={this.handleNumberlineInputChange}
                value={numberlineAxis.minorTicks}
              />
            </Col>
            <Col md={12}>
              <Label>{t("component.options.fractionFormat")}</Label>
              <SelectInputStyled
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
              </SelectInputStyled>
            </Col>
            <Col md={12}>
              <Label>{t("component.graphing.ticksoptions.renderingbase")}</Label>
              <SelectInputStyled
                style={{ width: "100%" }}
                getPopupContainer={triggerNode => triggerNode.parentNode}
                onChange={this.changeRenderingBase}
                value={currentRenderingBaseItem.label}
              >
                {renderingBaseList.map(option => (
                  <Select.Option data-cy={option.value} key={option.value}>
                    {option.label}
                  </Select.Option>
                ))}
              </SelectInputStyled>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col md={12}>
              <CheckboxLabel
                name="showTicks"
                onChange={() => this.handleNumberlineCheckboxChange("showTicks", numberlineAxis.showTicks)}
                checked={numberlineAxis.showTicks}
              >
                {t("component.graphing.ticksoptions.showticks")}
              </CheckboxLabel>
            </Col>
            <Col md={12}>
              <CheckboxLabel
                name="showMax"
                onChange={() => this.handleNumberlineCheckboxChange("showMax", numberlineAxis.showMax)}
                checked={numberlineAxis.showMax}
              >
                {t("component.graphing.labelsoptions.showmax")}
              </CheckboxLabel>
            </Col>
            <Col md={12}>
              <CheckboxLabel
                name="showMin"
                onChange={() => this.handleNumberlineCheckboxChange("showMin", numberlineAxis.showMin)}
                checked={numberlineAxis.showMin}
              >
                {t("component.graphing.labelsoptions.showmin")}
              </CheckboxLabel>
            </Col>
            <Col md={12}>
              <CheckboxLabel
                name="snapToTicks"
                onChange={() => this.handleNumberlineCheckboxChange("snapToTicks", numberlineAxis.snapToTicks)}
                checked={numberlineAxis.snapToTicks}
              >
                {t("component.graphing.ticksoptions.snaptoticks")}
              </CheckboxLabel>
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
          <Row gutter={24}>
            <Col md={12}>
              <Label>{t("component.graphing.labelsoptions.displayspecificpoints")}</Label>
              <TextInputStyled
                type="text"
                name="specificPoints"
                onChange={this.handleNumberlineInputChange}
                value={numberlineAxis.specificPoints}
              />
            </Col>
          </Row>
          <Row gutter={24}>
            <Col md={24}>
              <CheckboxLabel
                name="showLabels"
                onChange={() => this.handleNumberlineCheckboxChange("showLabels", numberlineAxis.showLabels)}
                checked={numberlineAxis.showLabels}
              >
                {t("component.graphing.labelsoptions.showLabels")}
              </CheckboxLabel>
            </Col>
            <Col md={24}>
              <CheckboxLabel
                name="labelShowMax"
                onChange={() => this.handleNumberlineCheckboxChange("labelShowMax", numberlineAxis.labelShowMax)}
                checked={numberlineAxis.labelShowMax}
              >
                {t("component.graphing.labelsoptions.showmax")}
              </CheckboxLabel>
            </Col>
            <Col md={24}>
              <CheckboxLabel
                name="labelShowMin"
                onChange={() => this.handleNumberlineCheckboxChange("labelShowMin", numberlineAxis.labelShowMin)}
                checked={numberlineAxis.labelShowMin}
              >
                {t("component.graphing.labelsoptions.showmin")}
              </CheckboxLabel>
            </Col>
          </Row>
        </Question>

        <Extras
          isSection={false}
          cleanSections={cleanSections}
          fillSections={fillSections}
          advancedAreOpen={advancedAreOpen}
        >
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
