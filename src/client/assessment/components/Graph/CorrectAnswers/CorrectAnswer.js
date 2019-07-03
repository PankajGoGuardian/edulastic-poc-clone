import React, { Component } from "react";
import PropTypes from "prop-types";
import { withNamespaces } from "@edulastic/localization";
import { Header, PointField } from "./styled_components";
import QuadrantsPointField from "../common/QuadrantsPointField";
import { GraphDisplay } from "../Display";

class CorrectAnswer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      responseScore: props.response && props.response.score
    };
  }

  updateScore = e => {
    const { onUpdatePoints } = this.props;
    if (e.target.value < 0) e.target.value = 0;
    this.setState({ responseScore: e.target.value });
    onUpdatePoints(parseFloat(e.target.value, 10));
  };

  setResponseValue = val => {
    const { onUpdateValidationValue } = this.props;
    onUpdateValidationValue(val);
  };

  render() {
    const { response, graphData, previewTab, view, disableResponse } = this.props;
    const { responseScore } = this.state;
    const PointFieldWithContext = QuadrantsPointField(PointField);

    return (
      <div>
        <Header>
          <PointFieldWithContext
            type="number"
            value={responseScore}
            onChange={this.updateScore}
            onBlur={this.updateScore}
            disabled={false}
            min={0}
            step={0.5}
          />
        </Header>
        <GraphDisplay
          disableResponse={disableResponse}
          view={view}
          previewTab={previewTab}
          graphData={graphData}
          altAnswerId={response.id}
          elements={response.value}
          onChange={this.setResponseValue}
        />
      </div>
    );
  }
}

CorrectAnswer.propTypes = {
  graphData: PropTypes.object.isRequired,
  onUpdatePoints: PropTypes.func.isRequired,
  onUpdateValidationValue: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  response: PropTypes.object.isRequired,
  previewTab: PropTypes.string.isRequired,
  view: PropTypes.string.isRequired,
  disableResponse: PropTypes.bool
};

CorrectAnswer.defaultProps = {
  disableResponse: false
};

export default withNamespaces("assessment")(CorrectAnswer);
