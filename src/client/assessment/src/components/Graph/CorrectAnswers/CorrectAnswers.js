import React, { Component } from 'react';
import { Button } from '@edulastic/common';
import { IconPlus } from '@edulastic/icons';
import { white } from '@edulastic/colors';
import { compose } from 'redux';
import { withNamespaces } from '@edulastic/localization';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { cloneDeep } from 'lodash';
import { Tabs, Tab, TabContainer } from '@edulastic/common';
import { Subtitle } from '../common/styled_components';
import { getQuestionDataSelector } from '../../../../../author/src/selectors/question';
import { setQuestionDataAction } from '../../../../../author/src/actions/question';
import CorrectAnswer from './CorrectAnswer';

class CorrectAnswers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
    };
  }

  handleTabChange = (value) => {
    this.setState({ value });
  };

  renderAltResponses = () => {
    const { validation, t } = this.props;

    if (validation.alt_responses && validation.alt_responses.length) {
      return validation.alt_responses.map((res, i) => (
        <Tab key={i} label={`${t('component.correctanswers.alternate')} ${i + 1}`} />
      ));
    }
    return null;
  };

  renderPlusButton = () => {
    const { onAddAltResponses, validation } = this.props;

    return (
      <Button
        style={{ minWidth: 70, minHeight: 25 }}
        icon={<IconPlus color={white} width={10} height={10} />}
        onClick={() => {
          this.handleTabChange(validation.alt_responses.length + 1);
          onAddAltResponses();
        }}
        color="primary"
        variant="extendedFab"
      />
    );
  };

  handleUpdateCorrectScore = (points) => {
    const { question, setQuestionData } = this.props;
    const newData = cloneDeep(question);

    newData.validation.valid_response.score = points;

    setQuestionData(newData);
  };

  updateValidationValue = (value) => {
    const { question, setQuestionData } = this.props;
    const { validation } = question;
    validation.valid_response.value = value;
    setQuestionData({ ...question, validation });
  };

  updateAltValidationValue = (value, tabIndex) => {
    const { question, setQuestionData } = this.props;
    const { validation } = question;
    validation.alt_responses[tabIndex].value = value;
    setQuestionData({ ...question, validation });
  };

  handleUpdateAltValidationScore = i => (points) => {
    const { question, setQuestionData } = this.props;
    const newData = cloneDeep(question);

    newData.validation.alt_responses[i].score = points;

    setQuestionData(newData);
  };

  render() {
    const {
      validation,
      stimulus,
      tools,
      t,
      uiStyle,
      canvasConfig,
      bgImgOptions,
      backgroundShapes,
    } = this.props;
    const { value } = this.state;

    return (
      <div>
        <Subtitle>{t('component.correctanswers.setcorrectanswers')}</Subtitle>
        <div>
          <Tabs value={value} onChange={this.handleTabChange} extra={this.renderPlusButton()}>
            <Tab label={t('component.correctanswers.correct')} />
            {this.renderAltResponses()}
          </Tabs>
          {value === 0 && (
            <TabContainer>
              <CorrectAnswer
                uiStyle={uiStyle}
                canvasConfig={canvasConfig}
                tools={tools}
                response={validation.valid_response}
                stimulus={stimulus}
                onUpdateValidationValue={this.updateValidationValue}
                onUpdatePoints={this.handleUpdateCorrectScore}
                bgImgOptions={bgImgOptions}
                backgroundShapes={backgroundShapes}
              />
            </TabContainer>
          )}
          {validation.alt_responses &&
          !!validation.alt_responses.length &&
          validation.alt_responses.map((alter, i) => {
            if (i + 1 === value) {
              return (
                <TabContainer key={i}>
                  <CorrectAnswer
                    uiStyle={uiStyle}
                    canvasConfig={canvasConfig}
                    tools={tools}
                    response={alter}
                    stimulus={stimulus}
                    onUpdateValidationValue={value =>
                      this.updateAltValidationValue(value, i)
                   }
                    onUpdatePoints={this.handleUpdateAltValidationScore(i)}
                    bgImgOptions={bgImgOptions}
                    backgroundShapes={backgroundShapes}
                  />
                </TabContainer>
              );
            }
            return null;
          })}
        </div>
      </div>
    );
  }
}

CorrectAnswers.propTypes = {
  onAddAltResponses: PropTypes.func.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  validation: PropTypes.object,
  t: PropTypes.func.isRequired,
  stimulus: PropTypes.string,
  question: PropTypes.object.isRequired,
  uiStyle: PropTypes.object.isRequired,
  canvasConfig: PropTypes.object.isRequired,
  tools: PropTypes.array.isRequired,
  bgImgOptions: PropTypes.object.isRequired,
  backgroundShapes: PropTypes.array,
};

CorrectAnswers.defaultProps = {
  stimulus: '',
  validation: {},
  backgroundShapes: [],
};

const enhance = compose(
  withNamespaces('assessment'),
  connect(
    state => ({
      question: getQuestionDataSelector(state),
    }),
    { setQuestionData: setQuestionDataAction },
  ),
);

export default enhance(CorrectAnswers);
