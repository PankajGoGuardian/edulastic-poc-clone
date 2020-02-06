import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { cloneDeep, isEqual } from "lodash";

import { withNamespaces } from "@edulastic/localization";
import { Checkbox } from "@edulastic/common";
import { secondaryTextColor } from "@edulastic/colors";

import { Input } from "../styled/Input";
import { Row } from "../styled/Row";
import { Separator } from "../styled/Separator";
import { MinMaxSeparator } from "../styled/MinMaxSeparator";
import { IconAllArrows } from "../styled/IconAllArrows";
import { IconMaxArrows } from "../styled/IconMaxArrows";
import { IconWrapper } from "../styled/IconWrapper";
import { Label } from "../styled/Label";
import { CheckboxLabel } from "../../../../../styled/CheckboxWithLabel";
import { TextInputStyled } from "../../../../../styled/InputStyles";

class Settings extends Component {
  constructor(props) {
    super(props);

    const {
      graphData: {
        canvas: { xMax, xMin, yMax, yMin },
        uiStyle: {
          xShowAxis = true,
          yShowAxis = true,
          xAxisLabel,
          yAxisLabel,
          xDistance,
          yDistance,
          xShowAxisLabel,
          yShowAxisLabel,
          xMaxArrow,
          xMinArrow,
          yMaxArrow,
          yMinArrow
        }
      }
    } = props;

    this.state = {
      xMax,
      xMin,
      yMax,
      yMin,
      xShowAxis,
      yShowAxis,
      xAxisLabel,
      yAxisLabel,
      xDistance,
      yDistance,
      xShowAxisLabel,
      yShowAxisLabel,
      xMaxArrow,
      xMinArrow,
      yMaxArrow,
      yMinArrow
    };
  }

  componentDidUpdate(prevProps) {
    const {
      graphData: { canvas, uiStyle }
    } = this.props;

    if (
      prevProps.graphData &&
      (!isEqual(canvas, prevProps.graphData.canvas) || !isEqual(uiStyle, prevProps.graphData.uiStyle))
    ) {
      this.updateState();
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  updateState = () => {
    const {
      graphData: {
        canvas: { xMax, xMin, yMax, yMin },
        uiStyle: {
          xShowAxis = true,
          yShowAxis = true,
          xAxisLabel,
          yAxisLabel,
          xDistance,
          yDistance,
          xShowAxisLabel,
          yShowAxisLabel,
          xMaxArrow,
          xMinArrow,
          yMaxArrow,
          yMinArrow
        }
      }
    } = this.props;

    this.setState({
      xMax,
      xMin,
      yMax,
      yMin,
      xShowAxis,
      yShowAxis,
      xAxisLabel,
      yAxisLabel,
      xDistance,
      yDistance,
      xShowAxisLabel,
      yShowAxisLabel,
      xMaxArrow,
      xMinArrow,
      yMaxArrow,
      yMinArrow
    });
  };

  saveData = () => {
    const { graphData, setQuestionData } = this.props;
    const {
      xMax,
      xMin,
      yMax,
      yMin,
      xShowAxis,
      yShowAxis,
      xAxisLabel,
      yAxisLabel,
      xDistance,
      yDistance,
      xShowAxisLabel,
      yShowAxisLabel,
      xMaxArrow,
      xMinArrow,
      yMaxArrow,
      yMinArrow
    } = this.state;

    const newGraphData = cloneDeep(graphData);

    newGraphData.canvas = { ...newGraphData.canvas, xMax, xMin, yMax, yMin };
    newGraphData.uiStyle = {
      ...newGraphData.uiStyle,
      xShowAxis,
      yShowAxis,
      xAxisLabel,
      yAxisLabel,
      xDistance,
      yDistance,
      xTickDistance: xDistance,
      yTickDistance: yDistance,
      xShowAxisLabel,
      yShowAxisLabel,
      xMaxArrow,
      xMinArrow,
      yMaxArrow,
      yMinArrow
    };

    setQuestionData(newGraphData);
  };

  handleCheckbox = (name, checked) => {
    this.setState({ [name]: !checked });

    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.saveData();
      clearTimeout(this.timer);
    }, 50);
  };

  handleInputChange = (name, e) => {
    const {
      target: { value }
    } = e;
    const { xShowAxisLabel, yShowAxisLabel } = this.state;

    this.setState({
      [name]: value,
      xShowAxisLabel: name === "xAxisLabel" ? true : xShowAxisLabel,
      yShowAxisLabel: name === "yAxisLabel" ? true : yShowAxisLabel
    });

    clearTimeout(this.timer);

    if (["xMax", "xMin", "yMax", "yMin", "xDistance", "yDistance"].includes(name) && !value.length) {
      return;
    }

    if (["xDistance", "yDistance"].includes(name) && value <= 0) {
      return;
    }

    this.timer = setTimeout(() => {
      this.saveData();
      clearTimeout(this.timer);
    }, 600);
  };

  allArrowsAreVisible = () => {
    const { xMaxArrow, xMinArrow, yMaxArrow, yMinArrow } = this.state;
    return xMaxArrow && xMinArrow && yMaxArrow && yMinArrow;
  };

  maxArrowsAreVisible = () => {
    const { xMaxArrow, xMinArrow, yMaxArrow, yMinArrow } = this.state;
    return xMaxArrow && !xMinArrow && yMaxArrow && !yMinArrow;
  };

  handleAllArrowsClick = () => {
    this.setState({
      xMaxArrow: true,
      xMinArrow: true,
      yMaxArrow: true,
      yMinArrow: true
    });

    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.saveData();
      clearTimeout(this.timer);
    }, 50);
  };

  handleMaxArrowsClick = () => {
    this.setState({
      xMaxArrow: true,
      xMinArrow: false,
      yMaxArrow: true,
      yMinArrow: false
    });

    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.saveData();
      clearTimeout(this.timer);
    }, 50);
  };

  render() {
    const { t } = this.props;
    const { xMax, xMin, yMax, yMin, xShowAxis, yShowAxis, xAxisLabel, yAxisLabel, xDistance, yDistance } = this.state;

    return (
      <Container>
        <Row style={{ width: 0 }}>
          <Label style={{ marginRight: "15px" }}>{t("component.graphing.settingsPopup.arrows")}</Label>
          <IconWrapper selected={this.allArrowsAreVisible()} onClick={() => this.handleAllArrowsClick()}>
            <IconAllArrows />
          </IconWrapper>
          <IconWrapper selected={this.maxArrowsAreVisible()} onClick={() => this.handleMaxArrowsClick()}>
            <IconMaxArrows />
          </IconWrapper>
        </Row>
        <Separator />
        <Row style={{ marginBottom: "15px" }}>
          <CheckboxLabel
            name="xShowAxis"
            onChange={() => this.handleCheckbox("xShowAxis", xShowAxis)}
            checked={xShowAxis}
            labelPadding="0px 10px"
          >
            {t("component.graphing.settingsPopup.xAxis")}
          </CheckboxLabel>
          <TextInputStyled
            type="text"
            width="170px"
            height="30px"
            name="xAxisLabel"
            value={xAxisLabel}
            placeholder={t("component.graphing.settingsPopup.addLabel")}
            onChange={e => this.handleInputChange("xAxisLabel", e)}
          />
        </Row>
        <Row style={{ marginBottom: "20px" }}>
          <TextInputStyled
            type="number"
            width="60px"
            height="30px"
            name="xMin"
            value={xMin}
            placeholder={t("component.graphing.settingsPopup.min")}
            onChange={e => this.handleInputChange("xMin", e)}
          />
          <MinMaxSeparator>x</MinMaxSeparator>
          <TextInputStyled
            type="number"
            width="60px"
            height="30px"
            name="xMax"
            value={xMax}
            placeholder={t("component.graphing.settingsPopup.max")}
            onChange={e => this.handleInputChange("xMax", e)}
          />
          <TextInputStyled
            type="number"
            width="92px"
            height="30px"
            margin="0px 0px 0px 18px"
            name="xDistance"
            value={xDistance}
            placeholder={t("component.graphing.settingsPopup.step")}
            onChange={e => this.handleInputChange("xDistance", e)}
          />
        </Row>
        <Row style={{ marginBottom: "15px" }}>
          <CheckboxLabel
            name="yShowAxis"
            onChange={() => this.handleCheckbox("yShowAxis", yShowAxis)}
            checked={yShowAxis}
            labelPadding="0px 10px"
          >
            {t("component.graphing.settingsPopup.yAxis")}
          </CheckboxLabel>
          <TextInputStyled
            type="text"
            width="170px"
            height="30px"
            name="yAxisLabel"
            value={yAxisLabel}
            placeholder={t("component.graphing.settingsPopup.addLabel")}
            onChange={e => this.handleInputChange("yAxisLabel", e)}
          />
        </Row>
        <Row>
          <TextInputStyled
            type="number"
            width="60px"
            height="30px"
            name="yMin"
            value={yMin}
            placeholder={t("component.graphing.settingsPopup.min")}
            onChange={e => this.handleInputChange("yMin", e)}
          />
          <MinMaxSeparator>x</MinMaxSeparator>
          <TextInputStyled
            type="number"
            width="60px"
            height="30px"
            name="yMax"
            value={yMax}
            placeholder={t("component.graphing.settingsPopup.max")}
            onChange={e => this.handleInputChange("yMax", e)}
          />
          <TextInputStyled
            type="number"
            width="92px"
            height="30px"
            margin="0px 0px 0px 18px"
            name="yDistance"
            value={yDistance}
            placeholder={t("component.graphing.settingsPopup.step")}
            onChange={e => this.handleInputChange("yDistance", e)}
          />
        </Row>
      </Container>
    );
  }
}

Settings.propTypes = {
  t: PropTypes.func.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  graphData: PropTypes.object.isRequired
};

export default withNamespaces("assessment")(Settings);

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px 18px 29px;
  color: ${secondaryTextColor};
`;
