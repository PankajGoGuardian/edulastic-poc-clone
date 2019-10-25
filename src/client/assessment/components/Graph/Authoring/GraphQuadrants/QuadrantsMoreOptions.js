import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import { withNamespaces } from "@edulastic/localization";
import { Checkbox, PaddingDiv } from "@edulastic/common";
import { Select } from "antd";

import { EDIT } from "../../../../constants/constantsForQuestions";
import Extras from "../../../../containers/Extras";
import { MoreOptionsInput, MoreOptionsInputSmall } from "../../common/styled_components";

import { Row } from "../../../../styled/WidgetOptions/Row";
import { Col } from "../../../../styled/WidgetOptions/Col";
import { Label } from "../../../../styled/WidgetOptions/Label";
import { Subtitle } from "../../../../styled/Subtitle";

import { GraphDisplay } from "../../Display";
import { AnnotationSettings, ScoreSettings } from "..";
import Question from "../../../Question";
import GraphToolsParams from "../../components/GraphToolsParams";
import Tools from "../../common/Tools";
import { ColumnLabel, ColoredRow, RowLabel, StyledTextField } from "../../../../widgets/Charts/styled/Grid";

class QuadrantsMoreOptions extends Component {
  state = {
    yMax: 10.4,
    yMin: -10.4,
    xMax: 10.4,
    xMin: -10.4
  };

  handleGridChange = event => this.setState({ [event.target.name]: event.target.value });

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
    setOptions({ ...uiStyle, [name]: value });
  };

  handleCanvasChange = event => {
    const { value, name } = event.target;
    const {
      graphData: { canvas },
      setCanvas
    } = this.props;

    canvas[name] = +value;
    canvas.xRatio = 1;
    canvas.yRatio = 1;
    setCanvas(canvas);
  };

  handleRatioChange = event => {
    let { value } = event.target;
    const { name } = event.target;
    const {
      graphData: { canvas },
      setCanvas
    } = this.props;

    value = parseFloat(value);
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

    const { uiStyle, backgroundImage, controlbar, annotation, toolbar, canvas } = graphData;

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

    const { yMax, yMin, xMax, xMin } = this.state;
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
              <Subtitle>{t("component.graphing.studentInteraction")}</Subtitle>
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
                label={t("component.graphing.layoutoptions.snapToGrid")}
                name="layoutSnapto"
                onChange={() => this.handleCheckbox("layoutSnapto", layoutSnapto)}
                checked={layoutSnapto}
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
            {this.isQuadrantsPlacement() && (
              <Col md={24}>
                <Checkbox
                  label={t("component.graphing.layoutoptions.displayPositionPoint")}
                  name="displayPositionPoint"
                  onChange={() => this.handleCheckbox("displayPositionPoint", displayPositionPoint)}
                  checked={displayPositionPoint}
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
          <Subtitle>{t("component.graphing.grid_options.grid")}</Subtitle>
          <Row style={{ display: "flex", alignItems: "center" }} gutter={4}>
            <Col aligh="center" span={2} />
            <Col style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "11%" }}>
              <ColumnLabel>LABEL</ColumnLabel>
            </Col>
            <Col style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "9%" }} span={3}>
              <ColumnLabel>MIN</ColumnLabel>
            </Col>
            <Col style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "9%" }} span={3}>
              <ColumnLabel>MAX</ColumnLabel>
            </Col>
            <Col style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "7%" }} span={2}>
              <ColumnLabel>DISTANCE</ColumnLabel>
            </Col>
            <Col style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "7%" }} span={2}>
              <ColumnLabel>
                TICKS
                <br />
                DISTANCE
              </ColumnLabel>
            </Col>
            <Col style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "7%" }} span={2}>
              <ColumnLabel>RATIO</ColumnLabel>
            </Col>
            <Col style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "6%" }} span={2}>
              <ColumnLabel>
                SHOW
                <br />
                AXIS
              </ColumnLabel>
            </Col>
            <Col style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "6%" }} span={2}>
              <ColumnLabel>
                SHOW
                <br />
                LABEL
              </ColumnLabel>
            </Col>
            <Col style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "6%" }} span={2}>
              <ColumnLabel>
                HIDE
                <br />
                TICKS
              </ColumnLabel>
            </Col>
            <Col style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "6%" }} span={2}>
              <ColumnLabel>
                MIN
                <br />
                ARROW
              </ColumnLabel>
            </Col>
            <Col style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "6%" }} span={2}>
              <ColumnLabel>
                MAX
                <br />
                ARROW
              </ColumnLabel>
            </Col>
            <Col style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "6%" }} span={2}>
              <ColumnLabel>
                COMMA IN
                <br />
                LABEL
              </ColumnLabel>
            </Col>
            <Col style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "6%" }} span={2}>
              <ColumnLabel>
                DRAW
                <br />
                LABELS
              </ColumnLabel>
            </Col>
          </Row>
          <ColoredRow style={{ padding: "5px 1px" }} gutter={4}>
            <Col
              style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "0" }}
              span={2}
            >
              <RowLabel>X AXIS</RowLabel>
            </Col>
            <Col
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "11%",
                marginBottom: "0"
              }}
              span={3}
            >
              <StyledTextField
                type="text"
                defaultValue="X"
                name="xAxisLabel"
                value={xAxisLabel}
                onChange={this.handleInputChange}
                disabled={false}
              />
            </Col>
            <Col
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "9%",
                marginBottom: "0"
              }}
              span={3}
            >
              <StyledTextField
                type="number"
                name="xMin"
                value={xMin}
                onChange={this.handleGridChange}
                onBlur={this.handleCanvasChange}
                disabled={false}
              />
            </Col>
            <Col
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "9%",
                marginBottom: "0"
              }}
              span={3}
            >
              <StyledTextField
                type="number"
                name="xMax"
                value={xMax}
                onChange={this.handleGridChange}
                onBlur={this.handleCanvasChange}
                disabled={false}
              />
            </Col>
            <Col
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: "0",
                width: "7%"
              }}
              span={2}
            >
              <StyledTextField
                type="number"
                defaultValue="1"
                name="xDistance"
                value={xDistance}
                onChange={this.handleInputChange}
                disabled={false}
              />
            </Col>
            <Col
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: "0",
                width: "7%"
              }}
              span={2}
            >
              <StyledTextField
                type="number"
                defaultValue="1"
                name="xTickDistance"
                value={xTickDistance}
                onChange={this.handleInputChange}
                disabled={false}
              />
            </Col>
            <Col
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: "0",
                width: "7%"
              }}
              span={2}
            >
              <StyledTextField
                type="number"
                name="xRatio"
                value={canvas.xRatio}
                onChange={this.handleRatioChange}
                disabled={false}
              />
            </Col>
            <Col
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "6%",
                marginBottom: "0"
              }}
              span={2}
            >
              <Checkbox
                name="xShowAxis"
                onChange={() => this.handleCheckbox("xShowAxis", xShowAxis)}
                checked={xShowAxis}
              />
            </Col>
            <Col
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "6%",
                marginBottom: "0"
              }}
              span={2}
            >
              <Checkbox
                name="drawLabelZero"
                onChange={() => this.handleCheckbox("xShowAxisLabel", xShowAxisLabel)}
                checked={xShowAxisLabel}
              />
            </Col>
            <Col
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "6%",
                marginBottom: "0"
              }}
              span={2}
            >
              <Checkbox
                name="drawLabelZero"
                onChange={() => this.handleCheckbox("xHideTicks", xHideTicks)}
                checked={xHideTicks}
              />
            </Col>
            <Col
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "6%",
                marginBottom: "0"
              }}
              span={2}
            >
              <Checkbox
                name="drawLabelZero"
                onChange={() => this.handleCheckbox("xMinArrow", xMinArrow)}
                checked={xMinArrow}
              />
            </Col>
            <Col
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "6%",
                marginBottom: "0"
              }}
              span={2}
            >
              <Checkbox
                name="drawLabelZero"
                onChange={() => this.handleCheckbox("xMaxArrow", xMaxArrow)}
                checked={xMaxArrow}
              />
            </Col>
            <Col
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "6%",
                marginBottom: "0"
              }}
              span={2}
            >
              <Checkbox
                name="drawLabelZero"
                onChange={() => this.handleCheckbox("xCommaInLabel", xCommaInLabel)}
                checked={xCommaInLabel}
              />
            </Col>
            <Col
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "6%",
                marginBottom: "0"
              }}
              span={2}
            >
              <Checkbox
                name="drawLabelZero"
                onChange={() => this.handleCheckbox("xDrawLabel", xDrawLabel)}
                checked={xDrawLabel}
              />
            </Col>
          </ColoredRow>
          <ColoredRow style={{ padding: "5px 1px" }} gutter={4}>
            <Col
              style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "0" }}
              span={2}
            >
              <RowLabel>Y AXIS</RowLabel>
            </Col>
            <Col
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "11%",
                marginBottom: "0"
              }}
              span={3}
            >
              <StyledTextField
                type="text"
                defaultValue="X"
                name="yAxisLabel"
                value={yAxisLabel}
                onChange={this.handleInputChange}
                disabled={false}
              />
            </Col>
            <Col
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "9%",
                marginBottom: "0"
              }}
              span={3}
            >
              <StyledTextField
                type="number"
                name="yMin"
                value={yMin}
                onChange={this.handleGridChange}
                onBlur={this.handleCanvasChange}
                disabled={false}
              />
            </Col>
            <Col
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "9%",
                marginBottom: "0"
              }}
              span={3}
            >
              <StyledTextField
                type="number"
                name="yMax"
                value={yMax}
                onChange={this.handleGridChange}
                onBlur={this.handleCanvasChange}
                disabled={false}
              />
            </Col>
            <Col
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: "0",
                width: "7%"
              }}
              span={2}
            >
              <StyledTextField
                type="number"
                defaultValue="1"
                name="yDistance"
                value={yDistance}
                onChange={this.handleInputChange}
                disabled={false}
              />
            </Col>
            <Col
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: "0",
                width: "7%"
              }}
              span={2}
            >
              <StyledTextField
                type="number"
                defaultValue="1"
                name="yTickDistance"
                value={yTickDistance}
                onChange={this.handleInputChange}
                disabled={false}
              />
            </Col>
            <Col
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: "0",
                width: "7%"
              }}
              span={2}
            >
              <StyledTextField
                type="number"
                name="yRatio"
                value={canvas.yRatio}
                onChange={this.handleRatioChange}
                disabled={false}
              />
            </Col>
            <Col
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "6%",
                marginBottom: "0"
              }}
              span={2}
            >
              <Checkbox
                name="yShowAxis"
                onChange={() => this.handleCheckbox("yShowAxis", yShowAxis)}
                checked={yShowAxis}
              />
            </Col>
            <Col
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "6%",
                marginBottom: "0"
              }}
              span={2}
            >
              <Checkbox
                name="drawLabelZero"
                onChange={() => this.handleCheckbox("yShowAxisLabel", yShowAxisLabel)}
                checked={yShowAxisLabel}
              />
            </Col>
            <Col
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "6%",
                marginBottom: "0"
              }}
              span={2}
            >
              <Checkbox
                name="drawLabelZero"
                onChange={() => this.handleCheckbox("yHideTicks", yHideTicks)}
                checked={yHideTicks}
              />
            </Col>
            <Col
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "6%",
                marginBottom: "0"
              }}
              span={2}
            >
              <Checkbox
                name="drawLabelZero"
                onChange={() => this.handleCheckbox("yMinArrow", yMinArrow)}
                checked={yMinArrow}
              />
            </Col>
            <Col
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "6%",
                marginBottom: "0"
              }}
              span={2}
            >
              <Checkbox
                name="drawLabelZero"
                onChange={() => this.handleCheckbox("yMaxArrow", yMaxArrow)}
                checked={yMaxArrow}
              />
            </Col>
            <Col
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "6%",
                marginBottom: "0"
              }}
              span={2}
            >
              <Checkbox
                name="drawLabelZero"
                onChange={() => this.handleCheckbox("yCommaInLabel", yCommaInLabel)}
                checked={yCommaInLabel}
              />
            </Col>
            <Col
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "6%",
                marginBottom: "0"
              }}
              span={2}
            >
              <Checkbox
                name="drawLabelZero"
                onChange={() => this.handleCheckbox("yDrawLabel", yDrawLabel)}
                checked={yDrawLabel}
              />
            </Col>
          </ColoredRow>

          {/* <Row gutter={8}>
            <Col span={8} />
            <Col span={4}>
              <Row type="flex" justify="center">
                <Label>AXIS X</Label>
              </Row>
            </Col>
            <Col span={4}>
              <Row type="flex" justify="center">
                <Label>AXIS Y</Label>
              </Row>
            </Col>
          </Row>
          <Row gutter={8} type="flex" align="middle">
            <Col span={8}>
              <Label>MIN</Label>
            </Col>
            <Col span={4}>
              <Row type="flex" justify="center">
                <MoreOptionsInputSmall
                  type="number"
                  name="xMin"
                  value={xMin}
                  onChange={this.handleGridChange}
                  onBlur={this.handleCanvasChange}
                />
              </Row>
            </Col>
            <Col span={4}>
              <Row type="flex" justify="center">
                <MoreOptionsInputSmall
                  type="number"
                  name="yMin"
                  value={yMin}
                  onChange={this.handleGridChange}
                  onBlur={this.handleCanvasChange}
                />
              </Row>
            </Col>
          </Row>
          <Row gutter={8} type="flex" align="middle">
            <Col span={8}>
              <Label>MAX</Label>
            </Col>
            <Col span={4}>
              <Row type="flex" justify="center">
                <MoreOptionsInputSmall
                  type="number"
                  name="xMax"
                  value={xMax}
                  onChange={this.handleGridChange}
                  onBlur={this.handleCanvasChange}
                />
              </Row>
            </Col>
            <Col span={4}>
              <Row type="flex" justify="center">
                <MoreOptionsInputSmall
                  type="number"
                  name="yMax"
                  value={yMax}
                  onChange={this.handleGridChange}
                  onBlur={this.handleCanvasChange}
                />
              </Row>
            </Col>
          </Row>
          <Row gutter={8} type="flex" align="middle">
            <Col span={8}>
              <Label>DISTANCE</Label>
            </Col>
            <Col span={4}>
              <Row type="flex" justify="center">
                <MoreOptionsInputSmall
                  type="number"
                  defaultValue="1"
                  name="xDistance"
                  value={xDistance}
                  onChange={this.handleInputChange}
                />
              </Row>
            </Col>
            <Col span={4}>
              <Row type="flex" justify="center">
                <MoreOptionsInputSmall
                  type="number"
                  defaultValue="1"
                  name="yDistance"
                  value={yDistance}
                  onChange={this.handleInputChange}
                />
              </Row>
            </Col>
          </Row>
          <Row gutter={8} type="flex" align="middle">
            <Col span={8}>
              <Label>TICK DISTANCE</Label>
            </Col>
            <Col span={4}>
              <Row type="flex" justify="center">
                <MoreOptionsInputSmall
                  type="number"
                  defaultValue="1"
                  name="xTickDistance"
                  value={xTickDistance}
                  onChange={this.handleInputChange}
                />
              </Row>
            </Col>
            <Col span={4}>
              <Row type="flex" justify="center">
                <MoreOptionsInputSmall
                  type="number"
                  defaultValue="1"
                  name="yTickDistance"
                  value={yTickDistance}
                  onChange={this.handleInputChange}
                />
              </Row>
            </Col>
          </Row>
          <Row gutter={8} type="flex" align="middle">
            <Col span={8}>
              <Label>RATIO</Label>
            </Col>
            <Col span={4}>
              <Row type="flex" justify="center">
                <MoreOptionsInputSmall
                  type="number"
                  name="xRatio"
                  value={canvas.xRatio}
                  onChange={this.handleRatioChange}
                />
              </Row>
            </Col>
            <Col span={4}>
              <Row type="flex" justify="center">
                <MoreOptionsInputSmall
                  type="number"
                  name="yRatio"
                  value={canvas.yRatio}
                  onChange={this.handleRatioChange}
                />
              </Row>
            </Col>
          </Row>
          <Row gutter={8} type="flex" align="middle">
            <Col span={8}>
              <Label>SHOW AXIS</Label>
            </Col>
            <Col span={4}>
              <Row type="flex" justify="center">
                <Checkbox
                  name="xShowAxis"
                  onChange={() => this.handleCheckbox("xShowAxis", xShowAxis)}
                  checked={xShowAxis}
                />
              </Row>
            </Col>
            <Col span={4}>
              <Row type="flex" justify="center">
                <Checkbox
                  name="yShowAxis"
                  onChange={() => this.handleCheckbox("yShowAxis", yShowAxis)}
                  checked={yShowAxis}
                />
              </Row>
            </Col>
          </Row>
          <Row gutter={8} type="flex" align="middle">
            <Col span={8}>
              <Label>SHOW AXIS LABEL</Label>
            </Col>
            <Col span={4}>
              <Row type="flex" justify="center">
                <Checkbox
                  name="drawLabelZero"
                  onChange={() => this.handleCheckbox("xShowAxisLabel", xShowAxisLabel)}
                  checked={xShowAxisLabel}
                />
              </Row>
              {xShowAxisLabel && (
                <Col md={24}>
                  <MoreOptionsInput
                    type="text"
                    defaultValue="X"
                    name="xAxisLabel"
                    value={xAxisLabel}
                    onChange={this.handleInputChange}
                  />
                </Col>
              )}
            </Col>
            <Col span={4}>
              <Row type="flex" justify="center">
                <Checkbox
                  name="drawLabelZero"
                  onChange={() => this.handleCheckbox("yShowAxisLabel", yShowAxisLabel)}
                  checked={yShowAxisLabel}
                />
              </Row>
              {yShowAxisLabel && (
                <Col md={24}>
                  <MoreOptionsInput
                    type="text"
                    defaultValue="X"
                    name="yAxisLabel"
                    value={yAxisLabel}
                    onChange={this.handleInputChange}
                  />
                </Col>
              )}
            </Col>
          </Row>
          <Row gutter={8} type="flex" align="middle">
            <Col span={8}>
              <Label>HIDE TICKS</Label>
            </Col>
            <Col span={4}>
              <Row type="flex" justify="center">
                <Checkbox
                  name="drawLabelZero"
                  onChange={() => this.handleCheckbox("xHideTicks", xHideTicks)}
                  checked={xHideTicks}
                />
              </Row>
            </Col>
            <Col span={4}>
              <Row type="flex" justify="center">
                <Checkbox
                  name="drawLabelZero"
                  onChange={() => this.handleCheckbox("yHideTicks", yHideTicks)}
                  checked={yHideTicks}
                />
              </Row>
            </Col>
          </Row>
          <Row gutter={8} type="flex" align="middle">
            <Col span={8}>
              <Label>DRAW LABELS</Label>
            </Col>
            <Col span={4}>
              <Row type="flex" justify="center">
                <Checkbox
                  name="drawLabelZero"
                  onChange={() => this.handleCheckbox("xDrawLabel", xDrawLabel)}
                  checked={xDrawLabel}
                />
              </Row>
            </Col>
            <Col span={4}>
              <Row type="flex" justify="center">
                <Checkbox
                  name="drawLabelZero"
                  onChange={() => this.handleCheckbox("yDrawLabel", yDrawLabel)}
                  checked={yDrawLabel}
                />
              </Row>
            </Col>
          </Row>
          <Row gutter={8} type="flex" align="middle">
            <Col span={8}>
              <Label>MIN ARROW</Label>
            </Col>
            <Col span={4}>
              <Row type="flex" justify="center">
                <Checkbox
                  name="drawLabelZero"
                  onChange={() => this.handleCheckbox("xMinArrow", xMinArrow)}
                  checked={xMinArrow}
                />
              </Row>
            </Col>
            <Col span={4}>
              <Row type="flex" justify="center">
                <Checkbox
                  name="drawLabelZero"
                  onChange={() => this.handleCheckbox("yMinArrow", yMinArrow)}
                  checked={yMinArrow}
                />
              </Row>
            </Col>
          </Row>
          <Row gutter={8} type="flex" align="middle">
            <Col span={8}>
              <Label>MAX ARROW</Label>
            </Col>
            <Col span={4}>
              <Row type="flex" justify="center">
                <Checkbox
                  name="drawLabelZero"
                  onChange={() => this.handleCheckbox("xMaxArrow", xMaxArrow)}
                  checked={xMaxArrow}
                />
              </Row>
            </Col>
            <Col span={4}>
              <Row type="flex" justify="center">
                <Checkbox
                  name="drawLabelZero"
                  onChange={() => this.handleCheckbox("yMaxArrow", yMaxArrow)}
                  checked={yMaxArrow}
                />
              </Row>
            </Col>
          </Row>
          <Row gutter={8} type="flex" align="middle"> */}
          {/* <Col span={8}>
              <Label>COMMA IN LABEL</Label>
            </Col>
            <Col span={4}>
              <Row type="flex" justify="center">
                <Checkbox
                  name="drawLabelZero"
                  onChange={() => this.handleCheckbox("xCommaInLabel", xCommaInLabel)}
                  checked={xCommaInLabel}
                />
              </Row>
            </Col>
            <Col span={4}>
              <Row type="flex" justify="center">
                <Checkbox
                  name="drawLabelZero"
                  onChange={() => this.handleCheckbox("yCommaInLabel", yCommaInLabel)}
                  checked={yCommaInLabel}
                />
              </Row>
            </Col>
          </Row> */}
        </Question>

        <Question
          section="advanced"
          label={t("component.graphing.graphControls")}
          cleanSections={cleanSections}
          fillSections={fillSections}
          advancedAreOpen={advancedAreOpen}
        >
          <Subtitle>{t("component.graphing.graphControls")}</Subtitle>
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
