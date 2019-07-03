import React from "react";
import PropTypes from "prop-types";
import { get } from "lodash";

import { Paper, Stimulus, InstructorStimulus, Subtitle } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";
import { questionType } from "@edulastic/constants";
import { charts as checkAnswerMethod } from "@edulastic/evaluators";

import { CLEAR, PREVIEW, CHECK, SHOW, EDIT } from "../../constants/constantsForQuestions";

import { getFontSize } from "../../utils/helpers";
import LineChart from "./LineChart";
import BarChart from "./BarChart";
import Histogram from "./Histogram";
import DotPlot from "./DotPlot";
import LinePlot from "./LinePlot";
import { QuestionTitleWrapper, QuestionNumber } from "./styled/QuestionNumber";
import { CorrectAnswerWrapper } from "./styled";

const ChartPreview = ({
  item,
  smallSize,
  saveAnswer,
  userAnswer,
  previewTab,
  view,
  showQuestionNumber,
  disableResponse,
  evaluation,
  t,
  metaData,
  changePreviewTab
}) => {
  const fontSize = getFontSize(get(item, "ui_style.fontsize"));
  const chartType = get(item, "ui_style.chart_type");

  const { chart_data = {}, validation, ui_style } = item;
  const { data = [] } = chart_data;
  let CurrentChart = null;

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
    passData.data = [...userAnswer];
  }

  const answerData = validation.valid_response.value;
  const answerCorrect = Array(answerData.length).fill(true);

  const correct =
    evaluation && evaluation.length && previewTab === CHECK
      ? evaluation
      : validation
      ? checkAnswerMethod({
          userResponse: passData.data,
          validation
        }).evaluation
      : [];

  const saveAnswerHandler = ans => {
    changePreviewTab(CLEAR);
    saveAnswer(ans);
  };

  const calculatedParams = {
    ...ui_style,
    width:
      document.querySelector(`[data-cy="${metaData}"]`) !== null &&
      ui_style.width > document.querySelector(`[data-cy="${metaData}"]`).clientWidth - 460
        ? document.querySelector(`[data-cy="${metaData}"]`).clientWidth - 460
        : ui_style.width
  };

  return (
    <Paper style={{ fontSize }} padding={smallSize} boxShadow={smallSize ? "none" : ""}>
      <InstructorStimulus>{item.instructor_stimulus}</InstructorStimulus>
      <QuestionTitleWrapper>
        {showQuestionNumber && <QuestionNumber>{item.qLabel}</QuestionNumber>}
        <Stimulus dangerouslySetInnerHTML={{ __html: item.stimulus }} />
      </QuestionTitleWrapper>
      <CurrentChart
        {...passData}
        gridParams={calculatedParams}
        view={view}
        disableResponse={disableResponse}
        previewTab={previewTab}
        saveAnswer={saveAnswerHandler}
        correct={correct}
      />
      {view === PREVIEW && previewTab === SHOW && (
        <CorrectAnswerWrapper>
          <Subtitle>{t("component.chart.correctAnswer")}</Subtitle>
          <CurrentChart
            {...passData}
            data={answerData}
            gridParams={calculatedParams}
            view={view}
            disableResponse
            previewTab={previewTab}
            saveAnswer={saveAnswerHandler}
            correct={answerCorrect}
          />
        </CorrectAnswerWrapper>
      )}
    </Paper>
  );
};

ChartPreview.propTypes = {
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
  t: PropTypes.func.isRequired
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
  changePreviewTab: () => {}
};

export default withNamespaces("assessment")(ChartPreview);
