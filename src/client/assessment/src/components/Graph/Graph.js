import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { cloneDeep } from 'lodash';
import { Paper, Select } from '@edulastic/common';
import { compose } from 'redux';
import styled from 'styled-components';
import { withNamespaces } from '@edulastic/localization';
import {
  GraphAxisLabels, GraphQuadrants, AxisSegments,
  GraphQuadrantsDisplay,
  CorrectAnswers
} from './index';
import { setQuestionDataAction } from '../../../../author/src/actions/question';
import GraphQuadrantsOptions from './Authoring/GraphQuadrants/GraphQuadrantsOptions';
import QuadrantsSmallSize from './components/QuadrantsSmallSize';
import AxisSmallSize from './components/AxisSmallSize';

const EmptyWrapper = styled.div``;

const SmallSizeQuadrantsWrapper = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 9px 30px 16px;
`;

const SmallSizeAxisWrapper = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`;

const getIgnoreRepeatedShapesOptions = () => (
  [
    { value: 'no', label: 'No' },
    { value: 'yes', label: 'Compare by slope' },
    { value: 'strict', label: 'Compare by points' }
  ]
);

class Graph extends Component {
  getRenderData = () => {
    const { item } = this.props;
    let previewTools = [];
    let previewAnswer = [];
    if (item) {
      previewTools = item.toolbar ? item.toolbar.tools : [];
      previewAnswer = item.validation ? item.validation.valid_response.value : [];
    }
    return {
      previewStimulus: item.stimulus,
      uiStyle: item.ui_style,
      canvas: item.canvas,
      bgImgOptions: item.background_image,
      backgroundShapes: item.background_shapes,
      previewTools,
      previewAnswer
    };
  };

  getComponentByGraphType = (graphType) => {
    switch (graphType) {
      case 'firstQuadrant':
        return GraphQuadrants;
      case 'axisSegments':
        return AxisSegments;
      case 'axisLabels':
        return GraphAxisLabels;
      default:
      case 'quadrants':
        return GraphQuadrants;
    }
  };

  handleOptionsChange = (options) => {
    const { setQuestionData, item } = this.props;
    setQuestionData({ ...item, ui_style: options });
  };

  handleBgImgChange = (bgImgOptions) => {
    const { setQuestionData, item } = this.props;
    setQuestionData({ ...item, background_image: bgImgOptions });
  };

  handleBgShapesChange = (bgShapes) => {
    const { setQuestionData, item } = this.props;
    setQuestionData({ ...item, background_shapes: bgShapes });
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

  getStemNumerationList = () => (
    [
      { value: '', label: '' },
      { value: 'numerical', label: 'Numerical' },
      { value: 'uppercase_alphabet', label: 'Uppercase alphabet' },
      { value: 'lowercase_alphabet', label: 'Lowercase alphabet' }
    ]
  );

  handleAddAltResponses = () => {
    const { setQuestionData, item } = this.props;
    const newItem = cloneDeep(item);

    const response = {
      score: 1,
      value: []
    };

    if (newItem.validation.alt_responses && newItem.validation.alt_responses.length) {
      newItem.validation.alt_responses.push(response);
    } else {
      newItem.validation.alt_responses = [response];
    }

    setQuestionData(newItem);
  };

  handleAddAnswer = (qid) => {
    const { saveAnswer } = this.props;
    saveAnswer(qid);
  };

  handleSelectIgnoreRepeatedShapes = (value) => {
    const { item, setQuestionData } = this.props;
    const newItem = cloneDeep(item);
    newItem.validation.ignore_repeated_shapes = value;
    setQuestionData(newItem);
  };

  render() {
    const { view, item, smallSize, testItem, previewTab, userAnswer, changePreviewTab, evaluation } = this.props;
    const ComponentByGraphType = this.getComponentByGraphType(item.graphType);

    const {
      previewStimulus,
      uiStyle,
      canvas,
      bgImgOptions,
      backgroundShapes,
      previewTools,
      previewAnswer
    } = this.getRenderData();

    const Wrapper = testItem ? EmptyWrapper : Paper;

    return (
      <React.Fragment>
        {view === 'edit' && (
          <React.Fragment>
            <Paper>
              <ComponentByGraphType graphData={item} />
              <CorrectAnswers
                uiStyle={uiStyle}
                canvasConfig={canvas}
                onAddAltResponses={this.handleAddAltResponses}
                validation={item.validation}
                tools={previewTools}
                bgImgOptions={bgImgOptions}
                backgroundShapes={backgroundShapes}
              />
              <Select
                key={Math.random().toString(36)}
                style={{ width: 'auto', marginTop: '11px', marginRight: '10px', borderRadius: '10px' }}
                onChange={val => this.handleSelectIgnoreRepeatedShapes(val)}
                options={getIgnoreRepeatedShapesOptions()}
                value={item.validation.ignore_repeated_shapes}
              /> Ignore repeated shapes
            </Paper>
            <Paper
              padding="30px 60px"
              style={{ marginTop: '30px' }}
            >
              <GraphQuadrantsOptions
                stemNumerationList={this.getStemNumerationList()}
                fontSizeList={this.getFontSizeList()}
                options={uiStyle}
                canvasConfig={canvas}
                setOptions={this.handleOptionsChange}
                bgImgOptions={bgImgOptions}
                setBgImg={this.handleBgImgChange}
                backgroundShapes={backgroundShapes}
                setBgShapes={this.handleBgShapesChange}
                validation={item.validation}
              />
            </Paper>
          </React.Fragment>
        )}
        {view === 'preview' && smallSize === false && item && (
          <Wrapper>
            {previewTab === 'check' && (
              <GraphQuadrantsDisplay
                checkAnswer
                smallSize={smallSize}
                question={previewStimulus}
                uiStyle={uiStyle}
                canvasConfig={canvas}
                tools={previewTools}
                bgImgOptions={bgImgOptions}
                onChange={this.handleAddAnswer}
                elements={userAnswer}
                validation={item.validation}
                answer={previewAnswer}
                changePreviewTab={changePreviewTab}
                backgroundShapes={backgroundShapes}
                evaluation={evaluation}
              />
            )}
            {previewTab === 'show' && (
              <GraphQuadrantsDisplay
                showAnswer
                smallSize={smallSize}
                question={previewStimulus}
                uiStyle={uiStyle}
                canvasConfig={canvas}
                tools={previewTools}
                bgImgOptions={bgImgOptions}
                elements={userAnswer}
                validation={item.validation}
                answer={previewAnswer}
                onChange={this.handleAddAnswer}
                backgroundShapes={backgroundShapes}
                evaluation={evaluation}
              />
            )}
            {previewTab === 'clear' && (
              <GraphQuadrantsDisplay
                preview
                smallSize={smallSize}
                question={previewStimulus}
                uiStyle={uiStyle}
                canvasConfig={canvas}
                tools={previewTools}
                bgImgOptions={bgImgOptions}
                onChange={this.handleAddAnswer}
                elements={userAnswer}
                backgroundShapes={backgroundShapes}
              />
            )}
          </Wrapper>
        )}
        {view === 'preview' && smallSize && (
          <React.Fragment>
            {item.graphType === 'firstQuadrant' && (
              <SmallSizeQuadrantsWrapper>
                <QuadrantsSmallSize first />
              </SmallSizeQuadrantsWrapper>
            )}
            {item.graphType === 'axisSegments' && (
              <SmallSizeAxisWrapper>
                <AxisSmallSize segments />
              </SmallSizeAxisWrapper>
            )}
            {item.graphType === 'axisLabels' && (
              <SmallSizeAxisWrapper>
                <AxisSmallSize labels />
              </SmallSizeAxisWrapper>
            )}
            {item.graphType === 'quadrants' && (
              <SmallSizeQuadrantsWrapper>
                <QuadrantsSmallSize />
              </SmallSizeQuadrantsWrapper>
            )}
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

Graph.propTypes = {
  view: PropTypes.string.isRequired,
  item: PropTypes.object.isRequired,
  smallSize: PropTypes.bool,
  setQuestionData: PropTypes.func.isRequired,
  testItem: PropTypes.bool,
  previewTab: PropTypes.string,
  userAnswer: PropTypes.any,
  saveAnswer: PropTypes.func.isRequired,
  changePreviewTab: PropTypes.func,
  evaluation: PropTypes.any
};

Graph.defaultProps = {
  smallSize: false,
  previewTab: 'clear',
  testItem: false,
  userAnswer: [],
  changePreviewTab: () => {},
  evaluation: null
};

const enhance = compose(
  withNamespaces('assessment'),
  connect(
    null,
    {
      setQuestionData: setQuestionDataAction
    },
  )
);

export default enhance(Graph);
