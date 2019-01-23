import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withNamespaces } from '@edulastic/localization';
import { PaddingDiv } from '@edulastic/common';
import {
  Col, Label, Row,
  StyledTextarea, StyledTextField,
  Subtitle, TitleTextInput
} from '../common/styled_components';
import { setQuestionDataAction } from '../../../../../author/src/actions/question';

class AxisSegments extends Component {
  constructor(props) {
    super(props);
    const { stimulus } = props.graphData;
    this.state = {
      stimulus,
      title: '',
      stacked_elements: 2
    };
  }

  updateTitle = e => this.setState({ title: e.target.value })

  updateStimulus = e => this.setState({ stimulus: e.target.value })

  handleCanvasChange = (event) => {
    const { target: { name, value } } = event;

    const { canvas, setCanvas } = this.props;
    setCanvas({ ...canvas, [name]: value });
  }

  handleInputChange = (event) => {
    const { target: { type, checked, value: targetValue, name } } = event;
    const value = type === 'checkbox' ? checked : targetValue;

    this.setState({ [name]: value });
  };

  render() {
    const {
      stimulus,
      title
    } = this.state;
    const { t, canvas } = this.props;
    return (
      <div>
        <Subtitle>{t('component.graphing.question.composequestion')}</Subtitle>
        <StyledTextarea
          placeholder={t('component.graphing.question.enteryourquestion')}
          name="stimulus"
          onChange={this.updateStimulus}
          value={stimulus}
        />
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
                value={title}
                onChange={this.updateTitle}
                onBlur={this.updateTitle}
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
      </div>
    );
  }
}

AxisSegments.propTypes = {
  t: PropTypes.func.isRequired,
  graphData: PropTypes.object.isRequired
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
