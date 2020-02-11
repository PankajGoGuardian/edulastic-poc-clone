import React, { Component } from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import { Radio } from "antd";

import { withNamespaces } from "@edulastic/localization";

import { Row } from "../../../styled/WidgetOptions/Row";
import { Col } from "../../../styled/WidgetOptions/Col";
import { InnerTitle } from "../../../styled/InnerTitle";
import { RadioLabel } from "../../../styled/RadioWithLabel";

class GraphToolsParams extends Component {
  getDrawingPromptOptions = () => {
    const { t } = this.props;
    return [
      { value: "byObjects", label: t("component.graphing.withObjects") },
      { value: "byTools", label: t("component.graphing.withDrawingTools") }
    ];
  };

  handleSelectDrawingPrompt = e => {
    const { toolbar, setToolbar } = this.props;
    const {
      target: { value }
    } = e;

    setToolbar({
      ...toolbar,
      drawingPrompt: value
    });
  };

  changeLabel = e => {
    this.props.changeLabel(e.target.name, e.target.value);
  };

  render() {
    const {
      t,
      toolbar: { drawingPrompt }
    } = this.props;
    const drawingObjects = this.props.toolbar.drawingObjects;

    return (
      <React.Fragment>
        <Row>
          <Col md={24} marginBottom="0px">
            <InnerTitle innerText={t("component.graphing.drawingprompt")} />
            <Radio.Group value={drawingPrompt} onChange={this.handleSelectDrawingPrompt} data-cy="drawingPrompt">
              {this.getDrawingPromptOptions().map(({ value, label }) => (
                <RadioLabel width="100%" mb="10px" value={value} key={value}>
                  {label}
                </RadioLabel>
              ))}
            </Radio.Group>
          </Col>
        </Row>
        {drawingPrompt == "byObjects" ? (
          <div>
            {drawingObjects &&
              drawingObjects.map((obj, i) => (
                <div key={i}>
                  <span>
                    {obj.type.charAt(0).toUpperCase() + obj.type.slice(1)}{" "}
                    {obj.pointLabels && obj.pointLabels.map((point, i) => point.label)}
                  </span>
                  <input
                    value={typeof obj.label === "boolean" ? "" : obj.label}
                    onChange={this.changeLabel}
                    name={obj.id}
                  />
                </div>
              ))}
          </div>
        ) : (
          ""
        )}
      </React.Fragment>
    );
  }
}

GraphToolsParams.propTypes = {
  t: PropTypes.func.isRequired,
  toolbar: PropTypes.object,
  setToolbar: PropTypes.func.isRequired
};

GraphToolsParams.defaultProps = {
  toolbar: {
    defaultTool: "",
    tools: [],
    drawingPrompt: "byTools"
  }
};

const enhance = compose(withNamespaces("assessment"));

export default enhance(GraphToolsParams);
