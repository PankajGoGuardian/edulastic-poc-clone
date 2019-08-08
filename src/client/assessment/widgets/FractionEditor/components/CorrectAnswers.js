import React from "react";
import { Input, message } from "antd";
import { FlexContainer } from "@edulastic/common";
import { get } from "lodash";

import Question from "../../../components/Question/index";
import { Subtitle } from "../../../styled/Subtitle";
import Circles from "../components/Circles";
import Rectangles from "../components/Rectangles";
import Divider from "../styled/Divider";

const CorrectAnswers = ({ setQuestionData, produce, fillSections, cleanSections, t, item }) => {
  const { fractionProperties = {} } = item;
  const selected = fractionProperties.selected;
  const sectors = fractionProperties.sectors || 7;
  const fractionType = fractionProperties.fractionType;
  const rows = fractionProperties.rows;
  const columns = fractionProperties.columns;
  const count = fractionProperties.count;
  const totalSelections = fractionType === "circles" ? count * sectors : count * (rows * columns);

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
        <FlexContainer justifyContent="flex-start" flexWrap="wrap">
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
        </FlexContainer>
      </FlexContainer>
    </Question>
  );
};

export default CorrectAnswers;
