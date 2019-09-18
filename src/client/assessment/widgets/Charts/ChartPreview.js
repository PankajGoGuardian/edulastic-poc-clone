import React, { Fragment, useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { get, cloneDeep } from "lodash";

import {
  Paper,
  Stimulus,
  InstructorStimulus,
  CorrectAnswersContainer,
  AnswerContext,
  QuestionNumberLabel
} from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";
import { questionType } from "@edulastic/constants";
import { charts as checkAnswerMethod } from "@edulastic/evaluators";

import { setElementsStashAction, setStashIndexAction } from "../../actions/graphTools";
import { CLEAR, PREVIEW, CHECK, SHOW, EDIT } from "../../constants/constantsForQuestions";

import { getFontSize } from "../../utils/helpers";
import LineChart from "./LineChart";
import BarChart from "./BarChart";
import Histogram from "./Histogram";
import DotPlot from "./DotPlot";
import LinePlot from "./LinePlot";
import { QuestionTitleWrapper } from "./styled/QuestionNumber";
import { Tools } from "./components/Tools";
import AnnotationRnd from "../../components/Annotations/AnnotationRnd";

const ChartPreview = ({
  item,
  smallSize,
  saveAnswer,
  userAnswer,
  previewTab: _previewTab,
  view,
  showQuestionNumber,
  disableResponse,
  evaluation,
  t,
  tab,
  changePreviewTab,
  stash,
  stashIndex,
  setElementsStash,
  setStashIndex,
  setQuestionData
}) => {
  const answerContextConfig = useContext(AnswerContext);
  const [barIsDragging, toggleBarDragging] = useState(false);
  const fontSize = getFontSize(get(item, "uiStyle.fontsize"));
  const chartType = get(item, "uiStyle.chartType");
  let previewTab = _previewTab;
  if (answerContextConfig.expressGrader && !answerContextConfig.isAnswerModifiable) {
    previewTab = CHECK;
  } else if (answerContextConfig.expressGrader && answerContextConfig.isAnswerModifiable) {
    previewTab = CLEAR;
  }

  const { chart_data = {}, validation, uiStyle } = item;
  const { data = [] } = chart_data;
  let CurrentChart = null;

  const [tool, setTool] = useState(0);

  const getStashId = () => (tab === 0 ? `${item.id}_${view}` : `alt-${tab}-${item.id}_${view}`);

  useEffect(() => {
    setElementsStash(data, getStashId());
  }, []);

  switch (chartType) {
    case questionType.LINE_CHART:
      CurrentChart = LineChart;
      break;
    case questionType.BAR_CHART:
      CurrentChart = BarChart;
      break;
    case questionType.HISTOGRAM:
      CurrentChart = Histogram;
      break;
    case questionType.DOT_PLOT:
      CurrentChart = DotPlot;
      break;

    case questionType.LINE_PLOT:
    default:
      CurrentChart = LinePlot;
  }

  const answerIsActual = () => {
    if (userAnswer.length !== data.length) {
      return false;
    }
    for (let i = 0; i < data.length; i++) {
      if (data[i].x !== userAnswer[i].x) {
        return false;
      }
    }
    return true;
  };

  const passData = {
    ...chart_data
  };

  if (answerIsActual() || view === EDIT) {
    passData.data = userAnswer.map((answer, index) => ({ ...answer, hoverSetting: passData.data[index].hoverSetting }));
  }

  const answerData = validation ? validation.validResponse.value : [];
  const answerCorrect = Array(answerData.length).fill(true);

  const altAnswerData = validation && validation.altResponses ? validation.altResponses : [];
  const altAnswerCorrect = altAnswerData.map(ans => Array(ans.value.length).fill(true));

  const correct =
    evaluation && evaluation.length && previewTab === CHECK
      ? evaluation
      : validation
      ? checkAnswerMethod({
          userResponse: passData.data,
          validation
        }).evaluation
      : [];

  const saveAnswerHandler = (ans, index) => {
    changePreviewTab(CLEAR);

    if (tool === 3 && index >= 0) {
      const newAnswer = cloneDeep(ans);
      newAnswer[index].y = uiStyle.yAxisMin;
      setTool(0);
      saveAnswer(newAnswer);
      setElementsStash(newAnswer, getStashId());
    } else {
      saveAnswer(ans);
      setElementsStash(ans, getStashId());
    }
  };

  const calculatedParams = {
    ...uiStyle
  };

  const onReset = () => {
    setTool(0);
    saveAnswerHandler(data);
  };

  const onUndo = () => {
    const id = getStashId();
    if (stashIndex[id] > 0 && stashIndex[id] <= stash[id].length - 1) {
      saveAnswer(stash[id][stashIndex[id] - 1]);
      setStashIndex(stashIndex[id] - 1, id);
    }
  };

  const onRedo = () => {
    const id = getStashId();
    if (stashIndex[id] >= 0 && stashIndex[id] < stash[id].length - 1) {
      saveAnswer(stash[id][stashIndex[id] + 1]);
      setStashIndex(stashIndex[id] + 1, id);
    }
  };

  const getHandlerByControlName = control => {
    switch (control) {
      case "undo":
        return onUndo();
      case "redo":
        return onRedo();
      case "reset":
        return onReset();
      default:
        return () => {};
    }
  };

  const allControls = ["undo", "redo", "reset", "delete"];

  const renderTools = () => (
    <Tools setTool={setTool} tool={tool} controls={allControls} getHandlerByControlName={getHandlerByControlName} />
  );

  return (
    <Paper className="chart-wrapper" style={{ fontSize }} padding={smallSize} boxShadow={smallSize ? "none" : ""}>
      {view === PREVIEW && (
        <Fragment>
          <InstructorStimulus>{item.instructorStimulus}</InstructorStimulus>
          <QuestionTitleWrapper>
            {showQuestionNumber && <QuestionNumberLabel>{item.qLabel}:</QuestionNumberLabel>}
            <Stimulus dangerouslySetInnerHTML={{ __html: item.stimulus }} />
          </QuestionTitleWrapper>
        </Fragment>
      )}
      {!disableResponse && renderTools()}
      <CurrentChart
        {...passData}
        gridParams={calculatedParams}
        deleteMode={tool === 3}
        view={view}
        disableResponse={disableResponse}
        previewTab={previewTab}
        saveAnswer={saveAnswerHandler}
        correct={correct}
        item={item}
        setQuestionData={setQuestionData}
      />
      {view === PREVIEW && previewTab === SHOW && (
        <CorrectAnswersContainer title={t("component.chart.correctAnswer")}>
          <CurrentChart
            {...passData}
            data={answerData}
            gridParams={calculatedParams}
            deleteMode={tool === 3}
            view={view}
            disableResponse
            previewTab={previewTab}
            saveAnswer={saveAnswerHandler}
            correct={answerCorrect}
            item={item}
            setQuestionData={setQuestionData}
          />
        </CorrectAnswersContainer>
      )}

      {view === PREVIEW &&
        previewTab === SHOW &&
        altAnswerData.length > 0 &&
        altAnswerData.map((ans, index) => (
          <CorrectAnswersContainer title={`${t("component.chart.alternateAnswer")} ${index + 1}`}>
            <CurrentChart
              {...passData}
              data={ans.value}
              gridParams={calculatedParams}
              deleteMode={tool === 3}
              view={view}
              disableResponse
              previewTab={previewTab}
              saveAnswer={saveAnswerHandler}
              correct={altAnswerCorrect[index]}
              item={item}
              setQuestionData={setQuestionData}
            />
          </CorrectAnswersContainer>
        ))}
    </Paper>
  );
};

ChartPreview.propTypes = {
  setQuestionData: PropTypes.func.isRequired,
  smallSize: PropTypes.bool,
  item: PropTypes.object.isRequired,
  saveAnswer: PropTypes.func.isRequired,
  previewTab: PropTypes.string,
  location: PropTypes.object.isRequired,
  userAnswer: PropTypes.array,
  view: PropTypes.string,
  disableResponse: PropTypes.bool,
  showQuestionNumber: PropTypes.bool,
  metaData: PropTypes.string.isRequired,
  qIndex: PropTypes.number,
  evaluation: PropTypes.any,
  changePreviewTab: PropTypes.func,
  t: PropTypes.func.isRequired,
  setElementsStash: PropTypes.func.isRequired,
  setStashIndex: PropTypes.func.isRequired,
  stash: PropTypes.object,
  stashIndex: PropTypes.object,
  tab: PropTypes.number
};

ChartPreview.defaultProps = {
  previewTab: CLEAR,
  smallSize: false,
  userAnswer: [],
  view: PREVIEW,
  qIndex: null,
  showQuestionNumber: false,
  evaluation: null,
  disableResponse: false,
  changePreviewTab: () => {},
  stash: {},
  stashIndex: {},
  tab: 0
};

const enhance = compose(
  withNamespaces("assessment"),
  connect(
    state => ({
      stash: state.graphTools.stash,
      stashIndex: state.graphTools.stashIndex
    }),
    {
      setElementsStash: setElementsStashAction,
      setStashIndex: setStashIndexAction
    }
  )
);

export default enhance(ChartPreview);
