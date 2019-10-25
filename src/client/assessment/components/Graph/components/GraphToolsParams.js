import React, { Component } from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import { Radio } from "antd";

import { withNamespaces } from "@edulastic/localization";

import { Row } from "../../../styled/WidgetOptions/Row";
import { Col } from "../../../styled/WidgetOptions/Col";
import { Label } from "../../../styled/WidgetOptions/Label";

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

  render() {
    const {
      t,
      toolbar: { drawingPrompt }
    } = this.props;

    return (
      <React.Fragment>
        <Row gutter={60} marginTop={15}>
          <Col md={24}>
            <Label>{t("component.graphing.drawingprompt")}</Label>
            <Radio.Group value={drawingPrompt} onChange={this.handleSelectDrawingPrompt} data-cy="drawingPrompt">
              {this.getDrawingPromptOptions().map(({ value, label }) => (
                <Radio value={value} key={value}>
                  {label}
                </Radio>
              ))}
            </Radio.Group>
          </Col>
        </Row>
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
