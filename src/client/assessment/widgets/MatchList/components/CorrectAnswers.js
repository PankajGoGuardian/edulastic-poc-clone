import React, { Fragment } from "react";
import { FlexContainer, CorItem, MathFormulaDisplay } from "@edulastic/common";
import { StyledCorrectAnswersContainer } from "../styled/StyledCorrectAnswersContainer";
import { CorTitle } from "../styled/CorTitle";
import { Separator } from "../styled/Separator";
import { Index } from "../styled/Index";
import { getStemNumeration } from "../../../utils/helpers";

const CorrectAnswers = ({
  t,
  list,
  alternateAnswers,
  smallSize,
  allItemsById,
  validResponse,
  isPrintPreview,
  horizontallyAligned,
  stemNumeration
}) => {
  const correctAnswerBoxStyle = {
    width: isPrintPreview ? "100%" : horizontallyAligned ? 1050 : 750
  };

  const hasAlternateAnswers = Object.keys(alternateAnswers).length > 0;

  return (
    <Fragment>
      <StyledCorrectAnswersContainer
        className="__prevent-page-break"
        title={t("component.matchList.correctAnswers")}
        style={correctAnswerBoxStyle}
        titleMargin="0px 0px 20px"
      >
        {list.map((ite, i) => (
          <FlexContainer key={i} marginBottom="10px" alignItems="center" marginLeft="20px">
            <CorTitle>
              <MathFormulaDisplay dangerouslySetInnerHTML={{ __html: ite.label }} />
            </CorTitle>
            <Separator smallSize={smallSize} correctAnswer />
            <CorItem>
              <Index preview correctAnswer>
                {getStemNumeration(stemNumeration, i)}
              </Index>
              <MathFormulaDisplay
                choice
                dangerouslySetInnerHTML={{
                  __html: allItemsById?.[validResponse[list[i].value]]?.label || ""
                }}
              />
            </CorItem>
          </FlexContainer>
        ))}
      </StyledCorrectAnswersContainer>

      {hasAlternateAnswers && (
        <StyledCorrectAnswersContainer
          className="__prevent-page-break"
          title={t("component.matchList.alternateAnswers")}
          style={correctAnswerBoxStyle}
          titleMargin="0px 0px 20px"
        >
          {list.map((ite, i) => (
            <FlexContainer key={i} marginBottom="10px" alignItems="center" marginLeft="20px">
              <CorTitle>
                <MathFormulaDisplay dangerouslySetInnerHTML={{ __html: ite.label }} />
              </CorTitle>
              <Separator smallSize={smallSize} correctAnswer />
              <CorItem>
                <Index preview correctAnswer>
                  {getStemNumeration(stemNumeration, i)}
                </Index>
                <MathFormulaDisplay dangerouslySetInnerHTML={{ __html: alternateAnswers[ite.value].join(", ") }} />
              </CorItem>
            </FlexContainer>
          ))}
        </StyledCorrectAnswersContainer>
      )}
    </Fragment>
  );
};

export default CorrectAnswers;
