import React from "react";
import { Input, message } from "antd";
import get from "lodash/get";
import PropTypes from "prop-types";
import produce from "immer";

import { FlexContainer } from "@edulastic/common";
import Question from "../../../components/Question/index";
import { Subtitle } from "../../../styled/Subtitle";
import Circles from "./Circles";
import Rectangles from "./Rectangles";
import Divider from "../styled/Divider";
import AnnotationRnd from "../../../components/Annotations/AnnotationRnd";

const CorrectAnswers = ({ setQuestionData, fillSections, cleanSections, t, item }) => {
  const { fractionProperties = {} } = item;
  const { selected, sectors = 7, fractionType, rows, columns, count } = fractionProperties;
  const totalSelections = fractionType === "circles" ? count * sectors : count * (rows * columns);
  const hideAnnotations = get(item, "options.hideAnnotations", false);
  const handleCorrectAnswerChange = e => {
    const value = +e.target.value;
    if (value > 0) {
      if (fractionType === "circles") {
        if (value > count * sectors) {
          message.warning("Value cannot be greater than number of sectors");
          return false;
        }
      } else {
        if (value > count * (rows * columns)) {
          message.warning("Value cannot be greater than total rectangles");
          return false;
        }
      }
      setQuestionData(
        produce(item, draft => {
          draft.validation.validResponse = draft.validation.validResponse || {};
          draft.validation.validResponse.value = value;
          draft.fractionProperties.selected = Array(value)
            .fill()
            .map((el, i) => i + 1);
        })
      );
    } else {
      message.warning("Value cannot be less than 1");
    }
  };

  const handleCorrectAnswerPointsChange = e => {
    if (+e.target.value >= 1) {
      setQuestionData(
        produce(item, draft => {
          draft.validation.validResponse = {
            ...draft.validation.validResponse,
            score: +e.target.value
          };
        })
      );
    }
  };

  return (
    <Question
      section="main"
      label={t("common.correctAnswers.setCorrectAnswers")}
      fillSections={fillSections}
      cleanSections={cleanSections}
    >
      <Subtitle>{t("common.correctAnswers.setCorrectAnswers")}</Subtitle>
      <FlexContainer justifyContent="flex-start" marginBottom="1em">
        <Input
          type="number"
          value={get(item, "validation.validResponse.score", 1)}
          onChange={handleCorrectAnswerPointsChange}
          style={{ width: "190px", marginRight: "5px" }}
        />
        POINTS
      </FlexContainer>
      <FlexContainer justifyContent="flex-start">
        <FlexContainer flexDirection="column">
          <Input
            type="number"
            placeholder="Correct answer"
            size="default"
            value={selected.length}
            onChange={handleCorrectAnswerChange}
            style={{ width: "70px" }}
          />
          <Divider />
          <Input
            type="number"
            size="default"
            value={totalSelections}
            onChange={handleCorrectAnswerChange}
            style={{ width: "70px" }}
            disabled
          />
        </FlexContainer>
        <FlexContainer
          style={{ overflow: "auto", position: "relative", height: "425px", width: "700px" }}
          justifyContent="flex-start"
          flexWrap="wrap"
        >
          {Array(count)
            .fill()
            .map((el, index) => {
              return fractionType === "circles" ? (
                <Circles fractionNumber={index} sectors={sectors} selected={selected} sectorClick={() => {}} />
              ) : (
                <Rectangles
                  fractionNumber={index}
                  onSelect={() => {}}
                  rows={rows}
                  columns={columns}
                  selected={selected}
                />
              );
            })}
          {!hideAnnotations && (
            <AnnotationRnd
              bounds={"window"}
              question={item}
              setQuestionData={setQuestionData}
              disableDragging={false}
            />
          )}
        </FlexContainer>
      </FlexContainer>
    </Question>
  );
};

CorrectAnswers.propTypes = {
  item: PropTypes.object,
  setQuestionData: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func
};

CorrectAnswers.defaultProps = {
  item: {},
  fillSections: () => {},
  cleanSections: () => {}
};

export default CorrectAnswers;
