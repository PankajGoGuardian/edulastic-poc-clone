import "rc-color-picker/assets/index.css";
import React, { Fragment, useState, useEffect } from "react";
import PropTypes from "prop-types";
import produce from "immer";
import { compose } from "redux";
import { withTheme } from "styled-components";

import { withNamespaces } from "@edulastic/localization";

import CorrectAnswers from "../../components/CorrectAnswers";
import withPoints from "../../components/HOC/withPoints";

import { EDIT } from "../../constants/constantsForQuestions";
import Options from "./components/Options";
import ChartPreview from "./ChartPreview";
import PointsList from "./components/PointsList";
import withGrid from "./HOC/withGrid";
import { getGridVariables, getReCalculatedPoints, getReCalculatedDATAPoints } from "./helpers";

import ComposeQuestion from "./ComposeQuestion";

const OptionsList = withPoints(ChartPreview);

const ChartEdit = ({ item, setQuestionData, t, fillSections, cleanSections, advancedAreOpen }) => {
  const {
    chart_data: { data },
    ui_style: { yAxisCount, stepSize, height, width, margin }
  } = item;
  const { yAxisStep, changingStep } = getGridVariables(yAxisCount, stepSize, data, height, width, margin);

  const [oldStep, setOldStep] = useState(yAxisStep);
  const [correctTab, setCorrectTab] = useState(0);
  const [localMaxValue, setLocalMaxValue] = useState(yAxisCount);

  const [firstMount, setFirstMount] = useState(false);

  useEffect(() => {
    if (firstMount) {
      setQuestionData(
        produce(item, draft => {
          const variables = { oldStep, yAxisCount, yAxisStep, changingStep };

          draft.chart_data.data = getReCalculatedDATAPoints(draft.chart_data.data, variables);

          draft.validation.alt_responses.forEach(altResp => {
            altResp.value = getReCalculatedPoints(altResp.value, variables);
          });

          draft.validation.valid_response.value = getReCalculatedPoints(
            draft.validation.valid_response.value,
            variables
          );
        })
      );
      setOldStep(yAxisStep);
    }
  }, [yAxisCount, stepSize]);

  useEffect(() => {
    setFirstMount(true);
  }, []);

  const handleAddPoint = () => {
    setQuestionData(
      produce(item, draft => {
        const newPoint = { x: `Bar ${draft.chart_data.data.length + 1}`, y: 0 };

        draft.chart_data.data.push({ ...newPoint });

        draft.validation.alt_responses.forEach(altResp => {
          altResp.value.push({ ...newPoint });
        });

        draft.validation.valid_response.value.push({ ...newPoint });
      })
    );
  };

  const handlePointChange = index => (prop, value) => {
    setQuestionData(
      produce(item, draft => {
        switch (prop) {
          case "interactive": {
            if (draft.chart_data.data[index].notInteractive === undefined) {
              draft.chart_data.data[index].notInteractive = true;
            } else {
              delete draft.chart_data.data[index].notInteractive;
            }
            break;
          }
          case "label": {
            draft.chart_data.data[index].x = value;
            draft.validation.alt_responses.forEach(altResp => {
              altResp.value[index].x = value;
            });
            draft.validation.valid_response.value[index].x = value;
            break;
          }
          case "value": {
            if (yAxisStep * value > yAxisCount * yAxisStep) {
              draft.chart_data.data[index].y = yAxisCount * yAxisStep;
            } else {
              draft.chart_data.data[index].y = yAxisStep * value;
            }
            break;
          }
          default:
        }
      })
    );
  };

  const handleDelete = index => {
    setQuestionData(
      produce(item, draft => {
        draft.chart_data.data.splice(index, 1);

        draft.validation.alt_responses.forEach(altResp => {
          altResp.value.splice(index, 1);
        });

        draft.validation.valid_response.value.splice(index, 1);
      })
    );
  };

  const handleCloseTab = tabIndex => {
    setQuestionData(
      produce(item, draft => {
        draft.validation.alt_responses.splice(tabIndex, 1);

        setCorrectTab(0);
      })
    );
  };

  const handleAddAnswer = () => {
    setQuestionData(
      produce(item, draft => {
        if (!draft.validation.alt_responses) {
          draft.validation.alt_responses = [];
        }
        draft.validation.alt_responses.push({
          score: 1,
          value: draft.validation.valid_response.value
        });
      })
    );
    setCorrectTab(correctTab + 1);
  };

  const handlePointsChange = val => {
    setQuestionData(
      produce(item, draft => {
        if (correctTab === 0) {
          draft.validation.valid_response.score = val;
        } else {
          draft.validation.alt_responses[correctTab - 1].score = val;
        }
      })
    );
  };

  const handleAnswerChange = ans => {
    setQuestionData(
      produce(item, draft => {
        if (correctTab === 0) {
          draft.validation.valid_response.value = ans;
        } else {
          draft.validation.alt_responses[correctTab - 1].value = ans;
        }
      })
    );
  };

  const renderOptions = () => (
    <OptionsList
      item={item}
      points={
        correctTab === 0 ? item.validation.valid_response.score : item.validation.alt_responses[correctTab - 1].score
      }
      onChangePoints={handlePointsChange}
      saveAnswer={handleAnswerChange}
      userAnswer={
        correctTab === 0 ? item.validation.valid_response.value : item.validation.alt_responses[correctTab - 1].value
      }
      view={EDIT}
    />
  );

  return (
    <Fragment>
      <ComposeQuestion
        item={item}
        localMaxValue={localMaxValue}
        setLocalMaxValue={setLocalMaxValue}
        fillSections={fillSections}
        cleanSections={cleanSections}
      />

      <PointsList
        handleChange={handlePointChange}
        ratio={yAxisStep}
        handleDelete={handleDelete}
        points={item.chart_data.data}
        buttonText={t("component.chart.addPoint")}
        onAdd={handleAddPoint}
        fillSections={fillSections}
        cleanSections={cleanSections}
      />

      <CorrectAnswers
        onTabChange={setCorrectTab}
        correctTab={correctTab}
        onAdd={handleAddAnswer}
        validation={item.validation}
        options={renderOptions()}
        onCloseTab={handleCloseTab}
        fillSections={fillSections}
        cleanSections={cleanSections}
      />

      <Options fillSections={fillSections} cleanSections={cleanSections} advancedAreOpen={advancedAreOpen} />
    </Fragment>
  );
};

ChartEdit.propTypes = {
  item: PropTypes.object.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
  advancedAreOpen: PropTypes.bool
};

ChartEdit.defaultProps = {
  advancedAreOpen: false,
  fillSections: () => {},
  cleanSections: () => {}
};

const enhance = compose(
  withNamespaces("assessment"),
  withTheme
);

export default enhance(ChartEdit);
