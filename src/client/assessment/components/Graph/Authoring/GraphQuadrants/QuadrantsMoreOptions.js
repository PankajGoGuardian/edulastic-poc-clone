import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import { withNamespaces } from "@edulastic/localization";
import { Checkbox } from "@edulastic/common";
import { Select } from "antd";

import Extras from "../../../../containers/Extras";
import { MoreOptionsInput, MoreOptionsInputSmall } from "../../common/styled_components";

import { Row } from "../../../../styled/WidgetOptions/Row";
import { Col } from "../../../../styled/WidgetOptions/Col";
import { Label } from "../../../../styled/WidgetOptions/Label";
import { Subtitle } from "../../../../styled/Subtitle";

import { GraphDisplay } from "../../Display";
import { AnnotationSettings, ControlsSettings, ScoreSettings } from "..";
import Question from "../../../Question";

class QuadrantsMoreOptions extends Component {
  handleCheckbox = (name, checked) => {
    const { graphData, setOptions } = this.props;
    const { uiStyle } = graphData;
    setOptions({ ...uiStyle, [name]: !checked });
  };

  handleInputChange = event => {
    const {
      target: { name, value }
    } = event;
    const { graphData, setOptions } = this.props;
    const { uiStyle } = graphData;
    setOptions({ ...uiStyle, [name]: value });
  };

  handleSelect = (name, value) => {
    const { graphData, setOptions } = this.props;
    const { uiStyle } = graphData;
    setOptions({ ...uiStyle, [name]: value });
  };

  handleBgImgCheckbox = (name, checked) => {
    const { graphData, setBgImg } = this.props;
    const { backgroundImage } = graphData;
    setBgImg({ ...backgroundImage, [name]: !checked });
  };

  handleBgImgInputChange = event => {
    const {
      target: { name, value }
    } = event;
    const { graphData, setBgImg } = this.props;
    const { backgroundImage } = graphData;
    setBgImg({ ...backgroundImage, [name]: value });
  };

  render() {
    const {
      t,
      graphData,
      stemNumerationList,
      fontSizeList,
      setBgShapes,
      fillSections,
      cleanSections,
      setControls,
      setAnnotation,
      setValidation,
      advancedAreOpen
    } = this.props;

    const { uiStyle, backgroundImage, controlbar, annotation } = graphData;

    const {
      drawLabelZero,
      displayPositionOnHover,
      currentStemNum,
      currentFontSize,
      xShowAxisLabel,
      xHideTicks,
      xDrawLabel,
      xMaxArrow,
      xMinArrow,
      xCommaInLabel,
      yShowAxisLabel,
      yHideTicks,
      yDrawLabel,
      yMaxArrow,
      yMinArrow,
      yCommaInLabel,
      xDistance,
      yDistance,
      xTickDistance,
      yTickDistance,
      layoutWidth,
      layoutHeight,
      layoutMargin,
      layoutSnapto,
      xAxisLabel,
      yAxisLabel,
      xShowAxis = true,
      yShowAxis = true,
      showGrid = true
    } = uiStyle;

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
            showSelect={false}
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
              <Label>{t("component.graphing.layoutoptions.width")}</Label>
              <MoreOptionsInput
                type="text"
                defaultValue="600"
                name="layoutWidth"
                value={layoutWidth}
                onChange={this.handleInputChange}
              />
            </Col>
            <Col md={12}>
              <Label>{t("component.graphing.layoutoptions.height")}</Label>
              <MoreOptionsInput
                type="text"
                defaultValue="600"
                name="layoutHeight"
                value={layoutHeight}
                onChange={this.handleInputChange}
              />
            </Col>
            <Col md={12}>
              <Label>{t("component.graphing.layoutoptions.margin")}</Label>
              <MoreOptionsInput
                type="text"
                defaultValue="0"
                name="layoutMargin"
                value={layoutMargin}
                onChange={this.handleInputChange}
              />
            </Col>
            <Col md={12}>
              <Label>{t("component.graphing.layoutoptions.fontSize")}</Label>
              <Select
                size="large"
                onChange={val => this.handleSelect("currentFontSize", val)}
                value={currentFontSize}
                data-cy="fontSize"
                style={{ width: "100%" }}
              >
                {fontSizeList.map(option => (
                  <Select.Option data-cy={option.value} key={option.value}>
                    {option.label}
                  </Select.Option>
                ))}
              </Select>
            </Col>
            <Col md={12}>
              <Label>{t("component.graphing.layoutoptions.stemNumeration")}</Label>
              <Select
                size="large"
                onChange={val => this.handleSelect("currentStemNum", val)}
                value={currentStemNum}
                data-cy="stemNumeration"
                style={{ width: "100%" }}
              >
                {stemNumerationList.map(option => (
                  <Select.Option data-cy={option.value} key={option.value}>
                    {option.label}
                  </Select.Option>
                ))}
              </Select>
            </Col>

            <Col md={12}>
              <Label>{t("component.graphing.layoutoptions.snapTo")}</Label>
              <MoreOptionsInput
                type="text"
                defaultValue="grid"
                name="layoutSnapto"
                value={layoutSnapto}
                onChange={this.handleInputChange}
              />
            </Col>
            <Col md={24}>
              <Checkbox
                label={t("component.graphing.grid_options.show_grid")}
                name="showGrid"
                onChange={() => this.handleCheckbox("showGrid", showGrid)}
                checked={showGrid}
              />
            </Col>
            <Col md={24}>
              <Checkbox
                label={t("component.graphing.layoutoptions.displayPositionOnHover")}
                name="displayPositionOnHover"
                onChange={() => this.handleCheckbox("displayPositionOnHover", displayPositionOnHover)}
                checked={displayPositionOnHover}
              />
            </Col>
            <Col md={24}>
              <Checkbox
                label={t("component.graphing.layoutoptions.drawLabelzero")}
                name="drawLabelZero"
                onChange={() => this.handleCheckbox("drawLabelZero", drawLabelZero)}
                checked={drawLabelZero}
              />
            </Col>
          </Row>
        </Question>

        <Question
          section="advanced"
          label="Grid"
          cleanSections={cleanSections}
          fillSections={fillSections}
          advancedAreOpen={advancedAreOpen}
        >
          <Subtitle>{t("component.graphing.grid_options.grid")}</Subtitle>
          <Row gutter={60}>
            <Col md={12}>
              <Row>
                <Col md={24}>
                  <Label>{t("component.graphing.grid_options.axis_x")}</Label>
                </Col>
                <Col md={24}>
                  <MoreOptionsInputSmall
                    type="number"
                    defaultValue="1"
                    name="xDistance"
                    value={xDistance}
                    onChange={this.handleInputChange}
                  />
                  <Label display="inline" style={{ marginLeft: "29px" }}>
                    {t("component.graphing.grid_options.x_distance")}
                  </Label>
                </Col>
                <Col md={24}>
                  <MoreOptionsInputSmall
                    type="number"
                    name="xTickDistance"
                    value={xTickDistance}
                    onChange={this.handleInputChange}
                  />
                  <Label display="inline" style={{ marginLeft: "29px" }}>
                    {t("component.graphing.grid_options.tick_distance")}
                  </Label>
                </Col>
                <Col md={24} marginTop="25px">
                  <Checkbox
                    label={t("component.graphing.grid_options.show_axis")}
                    name="xShowAxis"
                    onChange={() => this.handleCheckbox("xShowAxis", xShowAxis)}
                    checked={xShowAxis}
                  />
                </Col>
                <Col md={24}>
                  <Checkbox
                    label={t("component.graphing.grid_options.show_axis_label")}
                    name="drawLabelZero"
                    onChange={() => this.handleCheckbox("xShowAxisLabel", xShowAxisLabel)}
                    checked={xShowAxisLabel}
                  />
                </Col>
                {xShowAxisLabel && (
                  <Col md={24}>
                    <MoreOptionsInput
                      type="text"
                      defaultValue="X"
                      style={{ width: "7em", marginTop: 0 }}
                      name="xAxisLabel"
                      value={xAxisLabel}
                      onChange={this.handleInputChange}
                    />
                  </Col>
                )}
                <Col md={24}>
                  <Checkbox
                    label={t("component.graphing.grid_options.hide_ticks")}
                    name="drawLabelZero"
                    onChange={() => this.handleCheckbox("xHideTicks", xHideTicks)}
                    checked={xHideTicks}
                  />
                </Col>
                <Col md={24}>
                  <Checkbox
                    label={t("component.graphing.grid_options.draw_label")}
                    name="drawLabelZero"
                    onChange={() => this.handleCheckbox("xDrawLabel", xDrawLabel)}
                    checked={xDrawLabel}
                  />
                </Col>
                <Col md={24}>
                  <Checkbox
                    label={t("component.graphing.grid_options.min_arrow")}
                    name="drawLabelZero"
                    onChange={() => this.handleCheckbox("xMinArrow", xMinArrow)}
                    checked={xMinArrow}
                  />
                </Col>
                <Col md={24}>
                  <Checkbox
                    label={t("component.graphing.grid_options.max_arrow")}
                    name="drawLabelZero"
                    onChange={() => this.handleCheckbox("xMaxArrow", xMaxArrow)}
                    checked={xMaxArrow}
                  />
                </Col>
                <Col md={24}>
                  <Checkbox
                    label={t("component.graphing.grid_options.comma_in_label")}
                    name="drawLabelZero"
                    onChange={() => this.handleCheckbox("xCommaInLabel", xCommaInLabel)}
                    checked={xCommaInLabel}
                  />
                </Col>
              </Row>
            </Col>
            <Col md={12}>
              <Row>
                <Col md={24}>
                  <Label>{t("component.graphing.grid_options.axis_y")}</Label>
                </Col>
                <Col md={24}>
                  <MoreOptionsInputSmall
                    type="number"
                    defaultValue="1"
                    style={{ width: "7em", marginTop: 0 }}
                    name="yDistance"
                    value={yDistance}
                    onChange={this.handleInputChange}
                  />
                  <Label display="inline" style={{ marginLeft: "29px" }}>
                    {t("component.graphing.grid_options.y_distance")}
                  </Label>
                </Col>
                <Col md={24}>
                  <MoreOptionsInputSmall
                    type="number"
                    style={{ width: "7em", marginTop: 0 }}
                    name="yTickDistance"
                    value={yTickDistance}
                    onChange={this.handleInputChange}
                  />
                  <Label display="inline" style={{ marginLeft: "29px" }}>
                    {t("component.graphing.grid_options.tick_distance")}
                  </Label>
                </Col>
                <Col md={24} marginTop="25px">
                  <Checkbox
                    label={t("component.graphing.grid_options.show_axis")}
                    name="yShowAxis"
                    onChange={() => this.handleCheckbox("yShowAxis", yShowAxis)}
                    checked={yShowAxis}
                  />
                </Col>
                <Col md={24}>
                  <Checkbox
                    label={t("component.graphing.grid_options.show_axis_label")}
                    name="drawLabelZero"
                    onChange={() => this.handleCheckbox("yShowAxisLabel", yShowAxisLabel)}
                    checked={yShowAxisLabel}
                  />
                </Col>
                {yShowAxisLabel && (
                  <Col md={24}>
                    <MoreOptionsInput
                      type="text"
                      defaultValue="X"
                      style={{ width: "7em", marginTop: 0 }}
                      name="yAxisLabel"
                      value={yAxisLabel}
                      onChange={this.handleInputChange}
                    />
                  </Col>
                )}
                <Col md={24}>
                  <Checkbox
                    label={t("component.graphing.grid_options.hide_ticks")}
                    name="drawLabelZero"
                    onChange={() => this.handleCheckbox("yHideTicks", yHideTicks)}
                    checked={yHideTicks}
                  />
                </Col>
                <Col md={24}>
                  <Checkbox
                    label={t("component.graphing.grid_options.draw_label")}
                    name="drawLabelZero"
                    onChange={() => this.handleCheckbox("yDrawLabel", yDrawLabel)}
                    checked={yDrawLabel}
                  />
                </Col>
                <Col md={24}>
                  <Checkbox
                    label={t("component.graphing.grid_options.min_arrow")}
                    name="drawLabelZero"
                    onChange={() => this.handleCheckbox("yMinArrow", yMinArrow)}
                    checked={yMinArrow}
                  />
                </Col>
                <Col md={24}>
                  <Checkbox
                    label={t("component.graphing.grid_options.max_arrow")}
                    name="drawLabelZero"
                    onChange={() => this.handleCheckbox("yMaxArrow", yMaxArrow)}
                    checked={yMaxArrow}
                  />
                </Col>
                <Col md={24}>
                  <Checkbox
                    label={t("component.graphing.grid_options.comma_in_label")}
                    name="drawLabelZero"
                    onChange={() => this.handleCheckbox("yCommaInLabel", yCommaInLabel)}
                    checked={yCommaInLabel}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </Question>

        <Question
          section="advanced"
          label="Controls"
          cleanSections={cleanSections}
          fillSections={fillSections}
          advancedAreOpen={advancedAreOpen}
        >
          <ControlsSettings onChange={setControls} controlbar={controlbar} />
        </Question>

        <Question
          section="advanced"
          label="Annotation"
          cleanSections={cleanSections}
          fillSections={fillSections}
          advancedAreOpen={advancedAreOpen}
        >
          <AnnotationSettings annotation={annotation} setAnnotation={setAnnotation} />
        </Question>

        <Question
          section="advanced"
          label="Background Image"
          cleanSections={cleanSections}
          fillSections={fillSections}
          advancedAreOpen={advancedAreOpen}
        >
          <Subtitle>{t("component.graphing.background_options.backgroundImage")}</Subtitle>
          <Row gutter={60}>
            <Col md={24}>
              <Label>{t("component.graphing.background_options.image_url")}</Label>
              <MoreOptionsInput
                type="text"
                defaultValue=""
                name="src"
                value={backgroundImage.src}
                onChange={this.handleBgImgInputChange}
              />
            </Col>
          </Row>
          <Row gutter={60}>
            <Col md={12}>
              <Label>{t("component.graphing.background_options.height")}</Label>
              <MoreOptionsInput
                type="text"
                defaultValue=""
                name="height"
                value={backgroundImage.height}
                onChange={this.handleBgImgInputChange}
              />
            </Col>
            <Col md={12}>
              <Label>{t("component.graphing.background_options.width")}</Label>
              <MoreOptionsInput
                type="text"
                defaultValue=""
                name="width"
                value={backgroundImage.width}
                onChange={this.handleBgImgInputChange}
              />
            </Col>
          </Row>

          <Row gutter={60}>
            <Col md={12}>
              <Label>{t("component.graphing.background_options.x_axis_image_position")}</Label>
              <MoreOptionsInput
                type="text"
                defaultValue=""
                name="x"
                value={backgroundImage.x}
                onChange={this.handleBgImgInputChange}
              />
            </Col>
            <Col md={12}>
              <Label>{t("component.graphing.background_options.y_axis_image_position")}</Label>
              <MoreOptionsInput
                type="text"
                defaultValue=""
                name="y"
                value={backgroundImage.y}
                onChange={this.handleBgImgInputChange}
              />
            </Col>
          </Row>

          <Row gutter={60}>
            <Col md={12}>
              <Label>{t("component.graphing.background_options.opacity")}</Label>
              <MoreOptionsInput
                type="text"
                defaultValue=""
                name="opacity"
                value={backgroundImage.opacity}
                onChange={this.handleBgImgInputChange}
              />
            </Col>
            <Col md={12}>
              <Checkbox
                label={t("component.graphing.background_options.show_bg_shape_points")}
                name="showShapePoints"
                onChange={() => this.handleBgImgCheckbox("showShapePoints", backgroundImage.showShapePoints)}
                checked={backgroundImage.showShapePoints}
              />
            </Col>
          </Row>
        </Question>

        <Question
          section="advanced"
          label="Background Shapes"
          cleanSections={cleanSections}
          fillSections={fillSections}
          deskHeight={graphData.uiStyle.layoutHeight}
          advancedAreOpen={advancedAreOpen}
        >
          <Subtitle>{t("component.graphing.background_shapes")}</Subtitle>
          <Row>
            <Col md={24}>
              <GraphDisplay
                graphData={graphData}
                onChange={setBgShapes}
                elements={graphData.background_shapes}
                changePreviewTab={() => {}}
                bgShapes
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

QuadrantsMoreOptions.propTypes = {
  t: PropTypes.func.isRequired,
  cleanSections: PropTypes.func.isRequired,
  fillSections: PropTypes.func.isRequired,
  graphData: PropTypes.object.isRequired,
  stemNumerationList: PropTypes.array.isRequired,
  fontSizeList: PropTypes.array.isRequired,
  setOptions: PropTypes.func.isRequired,
  setBgImg: PropTypes.func.isRequired,
  setBgShapes: PropTypes.func.isRequired,
  setControls: PropTypes.func.isRequired,
  setAnnotation: PropTypes.func.isRequired,
  setValidation: PropTypes.func.isRequired,
  advancedAreOpen: PropTypes.bool
};

QuadrantsMoreOptions.defaultProps = {
  fontSizeList: [],
  stemNumerationList: [],
  advancedAreOpen: false
};

const enhance = compose(withNamespaces("assessment"));

export default enhance(QuadrantsMoreOptions);
