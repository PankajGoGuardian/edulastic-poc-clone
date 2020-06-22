import React from "react";
import PropTypes from "prop-types";
import { DragDrop } from "@edulastic/common";

import Container from "./styled/Container";
import AnswerContent from "./TextContent";

const { DragItem } = DragDrop;
const TextContainer = ({ dropTargetIndex, userSelections, isSnapFitValues, style, isChecked, isPrintPreview }) => (
  <div
    className="text-wrapper"
    style={{ display: "flex", justifyContent: "flex-start", alignItems: "center", width: "100%" }}
  >
    {userSelections[dropTargetIndex] &&
      userSelections[dropTargetIndex].value.map((answer, user_select_index) => {
        const userAnswer = userSelections[dropTargetIndex].responseBoxID && isSnapFitValues ? answer : "";

        return (
          <DragItem
            key={user_select_index}
            data={{
              option: answer,
              fromContainerIndex: dropTargetIndex,
              fromRespIndex: user_select_index
            }}
          >
            <Container _lineHeight={style.height}>
              <AnswerContent
                userAnswer={userAnswer}
                answer={answer}
                height={style.height}
                width={style.width}
                isChecked={isChecked}
                isPrintPreview={isPrintPreview}
              />
            </Container>
          </DragItem>
        );
      })}
  </div>
);
TextContainer.propTypes = {
  dropTargetIndex: PropTypes.number.isRequired,
  userSelections: PropTypes.array.isRequired,
  isSnapFitValues: PropTypes.bool.isRequired,
  style: PropTypes.object.isRequired,
  isChecked: PropTypes.bool.isRequired
};

export default TextContainer;
