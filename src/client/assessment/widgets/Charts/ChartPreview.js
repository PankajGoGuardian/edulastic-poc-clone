import React from "react";
import PropTypes from "prop-types";
import { get, cloneDeep } from "lodash";

import { Paper, Stimulus, InstructorStimulus } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";
import { questionType } from "@edulastic/constants";

import { CLEAR, PREVIEW } from "../../constants/constantsForQuestions";

import { getFontSize } from "../../utils/helpers";
import LineChart from "./LineChart";
import BarChart from "./BarChart";
import Histogram from "./Histogram";
import DotPlot from "./DotPlot";
import LinePlot from "./LinePlot";
import { QuestionTitleWrapper, QuestionNumber } from "./styled/QuestionNumber";

const ChartPreview = ({ item, smallSize, saveAnswer, userAnswer, previewTab, view, showQuestionNumber, qIndex }) => {
  const fontSize = getFontSize(get(item, "ui_style.fontsize"));
  const chartType = get(item, "ui_style.chart_type");

  const { chart_data } = item;

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
      CurrentChart = LinePlot;
      break;
    default:
  }

  const passData =
    userAnswer.length !== chart_data.data.length
      ? {
          ...chart_data,
          gridParams: { ...item.ui_style }
        }
      : {
          ...chart_data,
          gridParams: { ...item.ui_style },
          data: [...userAnswer]
        };

  return (
    <Paper style={{ fontSize }} padding={smallSize} boxShadow={smallSize ? "none" : ""}>
      <InstructorStimulus>{item.instructor_stimulus}</InstructorStimulus>
      <QuestionTitleWrapper>
        {showQuestionNumber && <QuestionNumber>{`Q${qIndex + 1}`}</QuestionNumber>}
        <Stimulus dangerouslySetInnerHTML={{ __html: item.stimulus }} />
      </QuestionTitleWrapper>
      <CurrentChart
        {...passData}
        view={view}
        validation={cloneDeep(item.validation)}
        previewTab={previewTab}
        saveAnswer={saveAnswer}
      />
    </Paper>
  );
};

ChartPreview.propTypes = {
  smallSize: PropTypes.bool,
  item: PropTypes.object.isRequired,
  saveAnswer: PropTypes.func.isRequired,
  previewTab: PropTypes.string,
  userAnswer: PropTypes.array,
  view: PropTypes.string,
  showQuestionNumber: PropTypes.bool,
  qIndex: PropTypes.number
};

ChartPreview.defaultProps = {
  previewTab: CLEAR,
  smallSize: false,
  userAnswer: [],
  view: PREVIEW,
  qIndex: null,
  showQuestionNumber: false
};

export default withNamespaces("assessment")(ChartPreview);
