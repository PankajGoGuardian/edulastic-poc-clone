/* eslint-disable react/prop-types */
import React from "react";
import { withTheme } from "styled-components";
import { get } from "lodash";
import { MathSpan, DragDrop } from "@edulastic/common";
import striptags from "striptags";

import { IconWrapper } from "./CheckboxTemplateBoxLayout/styled/IconWrapper";
import { RightIcon } from "./CheckboxTemplateBoxLayout/styled/RightIcon";
import { WrongIcon } from "./CheckboxTemplateBoxLayout/styled/WrongIcon";

import { ChoiceItem } from "../../../components/ChoiceItem";

const { DragItem, DropContainer } = DragDrop;

const SnapItemContainers = ({
  choiceStyle,
  userAnswers,
  evaluation,
  smallSize,
  showDashedBorder,
  showAnswer,
  checkAnswer,
  backgroundColor,
  onDrop
}) => (
  <DropContainer index={0} drop={onDrop} data-cy="drop-container" style={{ height: "100%" }}>
    {userAnswers.map((userAnswer, index) =>
      get(userAnswer, "value", []).map((answer, answerIndex) => {
        const title = striptags(answer) || null;
        const { rect } = userAnswer;
        const status = evaluation[index];
        const itemStyle = {
          top: smallSize ? rect.top / 2 : rect.top,
          left: smallSize ? rect.left / 2 : rect.left,
          position: "absolute",
          zIndex: 40
        };
        return (
          <DragItem
            key={answerIndex}
            title={title}
            style={itemStyle}
            data={{ option: answer, fromContainerIndex: index, fromRespIndex: index }}
            size={{ width: choiceStyle.widthpx, height: choiceStyle.heightpx }}
          >
            <ChoiceItem
              style={{
                ...choiceStyle,
                margin: 0,
                border: showDashedBorder ? `dashed 2px` : `solid 1px`,
                background: !showAnswer && !checkAnswer ? backgroundColor : status ? "#d3fea6" : "#fce0e8"
              }}
            >
              <MathSpan dangerouslySetInnerHTML={{ __html: answer || "" }} />
              {(checkAnswer || showAnswer) && (
                <IconWrapper right={10}>{status ? <RightIcon /> : <WrongIcon />}</IconWrapper>
              )}
            </ChoiceItem>
          </DragItem>
        );
      })
    )}
  </DropContainer>
);

export default withTheme(SnapItemContainers);
