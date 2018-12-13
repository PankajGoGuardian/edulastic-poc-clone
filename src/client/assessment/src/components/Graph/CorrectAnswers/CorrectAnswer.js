import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from '@edulastic/localization';
import { Header, PointField } from './styled_components';
import { GraphQuadrantsDisplay } from '../Display';

class CorrectAnswer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      responseScore: props.response && props.response.score,
    };
  }

  updateScore = (e) => {
    const { onUpdatePoints } = this.props;
    if (e.target.value < 0) e.target.value = 0;
    this.setState({ responseScore: e.target.value });
    onUpdatePoints(parseFloat(e.target.value, 10));
  };

  setResponseValue = (val) => {
    const { onUpdateValidationValue } = this.props;
    onUpdateValidationValue(val);
  };

  render() {
    const { t, stimulus, response, uiStyle, canvasConfig, tools, bgImgOptions, backgroundShapes } = this.props;
    const { responseScore } = this.state;
    return (
      <div>
        <Header>
          <PointField
            type="number"
            value={responseScore}
            onChange={this.updateScore}
            onBlur={this.updateScore}
            disabled={false}
            min={0}
            step={0.5}
          />
          <span>{t('component.correctanswers.points')}</span>
        </Header>
        <GraphQuadrantsDisplay
          question={stimulus}
          uiStyle={uiStyle}
          canvasConfig={canvasConfig}
          tools={tools}
          bgImgOptions={bgImgOptions}
          elements={response.value}
          onChange={this.setResponseValue}
          backgroundShapes={backgroundShapes}
        />
      </div>
    );
  }
}

CorrectAnswer.propTypes = {
  onUpdatePoints: PropTypes.func.isRequired,
  onUpdateValidationValue: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  uiStyle: PropTypes.object.isRequired,
  response: PropTypes.object.isRequired,
  canvasConfig: PropTypes.object.isRequired,
  tools: PropTypes.array.isRequired,
  bgImgOptions: PropTypes.object.isRequired,
  backgroundShapes: PropTypes.array,
};

CorrectAnswer.defaultProps = {
  backgroundShapes: [],
};

export default withNamespaces('assessment')(CorrectAnswer);
