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
import AxisSegmentsOptions from './AxisSegmentsOptions/index';

class AxisSegments extends Component {
  constructor(props) {
    super(props);
    const { stimulus } = props.graphData;
    this.state = {
      stimulus,
      title: '',
      stacked_elements: 2,
      line: {
        max: 10,
        min: -10,
        right_arrow: true,
        left_arrow: true
      },
      isMoreOptionsOpen: false
    };
  }

  handleInputChange = (event) => {
    const { target: { type, checked, value: targetValue, name } } = event;
    const value = type === 'checkbox' ? checked : targetValue;

    this.setState({ [name]: value });
  };

  handleLineChange = (event) => {
    const { value, name } = event.target;
    const { line } = this.state;

    line[name] = value;
    this.setState({ line });
  };

  onClickMoreOptions = (isClicked) => {
    this.setState({
      isMoreOptionsOpen: isClicked
    });
  };

  getFontSizeList = () => (
    [
      { value: '', label: '' },
      { value: 'small', label: 'Small' },
      { value: 'normal', label: 'Normal' },
      { value: 'large', label: 'Large' },
      { value: 'extra_large', label: 'Extra large' },
      { value: 'huge', label: 'Huge' }
    ]
  );

  getOrientationList = () => (
    [
      { value: 'horizontal', label: 'Horizontal' },
      { value: 'vertical', label: 'Vertical' }
    ]
  );

  getRenderingBaseList = () => (
    [
      { value: '', label: '' },
      { value: 'lineMinValue', label: 'Line minimum value' },
      { value: 'zero', label: 'Zero' }
    ]
  );

  render() {
    const {
      stimulus,
      line,
      title,
      stacked_elements,
      isMoreOptionsOpen
    } = this.state;
    const { t } = this.props;
    return (
      <div>
        <Subtitle>{t('component.graphing.question.composequestion')}</Subtitle>
        <StyledTextarea
          placeholder={t('component.graphing.question.enteryourquestion')}
          name="stimulus"
          onChange={this.handleInputChange}
          value={stimulus}
        />
        <PaddingDiv top={30} bottom={30}>
          <Subtitle>{t('component.graphing.graphline')}</Subtitle>
          <Row>
            <Col md={6}>
              <Label>{t('component.graphing.minVal')}</Label>
              <StyledTextField
                type="number"
                name="min"
                value={line.min}
                onChange={this.handleLineChange}
                onBlur={this.handleLineChange}
                disabled={false}
                step={0.1}
              />
              <Label>{t('component.graphing.title')}</Label>
              <TitleTextInput
                type="text"
                name="title"
                value={title}
                onChange={this.handleInputChange}
                onBlur={this.handleInputChange}
              />
            </Col>
            <Col md={6} style={{ paddingLeft: 30 }}>
              <div>
                <Label>{t('component.graphing.maxVal')}</Label>
                <StyledTextField
                  type="number"
                  name="max"
                  value={line.max}
                  onChange={this.handleLineChange}
                  onBlur={this.handleLineChange}
                  disabled={false}
                  step={0.1}
                />
              </div>
              <div>
                <Label>{t('component.graphing.responseNumAllowed')}</Label>
                <StyledTextField
                  type="number"
                  name="stacked_elements"
                  value={stacked_elements}
                  onChange={this.handleInputChange}
                  onBlur={this.handleInputChange}
                  disabled={false}
                  step={1}
                />
              </div>
            </Col>
          </Row>
        </PaddingDiv>

        <AxisSegmentsOptions
          onClickMoreOptions={this.onClickMoreOptions}
          isMoreOptionsOpen={isMoreOptionsOpen}
          orientationList={this.getOrientationList()}
          fontSizeList={this.getFontSizeList()}
          renderingBaseList={this.getRenderingBaseList()}
        />
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
