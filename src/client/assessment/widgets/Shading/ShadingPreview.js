import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { cloneDeep, get } from "lodash";
import { Select, Input } from "antd";
import { compose } from "redux";
import { withTheme } from "styled-components";
import {
  Paper,
  Stimulus,
  FlexContainer,
  InstructorStimulus,
  CorrectAnswersContainer,
  QuestionNumberLabel
} from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";
import { AdaptiveSelect } from "./styled/AdaptiveSelect";
import { QuestionTitleWrapper } from "./styled/QustionNumber";
import {
  PREVIEW,
  BY_LOCATION_METHOD,
  BY_COUNT_METHOD,
  EDIT,
  CLEAR,
  CHECK,
  SHOW
} from "../../constants/constantsForQuestions";

import { Subtitle } from "../../styled/Subtitle";

import ShadesView from "./components/ShadesView";
import { getFontSize } from "../../utils/helpers";
import { StyledPaperWrapper } from "../../styled/Widget";

const { Option } = Select;

const ShadingPreview = ({
  view,
  item,
  smallSize,
  saveAnswer,
  userAnswer,
  method,
  t,
  previewTab,
  theme,
  showQuestionNumber,
  disableResponse,
  evaluation
}) => {
  const { canvas, validation } = item;
  const fontSize = getFontSize(get(item, "uiStyle.fontsize"));

  const [isCheck, setIsCheck] = useState(false);

  const cell_width = canvas ? canvas.cell_width : 1;
  const cell_height = canvas ? canvas.cell_height : 1;
  const rowCount = canvas ? canvas.rowCount : 1;
  const columnCount = canvas ? canvas.columnCount : 1;
  const shaded = canvas ? canvas.shaded : [];
  const read_only_author_cells = canvas ? canvas.read_only_author_cells : false;

  useEffect(() => {
    if (view === PREVIEW && userAnswer.length === 0) {
      if (!read_only_author_cells) {
        saveAnswer(cloneDeep(shaded));
      }
    }
  }, [view]);

  useEffect(() => {
    if (previewTab === CLEAR && view !== EDIT && isCheck && userAnswer.length === 0) {
      if (!read_only_author_cells) {
        saveAnswer(cloneDeep(shaded));
      } else {
        saveAnswer([]);
      }
    }
    if (previewTab === CHECK || previewTab === SHOW) {
      setIsCheck(true);
    } else {
      setIsCheck(false);
    }
  }, [previewTab]);

  useEffect(() => {
    if (previewTab === CHECK || previewTab === SHOW) {
      setIsCheck(true);
    } else {
      setIsCheck(false);
    }
  }, [evaluation]);

  useEffect(() => {
    setIsCheck(false);
  }, [userAnswer]);

  const handleCellClick = (rowNumber, colNumber) => () => {
    const newUserAnswer = cloneDeep(userAnswer);

    const indexOfSameShade = newUserAnswer.findIndex(shade => shade[0] === rowNumber && shade[1] === colNumber);

    if (indexOfSameShade === -1) {
      newUserAnswer.push([rowNumber, colNumber]);
    } else {
      newUserAnswer.splice(indexOfSameShade, 1);
    }

    if (item.maxSelection && newUserAnswer.length > item.maxSelection && view === PREVIEW) {
      return;
    }

    saveAnswer(newUserAnswer);
  };

  const handleSelectMethod = value => {
    saveAnswer(value, true);
  };

  const renderProps = {
    marginTop: smallSize ? 10 : 0,
    cellWidth: smallSize ? 1 : cell_width,
    cellHeight: smallSize ? 1 : cell_height,
    rowCount: smallSize ? 3 : rowCount,
    colCount: smallSize ? 8 : columnCount,
    border: item.border,
    hover: item.hover,
    hidden: get(item, "canvas.hidden", [])
  };

  const correctAnswers = (Array.isArray(userAnswer)
    ? userAnswer
    : userAnswer && Array.isArray(userAnswer.value)
    ? userAnswer.value
    : []
  ).filter((value, i) => evaluation && evaluation[i]);

  return (
    <StyledPaperWrapper style={{ fontSize }} padding={smallSize} boxShadow={smallSize ? "none" : ""}>
      <QuestionTitleWrapper>
        {showQuestionNumber && <QuestionNumberLabel>{item.qLabel}:</QuestionNumberLabel>}
        {view === PREVIEW && !smallSize && (
          <Stimulus data-cy="stimulus" dangerouslySetInnerHTML={{ __html: item.stimulus }} />
        )}
      </QuestionTitleWrapper>

      <FlexContainer alignItems="flex-start" flexDirection="column" padding="15px">
        {view === EDIT && (
          <Fragment>
            <Subtitle
              fontSize={theme.widgets.shading.subtitleFontSize}
              color={theme.widgets.shading.subtitleColor}
              margin="0"
            >
              {t("component.shading.methodSubtitle")}
            </Subtitle>
            <AdaptiveSelect value={method} onChange={handleSelectMethod}>
              <Option value={BY_LOCATION_METHOD}>{BY_LOCATION_METHOD}</Option>
              <Option value={BY_COUNT_METHOD}>{BY_COUNT_METHOD}</Option>
            </AdaptiveSelect>

            {method === BY_LOCATION_METHOD ? (
              <ShadesView
                {...renderProps}
                onCellClick={handleCellClick}
                shaded={Array.isArray(userAnswer) ? userAnswer : []}
                lockedCells={read_only_author_cells ? shaded : undefined}
              />
            ) : (
              <Input
                size="large"
                type="number"
                style={{ marginTop: 40, width: 320 }}
                value={Array.isArray(userAnswer[0]) ? 1 : userAnswer[0]}
                onChange={e => saveAnswer([e.target.value > 0 ? +e.target.value : 1])}
              />
            )}
          </Fragment>
        )}

        {view === PREVIEW && (
          <ShadesView
            {...renderProps}
            checkAnswers={isCheck}
            correctAnswers={correctAnswers}
            onCellClick={disableResponse ? () => {} : handleCellClick}
            shaded={Array.isArray(userAnswer) ? userAnswer : []}
            lockedCells={read_only_author_cells ? shaded : undefined}
          />
        )}

        {previewTab === SHOW && (
          <Fragment>
            <CorrectAnswersContainer title={t("component.shading.correctAnswer")}>
              {validation.validResponse.value.method === BY_LOCATION_METHOD ? (
                <ShadesView
                  {...renderProps}
                  correctAnswers={validation.validResponse.value.value}
                  showAnswers
                  onCellClick={() => {}}
                  shaded={[]}
                  lockedCells={read_only_author_cells ? shaded : undefined}
                />
              ) : (
                <Fragment>Any {validation.validResponse.value.value} cells</Fragment>
              )}
            </CorrectAnswersContainer>

            {validation.altResponses &&
              validation.altResponses.map((altAnswer, i) => (
                <CorrectAnswersContainer title={`${t("component.shading.alternateAnswer")} ${i + 1}`}>
                  {altAnswer.value.method === BY_LOCATION_METHOD ? (
                    <ShadesView
                      {...renderProps}
                      correctAnswers={altAnswer.value.value}
                      showAnswers
                      onCellClick={() => {}}
                      shaded={[]}
                      lockedCells={read_only_author_cells ? shaded : undefined}
                    />
                  ) : (
                    <Fragment>Any {altAnswer.value.value} cells</Fragment>
                  )}
                </CorrectAnswersContainer>
              ))}
          </Fragment>
        )}
      </FlexContainer>
    </StyledPaperWrapper>
  );
};

ShadingPreview.propTypes = {
  smallSize: PropTypes.bool,
  item: PropTypes.object.isRequired,
  view: PropTypes.string.isRequired,
  saveAnswer: PropTypes.func.isRequired,
  userAnswer: PropTypes.any,
  method: PropTypes.string,
  previewTab: PropTypes.string,
  t: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired,
  showQuestionNumber: PropTypes.bool,
  disableResponse: PropTypes.bool,
  evaluation: PropTypes.any
};

ShadingPreview.defaultProps = {
  smallSize: false,
  userAnswer: null,
  previewTab: CLEAR,
  method: "",
  showQuestionNumber: false,
  disableResponse: false,
  evaluation: null
};

const enhance = compose(
  withNamespaces("assessment"),
  withTheme
);

export default enhance(ShadingPreview);
