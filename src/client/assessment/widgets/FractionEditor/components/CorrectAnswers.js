import React from "react";
import { Input } from "antd";
import get from "lodash/get";
import PropTypes from "prop-types";
import produce from "immer";
import { withNamespaces } from "@edulastic/localization";
import { getFormattedAttrId } from "@edulastic/common/src/helpers";
import { FlexContainer, notification } from "@edulastic/common";
import Question from "../../../components/Question/index";
import { Subtitle } from "../../../styled/Subtitle";
import Circles from "./Circles";
import Rectangles from "./Rectangles";
import Divider from "../styled/Divider";
import AnnotationRnd from "../../../components/Annotations/AnnotationRnd";
import { Label } from "../../../styled/WidgetOptions/Label";
import { PointsInput } from "../../../styled/CorrectAnswerHeader";

const CorrectAnswers = ({ setQuestionData, fillSections, cleanSections, t, item }) => {
  const { fractionProperties = {} } = item;
  const { selected, sectors = 7, fractionType, rows, columns, count } = fractionProperties;
  const totalSelections = fractionType === "circles" ? count * sectors : count * (rows * columns);
  const handleCorrectAnswerChange = e => {
    const value = +e.target.value;
    if (value > 0) {
      if (fractionType === "circles") {
        if (value > count * sectors) {
          notification({ type: "warn", messageKey: "valueCantBeGreaterThanSector" });
          return false;
        }
      } else if (value > count * (rows * columns)) {
        notification({ type: "warn", messageKey: "valueCantBeGreaterThanRectangles" });
        return false;
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
      notification({ type: "warn", messageKey: "valueCantBeLessThanOne" });
    }
  };

  const handleCorrectAnswerPointsChange = score => {
    if (+score > 0) {
      setQuestionData(
        produce(item, draft => {
          draft.validation.validResponse = {
            ...draft.validation.validResponse,
            score: +score
          };
        })
      );
    } else {
      notification({ messageKey: "scoreShouldBeGreateThanZero" });
    }
  };

  return (
    <Question
      section="main"
      label={t("common.correctAnswers.setCorrectAnswers")}
      fillSections={fillSections}
      cleanSections={cleanSections}
    >
      <Subtitle id={getFormattedAttrId(`${item?.title}-${t("common.correctAnswers.setCorrectAnswers")}`)}>
        {t("common.correctAnswers.setCorrectAnswers")}
      </Subtitle>
      <FlexContainer flexDirection="column" mt="8px" marginBottom="16px">
        <Label>{t("component.correctanswers.points")}</Label>
        <PointsInput
          type="number"
          min={1}
          id={getFormattedAttrId(`${item?.title}-${t("component.correctanswers.points")}`)}
          size="default"
          value={get(item, "validation.validResponse.score", 1)}
          onBlur={handleCorrectAnswerPointsChange}
          style={{ width: "140px", marginRight: "25px", background: "#F8F8FB" }}
        />
      </FlexContainer>
      <FlexContainer justifyContent="flex-start">
        <FlexContainer flexDirection="column" alignItems="center" justifyContent="center">
          <Input
            type="number"
            min={1}
            placeholder="Correct answer"
            size="default"
            value={selected.length}
            onChange={handleCorrectAnswerChange}
            style={{ width: "70px" }}
          />
          <Divider />
          <Input
            type="number"
            min={1}
            size="default"
            value={totalSelections}
            onChange={handleCorrectAnswerChange}
            style={{ width: "70px" }}
            disabled
          />
        </FlexContainer>
        <FlexContainer
          style={{
            overflow: "auto",
            position: "relative",
            minWidth: "660px",
            minHeight: "120px",
            maxWidth: "100%"
          }}
          justifyContent="center"
          alignItems="center"
          flexWrap="wrap"
        >
          {Array(count)
            .fill()
            .map((el, index) =>
              fractionType === "circles" ? (
                <Circles fractionNumber={index} sectors={sectors} selected={selected} sectorClick={() => {}} />
              ) : (
                <Rectangles
                  fractionNumber={index}
                  onSelect={() => {}}
                  rows={rows}
                  columns={columns}
                  selected={selected}
                />
              )
            )}
          <AnnotationRnd
            bounds="window"
            question={item}
            setQuestionData={setQuestionData}
            disableDragging={false}
            noBorder
          />
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

export default withNamespaces("assessment")(CorrectAnswers);
