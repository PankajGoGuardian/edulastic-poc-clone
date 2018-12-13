import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { PaddingDiv } from '@edulastic/common';
import { withNamespaces } from '@edulastic/localization';
import { arrayMove } from 'react-sortable-hoc';
import { cloneDeep } from 'lodash';
import { StyledTextarea, Subtitle, Label, ContainerStart, LineParameter, LineInput, TitleTextInput } from '../common/styled_components';
import OrderListResponse from './OrderListResponse/OrderListResponse';
import AxisLabelsLayoutSettings from './AxisLabelsLayoutSettings/AxisLabelsLayoutSettings';
import { setQuestionDataAction } from '../../../../../author/src/actions/question';

class GraphAxisLabels extends Component {
  constructor(props) {
    super(props);

    const { stimulus } = props.graphData;

    this.state = {
      lineMinValue: 0,
      lineMaxValue: 0,
      title: '',
      stimulus,
      isMoreOptionsOpen: false,
      fontSizeList: [
        {
          id: 'small',
          value: 'Small',
          selected: false,
        },
        {
          id: 'normal',
          value: 'Normal',
          selected: true,
        },
        {
          id: 'large',
          value: 'Large',
          selected: false,
        },
        {
          id: 'extra_large',
          value: 'Extra large',
          selected: false,
        },
        {
          id: 'huge',
          value: 'Huge',
          selected: false,
        },
      ],
      fractionsFormatList: [
        {
          id: 'not-normalized-fractions',
          value: 'Not normalized and mixed fractions',
          selected: true,
        },
        {
          id: 'normalized-fractions',
          value: 'Normalized and mixed fractions',
          selected: false,
        },
        {
          id: 'improper-fractions',
          value: 'Improper fractions',
          selected: false,
        },
      ],
      renderingBaseList: [
        {
          id: 'min-value-based',
          value: 'Line minimum value',
          selected: true,
        },
        {
          id: 'zero-based',
          value: 'Zero',
          selected: false,
        },

      ],
    };
  }

  updateTitle = (e) => {
    if (e) {
      this.setState(state => ({
        ...state,
        title: e.target.value,
      }));
    }
  };

  updateStimulus = (e) => {
    this.setState(state => ({
      ...state,
      stimulus: e.target.value,
    }));
  };

  updateValue = (e, lineType) => {
    let { value } = e.target;

    if (value < 0) {
      value = 0;
    }

    if (lineType === 'min') {
      return this.setState(state => ({
        ...state,
        lineMinValue: value,
      }));
    }

    return this.setState(state => ({
      ...state,
      lineMaxValue: value,
    }));
  };

  onSortOrderListEnd = ({ oldIndex, newIndex }) => {
    const { graphData, setQuestionData } = this.props;

    setQuestionData({ ...graphData, list: arrayMove(graphData.list, oldIndex, newIndex) });
  };

  handleQuestionsChange = (value, index) => {
    const { setQuestionData, graphData } = this.props;

    setQuestionData({
      ...graphData,
      list: graphData.list.map((q, i) => {
        if (i === index) {
          return value;
        }
        return q;
      }),
    });
  };

  handleDeleteQuestion = (index) => {
    const { setQuestionData, graphData, saveAnswer } = this.props;
    const newItem = cloneDeep(graphData);

    newItem.list = newItem.list.filter((q, i) => i !== index);

    const indexList = newItem.list.map((val, i) => i);

    // newItem.validation.valid_response.value = indexList;

    // newItem.validation.alt_responses = newItem.validation.alt_responses.map((res) => {
    //   res.value = indexList;
    //   return res;
    // });

    saveAnswer(indexList);
    setQuestionData(newItem);
  };

  handleAddQuestion = () => {
    const { setQuestionData, graphData, t, saveAnswer } = this.props;
    const newItem = cloneDeep(graphData);

    newItem.list = [
      ...graphData.list,
      `${t('common.initialoptionslist.itemprefix')} ${graphData.list.length}`,
    ];
    // newItem.validation.valid_response.value = [
    //   ...newItem.validation.valid_response.value,
    //   newItem.validation.valid_response.value.length,
    // ];
    //
    // if (newItem.validation.alt_responses.length) {
    //   newItem.validation.alt_responses = newItem.validation.alt_responses.map((res) => {
    //     res.value.push(res.value.length);
    //     return res;
    //   });
    // }

    saveAnswer(newItem.list.map((q, i) => i));
    setQuestionData(newItem);
  };

  onClickMoreOptions = (isClicked) => {
    this.setState(state => ({
      ...state,
      isMoreOptionsOpen: isClicked,
    }));
  };

  render() {
    const {
      lineMinValue,
      lineMaxValue,
      title,
      stimulus,
      isMoreOptionsOpen,
      fontSizeList,
      fractionsFormatList,
      renderingBaseList,
    } = this.state;
    const { t, graphData } = this.props;

    return (
      <div>
        <Subtitle>{t('component.graphing.question.composequestion')}</Subtitle>
        <StyledTextarea
          placeholder={t('component.graphing.question.enteryourquestion')}
          onChange={this.updateStimulus}
          onBlur={this.updateStimulus}
          value={stimulus}
        />

        <PaddingDiv top={30} bottom={30}>
          <Subtitle>{t('component.graphing.graphline')}</Subtitle>

          <ContainerStart>
            <LineParameter>
              <Label>Minimum value</Label>
              <LineInput
                type="number"
                value={lineMinValue}
                onChange={e => this.updateValue(e, 'min')}
                onBlur={e => this.updateValue(e, 'min')}
                step={1}
                disabled={false}
              />
            </LineParameter>
            <LineParameter>
              <Label>Maximum value</Label>
              <LineInput
                type="number"
                value={lineMaxValue}
                onChange={e => this.updateValue(e, 'max')}
                onBlur={e => this.updateValue(e, 'max')}
                step={1}
                disabled={false}
              />
            </LineParameter>
          </ContainerStart>
        </PaddingDiv>

        <PaddingDiv bottom={30}>
          <Subtitle>{t('component.graphing.title')}</Subtitle>
          <TitleTextInput
            type="text"
            value={title}
            onChange={this.updateTitle}
            onBlur={this.updateTitle}
          />
        </PaddingDiv>

        <PaddingDiv bottom={30}>
          <Subtitle>{t('component.graphing.possibleresponses')}</Subtitle>

          <OrderListResponse
            style={{ marginBottom: 10 }}
            questions={graphData.list}
            onSortEnd={this.onSortOrderListEnd}
            onQuestionsChange={this.handleQuestionsChange}
            onDeleteQuestion={this.handleDeleteQuestion}
            onAddQuestion={this.handleAddQuestion}
            useDragHandle
          />
        </PaddingDiv>

        <AxisLabelsLayoutSettings
          t={t}
          onClickMoreOptions={this.onClickMoreOptions}
          isMoreOptionsOpen={isMoreOptionsOpen}
          fontSizeList={fontSizeList}
          fractionsFormatList={fractionsFormatList}
          renderingBaseList={renderingBaseList}
        />

      </div>
    );
  }
}

GraphAxisLabels.propTypes = {
  t: PropTypes.func.isRequired,
  graphData: PropTypes.object.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  saveAnswer: PropTypes.func.isRequired,
};

const enhance = compose(
  withNamespaces('assessment'),
  connect(
    null,
    {
      setQuestionData: setQuestionDataAction,
    },
  ),
);

export default enhance(GraphAxisLabels);
