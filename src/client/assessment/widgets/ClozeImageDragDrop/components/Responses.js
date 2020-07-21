import React from "react";
import shuffle from "lodash/shuffle";
import PropTypes from "prop-types";

import DragItem from "@edulastic/common/src/components/DragDrop/DragItem";
import { MathSpan } from "@edulastic/common";

import { ChoiceItem, DragHandler } from "../../../components/ChoiceItem";

const Responses = ({ responses, dragHandler, shuffleOptions, transparentResponses, ...choiceStyle }) => {
  const dragItems = shuffleOptions ? shuffle(responses) : responses;

  return dragItems.map((option = "", index) => (
    <DragItem
      id={`response-item-${index}`}
      key={`response-item-${index}`}
      data={{ option, fromRespIndex: index }}
      size={{ width: choiceStyle.widthpx, height: choiceStyle.heightpx }}
    >
      <ChoiceItem style={choiceStyle} className={transparentResponses ? "draggable_box_transparent" : "draggable_box"}>
        {dragHandler && <DragHandler />}
        <MathSpan dangerouslySetInnerHTML={{ __html: option.value }} />
      </ChoiceItem>
    </DragItem>
  ));
};

Responses.propTypes = {
  responses: PropTypes.array.isRequired,
  dragHandler: PropTypes.bool,
  fontSize: PropTypes.string,
  heightpx: PropTypes.number.isRequired,
  maxWidth: PropTypes.number.isRequired,
  minWidth: PropTypes.number.isRequired,
  overflow: PropTypes.string,
  shuffleOptions: PropTypes.bool,
  transparentResponses: PropTypes.bool,
  width: PropTypes.number.isRequired,
  widthpx: PropTypes.number.isRequired
};

Responses.defaultProps = {
  dragHandler: false,
  overflow: "hidden",
  shuffleOptions: false,
  transparentResponses: false
};

export default React.memo(Responses);
