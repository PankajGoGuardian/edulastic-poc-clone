import "rc-color-picker/assets/index.css";
import React, { Fragment, useState, useEffect } from "react";
import PropTypes from "prop-types";
import produce from "immer";
import { compose } from "redux";
import { withTheme } from "styled-components";

import { withNamespaces } from "@edulastic/localization";
import { questionType } from "@edulastic/constants";
import Annotations from "../../components/Annotations/Annotations";

import CorrectAnswers from "../../components/CorrectAnswers";
import withPoints from "../../components/HOC/withPoints";

import { EDIT } from "../../constants/constantsForQuestions";
import Options from "./components/Options";
import ChartPreview from "./ChartPreview";
import PointsList from "./components/PointsList";
import { getReCalculatedPoints } from "./helpers";

import ComposeQuestion from "./ComposeQuestion";
import { Widget } from "../../styled/Widget";

const OptionsList = withPoints(ChartPreview);

const ChartEdit = ({ item, setQuestionData, t, fillSections, cleanSections, advancedAreOpen }) => {
  const {
    uiStyle: { yAxisMax, yAxisMin, snapTo },
    type
  } = item;

  const [correctTab, setCorrectTab] = useState(0);
  const [firstMount, setFirstMount] = useState(false);

  useEffect(() => {
    if (firstMount) {
      setQuestionData(
        produce(item, draft => {
          const params = { yAxisMax, yAxisMin, snapTo };
          draft.chart_data.data = getReCalculatedPoints(draft.chart_data.data, params);

          draft.validation.altResponses.forEach(altResp => {
            altResp.value = getReCalculatedPoints(altResp.value, params);
          });

          draft.validation.validResponse.value = getReCalculatedPoints(draft.validation.validResponse.value, params);
        })
      );
    }
  }, [yAxisMax, yAxisMin, snapTo]);

  useEffect(() => {
    setFirstMount(true);
  }, []);

  const handleAddPoint = () => {
    setQuestionData(
      produce(item, draft => {
        let initValue = yAxisMin;
        if (
          draft.type === questionType.HISTOGRAM ||
          draft.type === questionType.BAR_CHART ||
          draft.type === questionType.LINE_CHART
        ) {
          initValue = yAxisMax;
        }
        const newPoint = { x: `Bar ${draft.chart_data.data.length + 1}`, y: initValue };

        draft.chart_data.data.push({ ...newPoint });

        draft.validation.altResponses.forEach(altResp => {
          altResp.value.push({ ...newPoint });
        });

        draft.validation.validResponse.value.push({ ...newPoint });
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
            draft.validation.altResponses.forEach(altResp => {
              altResp.value[index].x = value;
            });
            draft.validation.validResponse.value[index].x = value;
            break;
          }
          case "value": {
            draft.chart_data.data[index].y = value > yAxisMax ? yAxisMax : value < yAxisMin ? yAxisMin : value;
            break;
          }
          case "labelVisibility": {
            draft.chart_data.data[index].labelVisibility = value;
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

        draft.validation.altResponses.forEach(altResp => {
          altResp.value.splice(index, 1);
        });

        draft.validation.validResponse.value.splice(index, 1);
      })
    );
  };

  const handleCloseTab = tabIndex => {
    setQuestionData(
      produce(item, draft => {
        draft.validation.altResponses.splice(tabIndex, 1);

        setCorrectTab(0);
      })
    );
  };

  const handleAddAnswer = () => {
    setQuestionData(
      produce(item, draft => {
        let initValue = yAxisMin;
        if (
          draft.type === questionType.HISTOGRAM ||
          draft.type === questionType.BAR_CHART ||
          draft.type === questionType.LINE_CHART
        ) {
          initValue = yAxisMax;
        }
        if (!draft.validation.altResponses) {
          draft.validation.altResponses = [];
        }
        draft.validation.altResponses.push({
          score: 1,
          value: draft.validation.validResponse.value.map(chartData => ({ ...chartData, y: initValue }))
        });
      })
    );
    setCorrectTab(correctTab + 1);
  };

  const handlePointsChange = val => {
    setQuestionData(
      produce(item, draft => {
        if (correctTab === 0) {
          draft.validation.validResponse.score = val;
        } else {
          draft.validation.altResponses[correctTab - 1].score = val;
        }
      })
    );
  };

  const handleAnswerChange = ans => {
    setQuestionData(
      produce(item, draft => {
        if (correctTab === 0) {
          draft.validation.validResponse.value = ans;
        } else {
          draft.validation.altResponses[correctTab - 1].value = ans;
        }
      })
    );
  };

  const renderOptions = () => (
    <OptionsList
      item={item}
      points={
        correctTab === 0 ? item.validation.validResponse.score : item.validation.altResponses[correctTab - 1].score
      }
      tab={correctTab}
      onChangePoints={handlePointsChange}
      saveAnswer={handleAnswerChange}
      userAnswer={
        correctTab === 0 ? item.validation.validResponse.value : item.validation.altResponses[correctTab - 1].value
      }
      view={EDIT}
      setQuestionData={setQuestionData}
    />
  );

  return (
    <Fragment>
      <ComposeQuestion
        item={item}
        setQuestionData={setQuestionData}
        fillSections={fillSections}
        cleanSections={cleanSections}
      />

      <PointsList
        showLabelVisibilitySetting={type === questionType.LINE_PLOT || type === questionType.DOT_PLOT}
        handleChange={handlePointChange}
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

      <Widget style={{ display: advancedAreOpen ? "block" : "none" }}>
        <Annotations question={item} setQuestionData={setQuestionData} editable />
      </Widget>

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
