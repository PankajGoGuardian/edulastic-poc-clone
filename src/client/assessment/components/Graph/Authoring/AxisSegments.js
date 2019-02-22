import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withNamespaces } from '@edulastic/localization';
import { PaddingDiv } from '@edulastic/common';
import {
  Col, Label, Row,
  StyledTextField,
  Subtitle, TitleTextInput
} from '../common/styled_components';
import { QuestionSection } from './'
import { setQuestionDataAction } from '../../../../author/src/actions/question';
import QuestionTextArea from '../../QuestionTextArea';

class AxisSegments extends Component {
  onChangeQuestion = (stimulus) => {
    const { graphData, setQuestionData } = this.props;
    setQuestionData({ ...graphData, stimulus });
  };

  handleCanvasChange = (event) => {
    const { value, name } = event.target;
    const { graphData, setQuestionData } = this.props;
    const { canvas } = graphData;

    canvas[name] = value;
    setQuestionData({ ...graphData, canvas });
  };

  handleInputChange = (event) => {
    const { target: { type, checked, value: targetValue, name } } = event;
    const value = type === 'checkbox' ? checked : targetValue;

    this.setState({ [name]: value });
  };

  render() {
    const { t, graphData, fillSections, cleanSections } = this.props;
    const { canvas, stimulus } = graphData;

    return (
      <div>
        <QuestionSection section="main" label="COMPOSE QUESTION" cleanSections={cleanSections} fillSections={fillSections}>
          <Subtitle>{t('component.graphing.question.composequestion')}</Subtitle>
          <QuestionTextArea
            placeholder={t('component.graphing.question.enteryourquestion')}
            onChange={this.onChangeQuestion}
            value={stimulus}
          />
        </QuestionSection>
        <QuestionSection  section="main" label="GRAPH PARAMETERS" cleanSections={cleanSections} fillSections={fillSections}>
          <PaddingDiv top={30} bottom={30}>
            <Subtitle>{t('component.graphing.graphline')}</Subtitle>
            <Row>
              <Col md={6}>
                <Label>{t('component.graphing.minVal')}</Label>
                <StyledTextField
                  type="number"
                  name="x_min"
                  value={canvas.x_min}
                  onChange={this.handleCanvasChange}
                  disabled={false}
                  step={1}
                />
                <Label>{t('component.graphing.title')}</Label>
                <TitleTextInput
                  type="text"
                  name="title"
                  value={canvas.title}
                  onChange={this.handleCanvasChange}
                />
              </Col>
              <Col md={6} style={{ paddingLeft: 30 }}>
                <div>
                  <Label>{t('component.graphing.maxVal')}</Label>
                  <StyledTextField
                    type="number"
                    name="x_max"
                    value={canvas.x_max}
                    onChange={this.handleCanvasChange}
                    disabled={false}
                    step={1}
                  />
                </div>
                <div>
                  <Label>{t('component.graphing.responseNumAllowed')}</Label>
                  <StyledTextField
                    type="number"
                    name="responsesAllowed"
                    value={canvas.responsesAllowed}
                    onChange={this.handleCanvasChange}
                    disabled={false}
                    step={1}
                    min={1}
                  />
                </div>
              </Col>
            </Row>
          </PaddingDiv>
        </QuestionSection>
      </div>
    );
  }
}

AxisSegments.propTypes = {
  t: PropTypes.func.isRequired,
  graphData: PropTypes.object.isRequired,
  setQuestionData: PropTypes.func.isRequired
};

const enhance = compose(
  withNamespaces('assessment'),
  connect(
    null,
    {
      setQuestionData: setQuestionDataAction
    },
  ),
);

export default enhance(AxisSegments);
