import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { cloneDeep } from 'lodash';
import { Paper, Select } from '@edulastic/common';
import { compose } from 'redux';
import styled from 'styled-components';
import { withNamespaces } from '@edulastic/localization';
import { setQuestionDataAction } from '../../../../author/src/actions/question';
import GraphQuadrantsOptions from './Authoring/GraphQuadrants/GraphQuadrantsOptions';
import AxisSegmentsOptions from './Authoring/AxisSegmentsOptions';
import AxisLabelsOptions from './Authoring/AxisLabelsLayoutSettings/AxisLabelsOptions';
import QuadrantsSmallSize from './components/QuadrantsSmallSize';
import AxisSmallSize from './components/AxisSmallSize';
import { AxisSegments, GraphAxisLabels, GraphQuadrants } from './Authoring';
import { CorrectAnswers } from './CorrectAnswers';
import { GraphDisplay } from './Display';

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

const getFontSizeList = () => (
  [
    { value: '', label: '' },
    { value: 'small', label: 'Small' },
    { value: 'normal', label: 'Normal' },
    { value: 'large', label: 'Large' },
    { value: 'extra_large', label: 'Extra large' },
    { value: 'huge', label: 'Huge' }
  ]
);

const getStemNumerationList = () => (
  [
    { value: '', label: '' },
    { value: 'numerical', label: 'Numerical' },
    { value: 'uppercase_alphabet', label: 'Uppercase alphabet' },
    { value: 'lowercase_alphabet', label: 'Lowercase alphabet' }
  ]
);

class Graph extends Component {
  getOptionsComponent = () => {
    const { item } = this.props;
    const { graphType } = item;

    switch (graphType) {
      case 'axisSegments':
        return AxisSegments;
      case 'axisLabels':
        return GraphAxisLabels;
      case 'quadrants':
      case 'firstQuadrant':
      default:
        return GraphQuadrants;
    }
  };

  getMoreOptionsComponent = () => {
    const { item } = this.props;
    const { graphType } = item;

    switch (graphType) {
      case 'axisSegments':
        return AxisSegmentsOptions;
      case 'axisLabels':
        return AxisLabelsOptions;
      case 'quadrants':
      case 'firstQuadrant':
      default:
        return GraphQuadrantsOptions;
    }
  };

  getMoreOptionsProps = () => {
    const { item } = this.props;
    const { graphType } = item;

    switch (graphType) {
      case 'axisSegments':
        return this.getAxisLabelsOptionsProps();
      case 'axisLabels':
        return this.getAxisLabelsOptionsProps();
      case 'quadrants':
      case 'firstQuadrant':
      default:
        return this.getQuadrantsOptionsProps();
    }
  };

  getQuadrantsOptionsProps = () => {
    const { item } = this.props;

    return {
      stemNumerationList: getStemNumerationList(),
      fontSizeList: getFontSizeList(),
      setOptions: this.handleOptionsChange,
      setBgImg: this.handleBgImgChange,
      setBgShapes: this.handleBgShapesChange,
      graphData: item
    };
  };

  getAxisLabelsOptionsProps = () => {
    const { item } = this.props;

    return {
      setOptions: this.handleOptionsChange,
      setNumberline: this.handleNumberlineChange,
      setCanvas: this.handleCanvasChange,
      graphData: item
    };
  };

  getAxisSegmentsOptionsProps = () => {
    const { item } = this.props;

    return {
      graphData: item
    };
  };

  handleNumberlineChange = (options) => {
    const { setQuestionData, item } = this.props;
    setQuestionData({ ...item, numberlineAxis: options });
  };

  handleOptionsChange = (options) => {
    const { setQuestionData, item } = this.props;
    setQuestionData({ ...item, ui_style: options });
  };

  handleCanvasChange = (options) => {
    const { setQuestionData, item } = this.props;
    setQuestionData({ ...item, canvas: options });
  };

  handleBgImgChange = (bgImgOptions) => {
    const { setQuestionData, item } = this.props;
    setQuestionData({ ...item, background_image: bgImgOptions });
  };

  handleBgShapesChange = (bgShapes) => {
    const { setQuestionData, item } = this.props;
    setQuestionData({ ...item, background_shapes: bgShapes });
  };

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
    setQuestionData({ ...newItem });
  };

  render() {
    const {
      view,
      item,
      smallSize,
      testItem,
      previewTab,
      userAnswer,
      changePreviewTab,
      evaluation
    } = this.props;
    const { graphType } = item;

    const OptionsComponent = this.getOptionsComponent();
    const MoreOptionsComponent = this.getMoreOptionsComponent();

    const Wrapper = testItem ? EmptyWrapper : Paper;

    return (
      <React.Fragment>
        {view === 'edit' && (
          <React.Fragment>
            <Paper>
              <OptionsComponent canvas={item.canvas} setCanvas={this.handleCanvasChange} graphData={item} />
              <CorrectAnswers
                graphData={item}
                onAddAltResponses={this.handleAddAltResponses}
              />
              {(graphType === 'quadrants' || graphType === 'firstQuadrant') && (
                <React.Fragment>
                  <Select
                    key={Math.random().toString(36)}
                    style={{ width: 'auto', marginTop: '11px', marginRight: '10px', borderRadius: '10px' }}
                    onChange={val => this.handleSelectIgnoreRepeatedShapes(val)}
                    options={getIgnoreRepeatedShapesOptions()}
                    value={item.validation.ignore_repeated_shapes}
                  /> Ignore repeated shapes
                </React.Fragment>
              )}
            </Paper>
            <Paper
              padding="30px 60px"
              style={{ marginTop: '30px' }}
            >
              <MoreOptionsComponent {...this.getMoreOptionsProps()} />
            </Paper>
          </React.Fragment>
        )}
        {view === 'preview' && smallSize === false && item && (
          <Wrapper>
            {previewTab === 'check' && (
              <GraphDisplay
                checkAnswer
                smallSize
                graphData={item}
                onChange={this.handleAddAnswer}
                elements={userAnswer}
                changePreviewTab={changePreviewTab}
                evaluation={evaluation}
              />
            )}
            {previewTab === 'show' && (
              <GraphDisplay
                showAnswer
                smallSize
                graphData={item}
                onChange={this.handleAddAnswer}
                elements={userAnswer}
                changePreviewTab={changePreviewTab}
                evaluation={evaluation}
              />
            )}
            {previewTab === 'clear' && (
              <GraphDisplay
                clearAnswer
                smallSize
                graphData={item}
                onChange={this.handleAddAnswer}
                elements={userAnswer}
                changePreviewTab={changePreviewTab}
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
