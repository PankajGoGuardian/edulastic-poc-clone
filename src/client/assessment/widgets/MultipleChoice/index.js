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
import { white } from "@edulastic/colors";
import { setQuestionDataAction } from "../../../author/QuestionEditor/ducks";
import { PREVIEW, EDIT, CLEAR, CHECK, SHOW } from "../../constants/constantsForQuestions";

import Options from "./components/Options";
import Authoring from "./components/Authoring";
import Display from "./components/Display";
import CorrectAnswers from "./CorrectAnswers";
import { replaceVariables, replaceValues } from "../../utils/variables";

import { ContentArea } from "../../styled/ContentArea";
import { changePreviewAction } from "../../../author/src/actions/view";
import Question from "../../components/Question";

const EmptyWrapper = styled.div``;

const MutlChoiceWrapper = styled(Paper)`
  border-radius: ${({ flowLayout }) => (flowLayout ? 0 : 10)}px;
  background: ${({ flowLayout }) => (flowLayout ? "transparent" : white)};
  padding: ${props => (props.padding ? props.padding : "0px")};
  box-shadow: ${props => (props.boxShadow ? props.boxShadow : "none")};
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
    if (!nextProps.item.shuffleOptions) {
      const shuffledOptions = replaceValues(cloneDeep(nextProps.item.options), nextProps.item.variable);
      this.setState({
        shuffledOptions
      });
    } else if (nextProps.item.shuffleOptions !== item.shuffleOptions && nextProps.item.shuffleOptions) {
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
      uiStyle: item.uiStyle,
      multipleResponses: !!item.multipleResponses,
      shuffleOptions: !!item.shuffleOptions
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

        if (draft.validation.altResponses && draft.validation.altResponses.length) {
          draft.validation.altResponses.push(response);
        } else {
          draft.validation.altResponses = [response];
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
        if (draft.validation.altResponses && draft.validation.altResponses.length) {
          draft.validation.altResponses = draft.validation.altResponses.filter((response, i) => i !== index);
        }
      })
    );

    this.setState({
      correctTab: correctTab + 1
    });
  };

  handleAddAnswer = qid => {
    const { saveAnswer, userAnswer, item, previewTab, changePreviewTab, changeView } = this.props;
    const newAnswer = cloneDeep(userAnswer);
    if (previewTab !== CLEAR) {
      changePreviewTab(CLEAR);
      changeView(CLEAR);
    }
    if (item.multipleResponses) {
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

  handleRemoveAnswer = opIndex => {
    const { saveAnswer, userAnswer } = this.props;
    const newAnswer = cloneDeep(userAnswer);
    const removeIndex = newAnswer.findIndex(el => el === opIndex);
    if (removeIndex !== -1) {
      newAnswer.splice(removeIndex, 1);
    }
    saveAnswer(newAnswer);
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

        if (name === "multipleResponses" && value === false) {
          draft.validation.validResponse.value = draft.validation.validResponse.value.reduce(reduceResponses, []);
          draft.validation.altResponses = draft.validation.altResponses.map(res => {
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
    const qId = item.id;
    // const multi_response = this.props.item.multipleResponses;
    return (
      <React.Fragment>
        <PaddingDiv>
          {view === EDIT && (
            <ContentArea isSidebarCollapsed={isSidebarCollapsed}>
              <React.Fragment>
                <Authoring item={itemForEdit} fillSections={fillSections} cleanSections={cleanSections} />
                <Question
                  section="main"
                  label={t("component.correctanswers.setcorrectanswers")}
                  fillSections={fillSections}
                  cleanSections={cleanSections}
                >
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
                    onChange={() => this.handleOptionsChange("multipleResponses", !multipleResponses)}
                    checked={multipleResponses}
                  >
                    {t("component.multiplechoice.multipleResponses")}
                  </Checkbox>
                  <Checkbox
                    onChange={() => this.handleOptionsChange("shuffleOptions", !shuffleOptions)}
                    checked={shuffleOptions}
                  >
                    {t("component.multiplechoice.shuffleOptions")}
                  </Checkbox>
                </Question>
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
              {previewTab === SHOW || previewTab === CLEAR || previewTab === CHECK ? (
                <Display
                  showAnswer={previewTab === SHOW}
                  preview={previewTab === CLEAR}
                  checkAnswer={previewTab === CHECK}
                  view={view}
                  smallSize={smallSize}
                  options={shuffledOptions}
                  question={previewStimulus}
                  userSelections={userAnswer}
                  uiStyle={uiStyle}
                  evaluation={evaluation}
                  validation={item.validation}
                  onChange={!disableResponse ? this.handleAddAnswer : () => {}}
                  onRemove={this.handleRemoveAnswer}
                  qIndex={qIndex}
                  qId={qId}
                  instructorStimulus={item.instructorStimulus}
                  multipleResponses={multipleResponses}
                  flowLayout={flowLayout}
                  qLabel={item.qLabel}
                  testItem={testItem}
                  styleType="primary"
                  {...restProps}
                />
              ) : null}
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
  changePreviewTab: PropTypes.func.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
  advancedAreOpen: PropTypes.bool,
  isSidebarCollapsed: PropTypes.bool.isRequired,
  flowLayout: PropTypes.bool,
  disableResponse: PropTypes.bool,
  col: PropTypes.object.isRequired,
  changeView: PropTypes.func.isRequired
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
    { setQuestionData: setQuestionDataAction, changeView: changePreviewAction }
  )
);

const MultipleChoiceContainer = enhance(MultipleChoice);

export { MultipleChoiceContainer as MultipleChoice };
