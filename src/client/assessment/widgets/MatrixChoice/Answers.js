import React, { Fragment, Component } from "react";
import PropTypes from "prop-types";
import produce from "immer";

import { withNamespaces } from "@edulastic/localization";
import { getFormattedAttrId } from "@edulastic/common/src/helpers";

import { CheckboxLabel } from "../../styled/CheckboxWithLabel";
import CorrectAnswers from "../../components/CorrectAnswers";
import withPoints from "../../components/HOC/withPoints";
import Question from "../../components/Question";
import Matrix from "./components/Matrix";

const MatrixWithPoints = withPoints(Matrix);

class Answers extends Component {
  state = {
    correctTab: 0
  };

  setCorrectTab = tabNumber => {
    this.setState({ correctTab: tabNumber });
  };

  render() {
    const { item, setQuestionData, t, fillSections, cleanSections } = this.props;
    const { correctTab } = this.state;

    const handleAddAnswer = () => {
      setQuestionData(
        produce(item, draft => {
          if (!draft.validation.altResponses) {
            draft.validation.altResponses = [];
          }
          draft.validation.altResponses.push({
            score: 1,
            value: item.validation.validResponse.value
          });
        })
      );
      this.setCorrectTab(correctTab + 1);
    };

    const handleCheck = (field, altIndex) => ({ rowIndex, columnIndex, checked }) => {
      setQuestionData(
        produce(item, draft => {
          let value;
          const rowIds = draft.responseIds[rowIndex];

          if (field === "validResponse") {
            value = draft.validation.validResponse.value;
          }

          if (field === "altResponses") {
            value = draft.validation.altResponses[altIndex].value;
          }
          const selectedId = rowIds[columnIndex];
          value[selectedId] = checked;
          if (!draft.multipleResponses) {
            rowIds.forEach(id => {
              if (id !== selectedId) {
                delete value[id];
              }
            });
          }

          if (field === "validResponse") {
            draft.validation.validResponse.value = value;
          }

          if (field === "altResponses") {
            draft.validation.altResponses[altIndex].value = value;
          }
        })
      );
    };

    const handleChangeValidPoints = points => {
      setQuestionData(
        produce(item, draft => {
          draft.validation.validResponse.score = points;
        })
      );
    };

    const handleChangeAltPoints = (points, i) => {
      setQuestionData(
        produce(item, draft => {
          draft.validation.altResponses[i].score = points;
        })
      );
    };

    const handleChangeMultiple = e => {
      const { checked } = e.target;
      setQuestionData(
        produce(item, draft => {
          draft.multipleResponses = checked;

          if (!checked) {
            draft.validation.validResponse.value = {};

            if (draft.validation.altResponses && draft.validation.altResponses.length) {
              draft.validation.altResponses.map(res => {
                res.value = {};
                return res;
              });
            }
          }
        })
      );
    };

    const handleCloseTab = tabIndex => {
      setQuestionData(
        produce(item, draft => {
          draft.validation.altResponses.splice(tabIndex, 1);
        })
      );

      this.setCorrectTab(correctTab - 1);
    };

    const renderOptions = () => (
      <div>
        <CheckboxLabel data-cy="multi" onChange={handleChangeMultiple} checked={item.multipleResponses}>
          {t("component.matrix.multipleResponses")}
        </CheckboxLabel>
      </div>
    );

    return (
      <Question
        section="main"
        label={t("component.correctanswers.setcorrectanswers")}
        fillSections={fillSections}
        cleanSections={cleanSections}
      >
        <CorrectAnswers
          onTabChange={this.setCorrectTab}
          correctTab={correctTab}
          onAdd={handleAddAnswer}
          validation={item.validation}
          options={renderOptions()}
          onCloseTab={handleCloseTab}
          fillSections={fillSections}
          cleanSections={cleanSections}
          questionType={item?.title}
        >
          <Fragment>
            {correctTab === 0 && (
              <div>
                <MatrixWithPoints
                  stems={item.stems}
                  options={item.options}
                  uiStyle={item.uiStyle}
                  response={item.validation.validResponse}
                  responseIds={item.responseIds}
                  isMultiple={item.multipleResponses}
                  onCheck={handleCheck("validResponse")}
                  points={item.validation.validResponse.score}
                  onChangePoints={points => handleChangeValidPoints(points)}
                  id={getFormattedAttrId(`${item?.title}-${t("component.correctanswers.points")}`)}
                  data-cy="points"
                />
              </div>
            )}
            {item.validation.altResponses &&
              !!item.validation.altResponses.length &&
              item.validation.altResponses.map((alter, i) => {
                if (i + 1 === correctTab) {
                  return (
                    <MatrixWithPoints
                      key={i}
                      stems={item.stems}
                      options={item.options}
                      uiStyle={item.uiStyle}
                      response={item.validation.altResponses[i]}
                      responseIds={item.responseIds}
                      isMultiple={item.multipleResponses}
                      onCheck={handleCheck("altResponses", i)}
                      points={item.validation.altResponses[i].score}
                      onChangePoints={points => handleChangeAltPoints(points, i)}
                    />
                  );
                }
                return null;
              })}
          </Fragment>
        </CorrectAnswers>
      </Question>
    );
  }
}

Answers.propTypes = {
  item: PropTypes.object.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func
};

Answers.defaultProps = {
  fillSections: () => {},
  cleanSections: () => {}
};

export default withNamespaces("assessment")(Answers);
