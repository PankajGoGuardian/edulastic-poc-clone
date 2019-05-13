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
  Row,
  Col,
  MoreOptionsColumnContainer,
  MoreOptionsColumn
} from "../../common/styled_components";

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
        <QuestionSection section="advanced" label="SCORING" cleanSections={cleanSections} fillSections={fillSections}>
          <ScoreSettings scoringTypes={this.scoringTypes} setValidation={setValidation} graphData={graphData} />
        </QuestionSection>

        <QuestionSection section="advanced" label="LAYOUT" cleanSections={cleanSections} fillSections={fillSections}>
          <MoreOptionsContainer>
            <MoreOptionsSubHeading>{t("component.graphing.layoutoptionstitle")}</MoreOptionsSubHeading>

            <Row>
              <Col md={12}>
                <Row>
                  <Col md={6} style={{ paddingRight: 20 }}>
                    <MoreOptionsRow>
                      <MoreOptionsLabel>{t("component.options.orientation")}</MoreOptionsLabel>
                      <Select
                        style={{ width: "77%", height: "40px", marginTop: "11px" }}
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
                    </MoreOptionsRow>
                  </Col>
                  <Col md={6} style={{ paddingLeft: 20 }}>
                    {layout === "horizontal" && (
                      <MoreOptionsRow>
                        <MoreOptionsLabel>{t("component.graphing.layoutoptions.width")}</MoreOptionsLabel>
                        <MoreOptionsInput
                          type="text"
                          name="layout_width"
                          onChange={this.handleOptionsInputChange}
                          value={options.layout_width}
                        />
                      </MoreOptionsRow>
                    )}
                  </Col>
                </Row>
              </Col>

              {layout === "vertical" && (
                <Col md={12}>
                  <Row>
                    <Col md={6} style={{ paddingRight: 20 }}>
                      <MoreOptionsRow>
                        <MoreOptionsLabel>{t("component.graphing.layoutoptions.minWidth")}</MoreOptionsLabel>
                        <MoreOptionsInput
                          type="text"
                          name="minWidth"
                          onChange={this.handleInputChange}
                          value={minWidth}
                        />
                      </MoreOptionsRow>
                    </Col>
                    <Col md={6} style={{ paddingLeft: 20 }}>
                      <MoreOptionsRow>
                        <MoreOptionsLabel>{t("component.graphing.layoutoptions.height")}</MoreOptionsLabel>
                        <MoreOptionsInput
                          type="text"
                          name="layout_height"
                          onChange={this.handleOptionsInputChange}
                          value={options.layout_height}
                        />
                      </MoreOptionsRow>
                    </Col>
                  </Row>
                </Col>
              )}

              <Col md={12}>
                <Row>
                  <Col md={6} style={{ paddingRight: 20 }}>
                    <MoreOptionsRow>
                      <MoreOptionsLabel>{t("component.graphing.layoutoptions.linemargin")}</MoreOptionsLabel>
                      <MoreOptionsInput
                        type="text"
                        name="margin"
                        placeholder="0"
                        value={canvasConfig.margin === 0 ? null : canvasConfig.margin}
                        onChange={this.handleCanvasInputChange}
                      />
                    </MoreOptionsRow>
                    <MoreOptionsRow>
                      <Checkbox
                        label={t("component.graphing.layoutoptions.showMinArrow")}
                        onChange={() => this.handleNumberlineCheckboxChange("leftArrow", numberlineAxis.leftArrow)}
                        name="leftArrow"
                        checked={numberlineAxis.leftArrow}
                      />
                    </MoreOptionsRow>
                    <MoreOptionsRow>
                      <Checkbox
                        label={t("component.graphing.layoutoptions.stackResponses")}
                        name="stackResponses"
                        onChange={() =>
                          this.handleNumberlineCheckboxChange("stackResponses", numberlineAxis.stackResponses)
                        }
                        checked={numberlineAxis.stackResponses}
                      />
                    </MoreOptionsRow>
                  </Col>
                  <Col md={6} style={{ paddingLeft: 20 }}>
                    <MoreOptionsRow>
                      <MoreOptionsLabel>{t("component.graphing.layoutoptions.spacingBtwStacked")}</MoreOptionsLabel>
                      <MoreOptionsInput
                        type="text"
                        name="stackResponsesSpacing"
                        placeholder="0"
                        onChange={this.handleNumberlineInputChange}
                        value={numberlineAxis.stackResponsesSpacing === 0 ? null : numberlineAxis.stackResponsesSpacing}
                      />
                    </MoreOptionsRow>
                    <MoreOptionsRow>
                      <Checkbox
                        label={t("component.graphing.layoutoptions.showMaxArrow")}
                        onChange={() => this.handleNumberlineCheckboxChange("rightArrow", numberlineAxis.rightArrow)}
                        name="rightArrow"
                        checked={numberlineAxis.rightArrow}
                      />
                    </MoreOptionsRow>
                    <MoreOptionsRow>
                      <MoreOptionsLabel>{t("component.graphing.layoutoptions.fontSize")}</MoreOptionsLabel>
                      <Select
                        data-cy="fontSize"
                        style={{ width: "77%", height: "40px", marginTop: "11px" }}
                        onChange={this.changeFontSize}
                        value={this.getFontSizeItem().label}
                      >
                        {fontSizeList.map(option => (
                          <Select.Option data-cy={option.id} key={option.value}>
                            {t(option.label)}
                          </Select.Option>
                        ))}
                      </Select>
                    </MoreOptionsRow>
                  </Col>
                </Row>
              </Col>
            </Row>
          </MoreOptionsContainer>
        </QuestionSection>

        <QuestionSection section="advanced" label="TOOLBAR" cleanSections={cleanSections} fillSections={fillSections}>
          <SegmentsToolsSettings onChange={setControls} toolbar={toolbar} />
        </QuestionSection>

        <QuestionSection section="advanced" label="TICKS" cleanSections={cleanSections} fillSections={fillSections}>
          <MoreOptionsContainer>
            <MoreOptionsSubHeading>{t("component.graphing.ticksoptionstitle")}</MoreOptionsSubHeading>

            <MoreOptionsColumnContainer>
              <MoreOptionsColumn>
                <MoreOptionsRow>
                  <Checkbox
                    label={t("component.graphing.ticksoptions.showticks")}
                    name="showTicks"
                    onChange={() => this.handleNumberlineCheckboxChange("showTicks", numberlineAxis.showTicks)}
                    checked={numberlineAxis.showTicks}
                  />
                </MoreOptionsRow>
                <MoreOptionsRow>
                  <Checkbox
                    label={t("component.graphing.labelsoptions.showmax")}
                    name="showMax"
                    onChange={() => this.handleNumberlineCheckboxChange("showMax", numberlineAxis.showMax)}
                    checked={numberlineAxis.showMax}
                  />
                </MoreOptionsRow>
              </MoreOptionsColumn>
              <MoreOptionsColumn>
                <MoreOptionsRow>
                  <Checkbox
                    label={t("component.graphing.labelsoptions.showmin")}
                    name="showMin"
                    onChange={() => this.handleNumberlineCheckboxChange("showMin", numberlineAxis.showMin)}
                    checked={numberlineAxis.showMin}
                  />
                </MoreOptionsRow>
                <MoreOptionsRow>
                  <MoreOptionsLabel>{t("component.graphing.ticksoptions.tickdistance")}</MoreOptionsLabel>
                  <MoreOptionsInput
                    type="number"
                    name="ticksDistance"
                    onChange={this.handleNumberlineInputChange}
                    value={numberlineAxis.ticksDistance}
                  />
                </MoreOptionsRow>
              </MoreOptionsColumn>
            </MoreOptionsColumnContainer>
            <MoreOptionsColumnContainer style={{ marginTop: 20 }}>
              <MoreOptionsColumn>
                <MoreOptionsRow>
                  <MoreOptionsLabel>{t("component.graphing.ticksoptions.minorTicks")}</MoreOptionsLabel>
                  <MoreOptionsInput
                    type="text"
                    name="minorTicks"
                    onChange={this.handleNumberlineInputChange}
                    value={numberlineAxis.minorTicks}
                  />
                </MoreOptionsRow>
              </MoreOptionsColumn>

              <MoreOptionsColumn>
                <MoreOptionsRow>
                  <MoreOptionsLabel>{t("component.graphing.ticksoptions.renderingbase")}</MoreOptionsLabel>
                  <Select
                    style={{ width: "77%", height: "40px", marginTop: "11px" }}
                    onChange={this.changeRenderingBase}
                    value={currentRenderingBaseItem.value}
                  >
                    {renderingBaseList.map(option => (
                      <Select.Option data-cy={option.value} key={option.value}>
                        {t(option.label)}
                      </Select.Option>
                    ))}
                  </Select>
                </MoreOptionsRow>
              </MoreOptionsColumn>
            </MoreOptionsColumnContainer>
          </MoreOptionsContainer>
        </QuestionSection>

        <QuestionSection section="advanced" label="LABELS" cleanSections={cleanSections} fillSections={fillSections}>
          <MoreOptionsContainer>
            <MoreOptionsSubHeading>{t("component.graphing.labelstitle")}</MoreOptionsSubHeading>

            <MoreOptionsColumnContainer>
              <MoreOptionsColumn>
                <MoreOptionsRow>
                  <Checkbox
                    label={t("component.graphing.labelsoptions.showLabels")}
                    name="showLabels"
                    onChange={() => this.handleNumberlineCheckboxChange("showLabels", numberlineAxis.showLabels)}
                    checked={numberlineAxis.showLabels}
                  />
                </MoreOptionsRow>
                <MoreOptionsRow>
                  <Checkbox
                    label={t("component.graphing.labelsoptions.showmax")}
                    name="labelShowMax"
                    onChange={() => this.handleNumberlineCheckboxChange("labelShowMax", numberlineAxis.labelShowMax)}
                    checked={numberlineAxis.labelShowMax}
                  />
                </MoreOptionsRow>
              </MoreOptionsColumn>

              <MoreOptionsColumn>
                <MoreOptionsRow>
                  <Checkbox
                    label={t("component.graphing.labelsoptions.showmin")}
                    name="labelShowMin"
                    onChange={() => this.handleNumberlineCheckboxChange("labelShowMin", numberlineAxis.labelShowMin)}
                    checked={numberlineAxis.labelShowMin}
                  />
                </MoreOptionsRow>
                <MoreOptionsRow>
                  <MoreOptionsLabel>{t("component.graphing.labelsoptions.displayspecificpoints")}</MoreOptionsLabel>
                  <MoreOptionsInput
                    type="text"
                    name="specificPoints"
                    onChange={this.handleNumberlineInputChange}
                    value={numberlineAxis.specificPoints}
                  />
                </MoreOptionsRow>
              </MoreOptionsColumn>
            </MoreOptionsColumnContainer>
          </MoreOptionsContainer>
        </QuestionSection>
        <QuestionSection
          section="advanced"
          label={t("component.options.extras")}
          cleanSections={cleanSections}
          fillSections={fillSections}
          marginLast={0}
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
