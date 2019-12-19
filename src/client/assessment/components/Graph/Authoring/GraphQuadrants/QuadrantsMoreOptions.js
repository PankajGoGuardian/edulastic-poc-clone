import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import { withNamespaces } from "@edulastic/localization";
import { Checkbox, PaddingDiv } from "@edulastic/common";
import { Select } from "antd";

import { EDIT } from "../../../../constants/constantsForQuestions";
import Extras from "../../../../containers/Extras";
import { MoreOptionsInput } from "../../common/styled_components";

import { Row } from "../../../../styled/WidgetOptions/Row";
import { Col } from "../../../../styled/WidgetOptions/Col";
import { Label } from "../../../../styled/WidgetOptions/Label";
import { Subtitle } from "../../../../styled/Subtitle";

import { GraphDisplay } from "../../Display";
import { AnnotationSettings, ScoreSettings } from "..";
import Question from "../../../Question";
import GraphToolsParams from "../../components/GraphToolsParams";
import Tools from "../../common/Tools";
import { ColumnLabel, ColoredRow, RowLabel, StyledTextField } from "../../../../styled/Grid";
import { getFormattedAttrId } from "@edulastic/common/src/helpers";

class QuadrantsMoreOptions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...props.graphData.canvas,
      ...props.graphData.uiStyle
    };
  }

  handleGridChange = event => {
    let value = event.target.value;
    const reg = new RegExp("^[-.0-9]+$");

    if (
      event.target.name !== "xAxisLabel" &&
      event.target.name !== "yAxisLabel" &&
      (event.target.value === "" || reg.test(value))
    ) {
      this.setState({ [event.target.name]: value });
    } else if (event.target.name === "xAxisLabel" || event.target.name === "yAxisLabel") {
      this.setState({ [event.target.name]: event.target.value });
    }
  };

  isQuadrantsPlacement = () => {
    const { graphData } = this.props;
    const { graphType } = graphData;
    return graphType === "quadrantsPlacement";
  };

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

    if (
      event.target.name === "xDistance" ||
      event.target.name === "xTickDistance" ||
      event.target.name === "yDistance" ||
      event.target.name === "yTickDistance"
    ) {
      let _value = parseFloat(value);
      if (!isNaN(_value)) {
        setOptions({ ...uiStyle, [name]: Math.abs(_value) });
        this.setState({ [name]: Math.abs(_value) });
      } else {
        this.setState({ [name]: uiStyle[name] });
      }
    } else {
      setOptions({ ...uiStyle, [name]: value });
    }
  };

  handleCanvasChange = event => {
    const { value, name } = event.target;
    const {
      graphData: { canvas },
      setCanvas
    } = this.props;

    let _value = parseFloat(value);
    if (!isNaN(_value)) {
      canvas[name] = +_value;
      canvas.xRatio = 1;
      canvas.yRatio = 1;
      setCanvas(canvas);
      this.setState({ [name]: _value });
    } else {
      this.setState({ [name]: canvas[name] });
    }
  };

  handleRatioChange = event => {
    let { value } = event.target;
    const { name } = event.target;
    const {
      graphData: { canvas },
      setCanvas
    } = this.props;

    value = parseFloat(value);
    if (!isNaN(value)) {
      value = value > 0 ? value : 1;
      if (name === "xRatio") {
        canvas.xMin = +(parseFloat(canvas.xMin) * (value / canvas.xRatio)).toFixed(4);
        canvas.xMax = +(parseFloat(canvas.xMax) * (value / canvas.xRatio)).toFixed(4);
      } else if (name === "yRatio") {
        canvas.yMin = +(parseFloat(canvas.yMin) * (value / canvas.yRatio)).toFixed(4);
        canvas.yMax = +(parseFloat(canvas.yMax) * (value / canvas.yRatio)).toFixed(4);
      }
      canvas[name] = value;
      setCanvas(canvas);
      this.setState({ [name]: value });
    } else {
      this.setState({ [name]: canvas[name] });
    }
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

  allControls = ["undo", "redo", "reset", "delete"];

  onSelectControl = control => {
    const { graphData, setControls } = this.props;
    const { controlbar } = graphData;

    let newControls = [...controlbar.controls];
    if (newControls.includes(control)) {
      newControls = newControls.filter(item => item !== control);
    } else {
      newControls.push(control);
    }

    setControls({
      ...controlbar,
      controls: [...this.allControls.filter(item => newControls.includes(item))]
    });
  };

  render() {
    const {
      t,
      graphData,
      fontSizeList,
      setBgShapes,
      fillSections,
      cleanSections,
      setToolbar,
      setAnnotation,
      setValidation,
      advancedAreOpen
    } = this.props;

    const { uiStyle, backgroundImage, controlbar, annotation, toolbar } = graphData;

    const {
      drawLabelZero,
      displayPositionOnHover,
      displayPositionPoint = true,
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
      layoutWidth,
      layoutHeight,
      layoutMargin,
      layoutSnapto,
      xShowAxis = true,
      yShowAxis = true,
      showGrid = true
    } = uiStyle;

    const {
      yMax,
      yMin,
      xMax,
      xMin,
      xAxisLabel,
      yAxisLabel,
      xRatio,
      yRatio,
      xDistance,
      yDistance,
      xTickDistance,
      yTickDistance
    } = this.state;

    return (
      <Fragment>
        {!this.isQuadrantsPlacement() && (
          <Question
            section="main"
            label={t("component.graphing.studentInteraction")}
            cleanSections={cleanSections}
            fillSections={fillSections}
            advancedAreOpen
          >
            <PaddingDiv>
              <Subtitle id={getFormattedAttrId(`${graphData?.title}-${t("component.graphing.studentInteraction")}`)}>
                {t("component.graphing.studentInteraction")}
              </Subtitle>
              <GraphToolsParams toolbar={toolbar} setToolbar={setToolbar} />
            </PaddingDiv>
          </Question>
        )}
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
          <Subtitle id={getFormattedAttrId(`${graphData?.title}-${t("component.graphing.display")}`)}>
            {t("component.graphing.display")}
          </Subtitle>
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
                getPopupContainer={triggerNode => triggerNode.parentNode}
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
              <Checkbox
                label={t("component.graphing.grid_options.show_grid")}
                name="showGrid"
                onChange={() => this.handleCheckbox("showGrid", showGrid)}
                checked={showGrid}
                textTransform="uppercase"
              />
            </Col>
            <Col md={12}>
              <Checkbox
                label={t("component.graphing.layoutoptions.displayPositionOnHover")}
                name="displayPositionOnHover"
                onChange={() => this.handleCheckbox("displayPositionOnHover", displayPositionOnHover)}
                checked={displayPositionOnHover}
                textTransform="uppercase"
              />
            </Col>
            <Col md={12}>
              <Checkbox
                label={t("component.graphing.layoutoptions.drawLabelzero")}
                name="drawLabelZero"
                onChange={() => this.handleCheckbox("drawLabelZero", drawLabelZero)}
                checked={drawLabelZero}
                textTransform="uppercase"
              />
            </Col>
            <Col md={12}>
              <Checkbox
                label={t("component.graphing.layoutoptions.snapToGrid")}
                name="layoutSnapto"
                onChange={() => this.handleCheckbox("layoutSnapto", layoutSnapto)}
                checked={layoutSnapto}
                textTransform="uppercase"
              />
            </Col>
            {this.isQuadrantsPlacement() && (
              <Col md={24}>
                <Checkbox
                  label={t("component.graphing.layoutoptions.displayPositionPoint")}
                  name="displayPositionPoint"
                  onChange={() => this.handleCheckbox("displayPositionPoint", displayPositionPoint)}
                  checked={displayPositionPoint}
                  textTransform="uppercase"
                />
              </Col>
            )}
          </Row>
        </Question>

        <Question
          section="advanced"
          label="Grid"
          cleanSections={cleanSections}
          fillSections={fillSections}
          advancedAreOpen={advancedAreOpen}
        >
          <Subtitle id={getFormattedAttrId(`${graphData?.title}-${t("component.graphing.grid_options.grid")}`)}>
            {t("component.graphing.grid_options.grid")}
          </Subtitle>
          <Row gutter={4} type="flex" align="middle">
            <Col md={13} style={{ marginBottom: "0" }}>
              <Row type="flex" align="middle">
                <Col md={3} />
                <Col align="center" md={4}>
                  <ColumnLabel>{t("component.graphing.grid_options.label")}</ColumnLabel>
                </Col>
                <Col align="center" md={4}>
                  <ColumnLabel>{t("component.graphing.grid_options.min")}</ColumnLabel>
                </Col>
                <Col align="center" md={4}>
                  <ColumnLabel>{t("component.graphing.grid_options.max")}</ColumnLabel>
                </Col>
                <Col align="center" md={3}>
                  <ColumnLabel>{t("component.graphing.grid_options.distance")}</ColumnLabel>
                </Col>
                <Col align="center" md={3}>
                  <ColumnLabel>{t("component.graphing.grid_options.tick_distance")}</ColumnLabel>
                </Col>
                <Col align="center" md={3}>
                  <ColumnLabel>{t("component.graphing.grid_options.ratio")}</ColumnLabel>
                </Col>
              </Row>
            </Col>
            <Col md={11} style={{ marginBottom: "0" }}>
              <Row type="flex" align="middle" justify="space-between">
                <Col align="center" md={3}>
                  <ColumnLabel>{t("component.graphing.grid_options.show_axis")}</ColumnLabel>
                </Col>
                <Col align="center" md={3}>
                  <ColumnLabel>{t("component.graphing.grid_options.show_label")}</ColumnLabel>
                </Col>
                <Col align="center" md={3}>
                  <ColumnLabel>{t("component.graphing.grid_options.hide_ticks")}</ColumnLabel>
                </Col>
                <Col align="center" md={3}>
                  <ColumnLabel>{t("component.graphing.grid_options.min_arrow")}</ColumnLabel>
                </Col>
                <Col align="center" md={3}>
                  <ColumnLabel>{t("component.graphing.grid_options.max_arrow")}</ColumnLabel>
                </Col>
                <Col align="center" md={3}>
                  <ColumnLabel>{t("component.graphing.grid_options.comma_in_label")}</ColumnLabel>
                </Col>
                <Col align="center" md={3}>
                  <ColumnLabel>{t("component.graphing.grid_options.draw_label")}</ColumnLabel>
                </Col>
              </Row>
            </Col>
          </Row>
          <ColoredRow style={{ padding: "5px 1px" }} gutter={4}>
            <Col md={13} style={{ marginBottom: "0" }}>
              <Col style={{ marginBottom: "0" }} md={3} align="center">
                <RowLabel style={{ justifyContent: "center" }}>{t("component.graphing.grid_options.axis_x")}</RowLabel>
              </Col>
              <Col md={4} style={{ marginBottom: "0" }}>
                <StyledTextField
                  type="text"
                  defaultValue="X"
                  name="xAxisLabel"
                  value={xAxisLabel}
                  onChange={this.handleGridChange}
                  onBlur={this.handleInputChange}
                  disabled={false}
                />
              </Col>
              <Col md={4} style={{ marginBottom: "0" }}>
                <StyledTextField
                  type="text"
                  name="xMin"
                  value={xMin}
                  onChange={this.handleGridChange}
                  onBlur={this.handleCanvasChange}
                  disabled={false}
                />
              </Col>
              <Col md={4} style={{ marginBottom: "0" }}>
                <StyledTextField
                  type="text"
                  name="xMax"
                  value={xMax}
                  onChange={this.handleGridChange}
                  onBlur={this.handleCanvasChange}
                  disabled={false}
                />
              </Col>
              <Col md={3} style={{ marginBottom: "0" }}>
                <StyledTextField
                  type="text"
                  defaultValue="1"
                  min={0}
                  name="xDistance"
                  value={xDistance}
                  onChange={this.handleGridChange}
                  onBlur={this.handleInputChange}
                  disabled={false}
                />
              </Col>
              <Col md={3} style={{ marginBottom: "0" }}>
                <StyledTextField
                  type="text"
                  defaultValue="1"
                  min={0}
                  name="xTickDistance"
                  value={xTickDistance}
                  onChange={this.handleGridChange}
                  onBlur={this.handleInputChange}
                  disabled={false}
                />
              </Col>
              <Col md={3} style={{ marginBottom: "0" }}>
                <StyledTextField
                  type="text"
                  name="xRatio"
                  min={0}
                  value={xRatio}
                  onChange={this.handleGridChange}
                  onBlur={this.handleRatioChange}
                  disabled={false}
                />
              </Col>
            </Col>
            <Col md={11} style={{ marginBottom: "0" }}>
              <Row type="flex" justify="space-between">
                <Col align="center" md={3} style={{ marginBottom: "0" }}>
                  <Checkbox
                    name="xShowAxis"
                    onChange={() => this.handleCheckbox("xShowAxis", xShowAxis)}
                    checked={xShowAxis}
                  />
                </Col>
                <Col align="center" md={3} style={{ marginBottom: "0" }}>
                  <Checkbox
                    name="drawLabelZero"
                    onChange={() => this.handleCheckbox("xShowAxisLabel", xShowAxisLabel)}
                    checked={xShowAxisLabel}
                  />
                </Col>
                <Col align="center" md={3} style={{ marginBottom: "0" }}>
                  <Checkbox
                    name="drawLabelZero"
                    onChange={() => this.handleCheckbox("xHideTicks", xHideTicks)}
                    checked={xHideTicks}
                  />
                </Col>
                <Col align="center" md={3} style={{ marginBottom: "0" }}>
                  <Checkbox
                    name="drawLabelZero"
                    onChange={() => this.handleCheckbox("xMinArrow", xMinArrow)}
                    checked={xMinArrow}
                  />
                </Col>
                <Col align="center" md={3} style={{ marginBottom: "0" }}>
                  <Checkbox
                    name="drawLabelZero"
                    onChange={() => this.handleCheckbox("xMaxArrow", xMaxArrow)}
                    checked={xMaxArrow}
                  />
                </Col>
                <Col align="center" md={3} style={{ marginBottom: "0" }}>
                  <Checkbox
                    name="drawLabelZero"
                    onChange={() => this.handleCheckbox("xCommaInLabel", xCommaInLabel)}
                    checked={xCommaInLabel}
                  />
                </Col>
                <Col align="center" md={3} style={{ marginBottom: "0" }}>
                  <Checkbox
                    name="drawLabelZero"
                    onChange={() => this.handleCheckbox("xDrawLabel", xDrawLabel)}
                    checked={xDrawLabel}
                  />
                </Col>
              </Row>
            </Col>
          </ColoredRow>
          <ColoredRow style={{ padding: "5px 1px" }} gutter={4}>
            <Col md={13} style={{ marginBottom: "0" }}>
              <Col md={3} style={{ marginBottom: "0" }}>
                <RowLabel style={{ justifyContent: "center" }}>{t("component.graphing.grid_options.axis_y")}</RowLabel>
              </Col>
              <Col md={4} style={{ marginBottom: "0" }}>
                <StyledTextField
                  type="text"
                  defaultValue="X"
                  name="yAxisLabel"
                  value={yAxisLabel}
                  onChange={this.handleGridChange}
                  onBlur={this.handleInputChange}
                  disabled={false}
                />
              </Col>
              <Col md={4} style={{ marginBottom: "0" }}>
                <StyledTextField
                  type="text"
                  name="yMin"
                  value={yMin}
                  onChange={this.handleGridChange}
                  onBlur={this.handleCanvasChange}
                  disabled={false}
                />
              </Col>
              <Col md={4} style={{ marginBottom: "0" }}>
                <StyledTextField
                  type="text"
                  name="yMax"
                  value={yMax}
                  onChange={this.handleGridChange}
                  onBlur={this.handleCanvasChange}
                  disabled={false}
                />
              </Col>
              <Col md={3} style={{ marginBottom: "0" }}>
                <StyledTextField
                  type="text"
                  defaultValue="1"
                  min={0}
                  name="yDistance"
                  value={yDistance}
                  onChange={this.handleGridChange}
                  onBlur={this.handleInputChange}
                  disabled={false}
                />
              </Col>
              <Col md={3} style={{ marginBottom: "0" }}>
                <StyledTextField
                  type="text"
                  defaultValue="1"
                  min={0}
                  name="yTickDistance"
                  value={yTickDistance}
                  onChange={this.handleGridChange}
                  onBlur={this.handleInputChange}
                  disabled={false}
                />
              </Col>
              <Col md={3} style={{ marginBottom: "0" }}>
                <StyledTextField
                  type="text"
                  name="yRatio"
                  min={0}
                  value={yRatio}
                  onChange={this.handleGridChange}
                  onBlur={this.handleRatioChange}
                  disabled={false}
                />
              </Col>
            </Col>
            <Col md={11} style={{ marginBottom: "0" }}>
              <Row type="flex" justify="space-between">
                <Col align="center" md={3} style={{ marginBottom: "0" }}>
                  <Checkbox
                    name="yShowAxis"
                    onChange={() => this.handleCheckbox("yShowAxis", yShowAxis)}
                    checked={yShowAxis}
                  />
                </Col>
                <Col align="center" md={3} style={{ marginBottom: "0" }}>
                  <Checkbox
                    name="drawLabelZero"
                    onChange={() => this.handleCheckbox("yShowAxisLabel", yShowAxisLabel)}
                    checked={yShowAxisLabel}
                  />
                </Col>
                <Col align="center" md={3} style={{ marginBottom: "0" }}>
                  <Checkbox
                    name="drawLabelZero"
                    onChange={() => this.handleCheckbox("yHideTicks", yHideTicks)}
                    checked={yHideTicks}
                  />
                </Col>
                <Col align="center" md={3} style={{ marginBottom: "0" }}>
                  <Checkbox
                    name="drawLabelZero"
                    onChange={() => this.handleCheckbox("yMinArrow", yMinArrow)}
                    checked={yMinArrow}
                  />
                </Col>
                <Col align="center" md={3} style={{ marginBottom: "0" }}>
                  <Checkbox
                    name="drawLabelZero"
                    onChange={() => this.handleCheckbox("yMaxArrow", yMaxArrow)}
                    checked={yMaxArrow}
                  />
                </Col>
                <Col align="center" md={3} style={{ marginBottom: "0" }}>
                  <Checkbox
                    name="drawLabelZero"
                    onChange={() => this.handleCheckbox("yCommaInLabel", yCommaInLabel)}
                    checked={yCommaInLabel}
                  />
                </Col>
                <Col align="center" md={3} style={{ marginBottom: "0" }}>
                  <Checkbox
                    name="drawLabelZero"
                    onChange={() => this.handleCheckbox("yDrawLabel", yDrawLabel)}
                    checked={yDrawLabel}
                  />
                </Col>
              </Row>
            </Col>
          </ColoredRow>
        </Question>

        <Question
          section="advanced"
          label={t("component.graphing.graphControls")}
          cleanSections={cleanSections}
          fillSections={fillSections}
          advancedAreOpen={advancedAreOpen}
        >
          <Subtitle id={getFormattedAttrId(`${graphData?.title}-${t("component.graphing.graphControls")}`)}>
            {t("component.graphing.graphControls")}
          </Subtitle>
          <Tools
            toolsAreVisible={false}
            controls={this.allControls}
            selected={controlbar.controls}
            onSelectControl={this.onSelectControl}
          />
        </Question>

        <Question
          section="advanced"
          label="Labels"
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
          <Subtitle>{t("component.graphing.background_options.background_image")}</Subtitle>
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
              {advancedAreOpen && (
                <GraphDisplay
                  view={EDIT}
                  advancedElementSettings
                  graphData={graphData}
                  onChange={setBgShapes}
                  elements={graphData.background_shapes}
                  changePreviewTab={() => {}}
                  bgShapes
                />
              )}
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

QuadrantsMoreOptions.propTypes = {
  t: PropTypes.func.isRequired,
  cleanSections: PropTypes.func.isRequired,
  fillSections: PropTypes.func.isRequired,
  graphData: PropTypes.object.isRequired,
  fontSizeList: PropTypes.array.isRequired,
  setOptions: PropTypes.func.isRequired,
  setCanvas: PropTypes.func.isRequired,
  setBgImg: PropTypes.func.isRequired,
  setBgShapes: PropTypes.func.isRequired,
  setControls: PropTypes.func.isRequired,
  setToolbar: PropTypes.func.isRequired,
  setAnnotation: PropTypes.func.isRequired,
  setValidation: PropTypes.func.isRequired,
  advancedAreOpen: PropTypes.bool
};

QuadrantsMoreOptions.defaultProps = {
  advancedAreOpen: false
};

const enhance = compose(withNamespaces("assessment"));

export default enhance(QuadrantsMoreOptions);
