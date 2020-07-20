import React from "react";
import PropTypes from "prop-types";
import { DragDrop } from "@edulastic/common";

import Container from "./styled/Container";
import AnswerContent from "./TextContent";

const { DragItem } = DragDrop;
const TextContainer = ({
  dropTargetIndex,
  options,
  userSelections,
  isSnapFitValues,
  style,
  isChecked,
  isPrintPreview
}) => (
  <div className="text" style={{ display: "flex", justifyContent: "flex-start", alignItems: "center" }}>
    {userSelections[dropTargetIndex] &&
      userSelections[dropTargetIndex].optionIds?.map((optionId, user_select_index) => {
        let userAnswer = "";
        if (userSelections[dropTargetIndex]?.responseBoxID && isSnapFitValues) {
          const option = options.find(_option => _option.id === optionId);
          if (option) {
            userAnswer = option.value;
          }
        }

        return (
          <DragItem
            key={user_select_index}
            data={{
              option: { id: optionId, value: userAnswer },
              fromContainerIndex: dropTargetIndex,
              fromRespIndex: user_select_index
            }}
          >
            <Container>
              <AnswerContent
                userAnswer={userAnswer}
                // answer={answer}
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
