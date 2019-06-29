import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { withRouter } from "react-router-dom";
import { get, cloneDeep, shuffle } from "lodash";
import styled from "styled-components";
import { Checkbox } from "antd";
import produce from "immer";

import { PaddingDiv, Paper } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";
import { white, boxShadowDefault } from "@edulastic/colors";
import { setQuestionDataAction } from "../../../author/QuestionEditor/ducks";
import { PREVIEW, EDIT, CLEAR, CHECK, SHOW } from "../../constants/constantsForQuestions";

import Options from "./components/Options";
import Authoring from "./components/Authoring";
import Display from "./components/Display";
import CorrectAnswers from "./CorrectAnswers";
import { replaceVariables, replaceValues } from "../../utils/variables";

import { Widget } from "../../styled/Widget";
import { ContentArea } from "../../styled/ContentArea";

const EmptyWrapper = styled.div``;

const MutlChoiceWrapper = styled(Paper)`
  border-radius: ${({ flowLayout }) => (flowLayout ? 0 : 10)}px;
  background: ${({ flowLayout }) => (flowLayout ? "transparent" : white)};
  padding: ${props => (props.padding ? props.padding : props.isV1Multipart ? "0px 35px" : "35px 43px")};
  box-shadow: ${props => (props.boxShadow ? props.boxShadow : props.isV1Multipart ? "none" : boxShadowDefault)};
`;

const Divider = styled.div`
  padding: 10px 0;
`;

class MultipleChoice extends Component {
  state = {
    shuffledOptions: [],
    correctTab: 0
  };

  componentWillReceiveProps(nextProps) {
    const { item } = this.props;
    if (!nextProps.item.shuffle_options) {
      const shuffledOptions = replaceValues(cloneDeep(nextProps.item.options), nextProps.item.variable);
      this.setState({
        shuffledOptions
      });
    } else if (nextProps.item.shuffle_options !== item.shuffle_options && nextProps.item.shuffle_options) {
      const shuffledOptions = replaceValues(cloneDeep(shuffle(nextProps.item.options)), nextProps.item.variable);
      this.setState({
        shuffledOptions
      });
    }
  }

  componentDidMount() {
    const { item } = this.props;
    const shuffledOptions = replaceValues(cloneDeep(shuffle(item.options)), item.variable);
    this.setState({
      shuffledOptions
    });
  }

  getRenderData = () => {
    const { item: templateItem, history, view } = this.props;
    const item = view === EDIT ? templateItem : replaceVariables(templateItem);

    const locationState = history.location.state;
    const isDetailPage = locationState !== undefined ? locationState.itemDetail : false;
    let previewDisplayOptions;
    let previewStimulus;
    let itemForEdit;
    if (item.smallSize || isDetailPage) {
      previewStimulus = item.stimulus;
      previewDisplayOptions = item.options;
      itemForEdit = templateItem;
    } else {
      previewStimulus = item.stimulus;
      previewDisplayOptions = item.options;
      itemForEdit = {
        ...templateItem,
        stimulus: templateItem.stimulus,
        list: templateItem.options,
        validation: templateItem.validation
      };
    }
    return {
      previewStimulus,
      previewDisplayOptions,
      itemForEdit,
      uiStyle: item.ui_style,
      multipleResponses: !!item.multiple_responses,
      shuffleOptions: !!item.shuffle_options
    };
  };

  handleAddAltResponses = () => {
    const { setQuestionData, item } = this.props;
    const { correctTab } = this.state;

    setQuestionData(
      produce(item, draft => {
        const response = {
          score: 1,
          value: []
        };

        if (draft.validation.alt_responses && draft.validation.alt_responses.length) {
          draft.validation.alt_responses.push(response);
        } else {
          draft.validation.alt_responses = [response];
        }
      })
    );

    this.setState({
      correctTab: correctTab + 1
    });
  };

  handleRemoveAltResponses = index => {
    const { setQuestionData, item } = this.props;
    const { correctTab } = this.state;

    setQuestionData(
      produce(item, draft => {
        if (draft.validation.alt_responses && draft.validation.alt_responses.length) {
          draft.validation.alt_responses = draft.validation.alt_responses.filter((response, i) => i !== index);
        }
      })
    );

    this.setState({
      correctTab: correctTab + 1
    });
  };

  handleAddAnswer = qid => {
    const { saveAnswer, userAnswer, item, previewTab, changePreviewTab } = this.props;
    const newAnswer = cloneDeep(userAnswer);
    if (previewTab !== CLEAR) {
      changePreviewTab(CLEAR);
    }
    if (item.multiple_responses) {
      if (newAnswer.includes(qid)) {
        const removeIndex = newAnswer.findIndex(el => el === qid);
        newAnswer.splice(removeIndex, 1);
        saveAnswer(newAnswer);
      } else {
        saveAnswer([...newAnswer, qid]);
      }
    } else {
      saveAnswer([qid]);
    }
  };

  handleOptionsChange = (name, value) => {
    const { setQuestionData, item, saveAnswer } = this.props;
    setQuestionData(
      produce(item, draft => {
        const reduceResponses = (acc, val, index) => {
          if (index === 0) {
            acc.push(val);
          }
          return acc;
        };

        if (name === "multiple_responses" && value === false) {
          draft.validation.valid_response.value = draft.validation.valid_response.value.reduce(reduceResponses, []);
          draft.validation.alt_responses = draft.validation.alt_responses.map(res => {
            res.value = res.value.reduce(reduceResponses, []);
            return res;
          });
          saveAnswer([]);
        }

        draft[name] = value;
      })
    );
  };

  render() {
    const {
      col,
      qIndex,
      view,
      previewTab,
      smallSize,
      item,
      userAnswer,
      t,
      testItem,
      evaluation,
      fillSections,
      cleanSections,
      isSidebarCollapsed,
      advancedAreOpen,
      flowLayout,
      disableResponse,
      ...restProps
    } = this.props;
    const { shuffledOptions, correctTab } = this.state;
    const {
      previewStimulus,
      previewDisplayOptions,
      itemForEdit,
      uiStyle,
      multipleResponses,
      shuffleOptions
    } = this.getRenderData();
    const isV1Multipart = get(col, "isV1Multipart", false);

    const Wrapper = testItem ? EmptyWrapper : MutlChoiceWrapper;
    // const multi_response = this.props.item.multiple_responses;
    return (
      <React.Fragment>
        <PaddingDiv>
          {view === EDIT && (
            <ContentArea isSidebarCollapsed={isSidebarCollapsed}>
              <React.Fragment>
                <Authoring item={itemForEdit} fillSections={fillSections} cleanSections={cleanSections} />
                <Widget>
                  <CorrectAnswers
                    uiStyle={uiStyle}
                    options={previewDisplayOptions}
                    question={previewStimulus}
                    multipleResponses={multipleResponses}
                    onAddAltResponses={this.handleAddAltResponses}
                    onRemoveAltResponses={this.handleRemoveAltResponses}
                    validation={item.validation}
                    itemLevelScoring={item.itemLevelScoring}
                    itemLevelScore={item.itemLevelScore}
                    item={item}
                    styleType="primary"
                    fillSections={fillSections}
                    cleanSections={cleanSections}
                    correctTab={correctTab}
                    {...restProps}
                  />
                  <Divider />
                  <Checkbox
                    data-cy="multi"
                    onChange={() => this.handleOptionsChange("multiple_responses", !multipleResponses)}
                    checked={multipleResponses}
                  >
                    {t("component.multiplechoice.multipleResponses")}
                  </Checkbox>
                  <Checkbox
                    onChange={() => this.handleOptionsChange("shuffle_options", !shuffleOptions)}
                    checked={shuffleOptions}
                  >
                    {t("component.multiplechoice.shuffleOptions")}
                  </Checkbox>
                </Widget>
                <Options
                  onChange={this.handleOptionsChange}
                  uiStyle={uiStyle}
                  advancedAreOpen={advancedAreOpen}
                  fillSections={fillSections}
                  cleanSections={cleanSections}
                  multipleResponses={multipleResponses}
                  {...restProps}
                />
              </React.Fragment>
            </ContentArea>
          )}
          {view === PREVIEW && (
            <Wrapper isV1Multipart={isV1Multipart} flowLayout={flowLayout}>
              {previewTab === CHECK && (
                <Display
                  checkAnswer
                  view={view}
                  onChange={!disableResponse ? this.handleAddAnswer : () => {}}
                  smallSize={smallSize}
                  userSelections={userAnswer}
                  options={shuffledOptions}
                  question={previewStimulus}
                  onChange={!disableResponse ? this.handleAddAnswer : () => {}}
                  handleMultiSelect={this.handleMultiSelect}
                  uiStyle={uiStyle}
                  evaluation={evaluation}
                  qIndex={qIndex}
                  instructorStimulus={item.instructor_stimulus}
                  multipleResponses={multipleResponses}
                  flowLayout={flowLayout}
                  qLabel={item.qLabel}
                  {...restProps}
                />
              )}
              {previewTab === SHOW && (
                <Display
                  showAnswer
                  view={view}
                  smallSize={smallSize}
                  options={shuffledOptions}
                  question={previewStimulus}
                  userSelections={userAnswer}
                  onChange={!disableResponse ? this.handleAddAnswer : () => {}}
                  handleMultiSelect={this.handleMultiSelect}
                  uiStyle={uiStyle}
                  evaluation={evaluation}
                  validation={item.validation}
                  qIndex={qIndex}
                  instructorStimulus={item.instructor_stimulus}
                  multipleResponses={multipleResponses}
                  flowLayout={flowLayout}
                  qLabel={item.qLabel}
                  {...restProps}
                />
              )}
              {previewTab === CLEAR && (
                <Display
                  preview
                  view={view}
                  smallSize={smallSize}
                  options={shuffledOptions}
                  question={previewStimulus}
                  userSelections={userAnswer}
                  uiStyle={uiStyle}
                  validation={item.validation}
                  onChange={!disableResponse ? this.handleAddAnswer : () => {}}
                  qIndex={qIndex}
                  instructorStimulus={item.instructor_stimulus}
                  multipleResponses={multipleResponses}
                  flowLayout={flowLayout}
                  qLabel={item.qLabel}
                  {...restProps}
                />
              )}
            </Wrapper>
          )}
        </PaddingDiv>
      </React.Fragment>
    );
  }
}

MultipleChoice.propTypes = {
  view: PropTypes.string.isRequired,
  qIndex: PropTypes.number.isRequired,
  previewTab: PropTypes.string,
  item: PropTypes.object,
  smallSize: PropTypes.bool,
  history: PropTypes.object,
  setQuestionData: PropTypes.func.isRequired,
  saveAnswer: PropTypes.func.isRequired,
  userAnswer: PropTypes.any,
  t: PropTypes.func.isRequired,
  testItem: PropTypes.bool,
  evaluation: PropTypes.any,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
  advancedAreOpen: PropTypes.bool,
  isSidebarCollapsed: PropTypes.bool.isRequired,
  flowLayout: PropTypes.bool,
  disableResponse: PropTypes.bool,
  col: PropTypes.object
};

MultipleChoice.defaultProps = {
  previewTab: CLEAR,
  item: {
    options: []
  },
  smallSize: false,
  history: {},
  userAnswer: [],
  testItem: false,
  evaluation: "",
  advancedAreOpen: false,
  fillSections: () => {},
  cleanSections: () => {},
  flowLayout: false,
  disableResponse: false
};

const enhance = compose(
  withRouter,
  withNamespaces("assessment"),
  connect(
    ({ authorUi }) => ({ isSidebarCollapsed: authorUi.isSidebarCollapsed }),
    { setQuestionData: setQuestionDataAction }
  )
);

const MultipleChoiceContainer = enhance(MultipleChoice);

export { MultipleChoiceContainer as MultipleChoice };
