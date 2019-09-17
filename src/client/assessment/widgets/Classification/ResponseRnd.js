import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { Rnd } from "react-rnd";
import produce from "immer";
import { get } from "lodash";
import { lightGrey } from "@edulastic/colors";
import { setQuestionDataAction } from "../../../author/QuestionEditor/ducks";

const ResponseRnd = props => {
  const { children, question, setQuestionData, isResizable, index, hasRowTitle = true } = props;

  const [minHeight, setMinHeight] = useState(get(question, `responseOptions[${index}].height`, 0));

  const handleResponseDragStop = (evt, d) => {
    setQuestionData(
      produce(question, draft => {
        if (!draft.responseOptions) {
          draft.responseOptions = [];
        }

        draft.responseOptions[index] = {
          ...draft.responseOptions[index],
          x: d.x,
          y: d.y
        };
      })
    );
  };

  const handleResponseResizeStop = (e, direction, ref, delta, position) => {
    const rect = ref.getBoundingClientRect();

    setMinHeight(rect.height);

    // Update question
    setQuestionData(
      produce(question, draft => {
        if (!draft.responseOptions) {
          draft.responseOptions = [];
        }

        draft.responseOptions[index] = {
          ...draft.responseOptions[index],
          x: position.x,
          y: position.y,
          width: rect.width,
          height: rect.height
        };
      })
    );
  };

  const handleResponseResize = () => {
    setMinHeight(0);
  };

  const offsetX = 215;
  const rndX = get(question, `responseOptions[${index}].x`, (hasRowTitle ? index + 1 : index) * offsetX);
  const rndY = get(question, `responseOptions[${index}].y`, 0);
  const rndWidth = get(question, `responseOptions[${index}].width`, 220);

  return (
    <Rnd
      style={{
        display: "flex",
        flexDirection: "column",
        padding: "2px",
        border: `1px solid ${lightGrey}`
      }}
      size={{ width: rndWidth, height: "auto" }}
      position={{ x: rndX, y: rndY }}
      default={{
        x: rndX,
        y: rndY,
        width: rndWidth,
        height: "auto"
      }}
      disableDragging={!isResizable}
      enableResizing={{
        bottom: isResizable,
        top: isResizable,
        bottomLeft: isResizable,
        bottomRight: isResizable,
        left: isResizable,
        right: isResizable,
        topLeft: isResizable,
        topRight: isResizable
      }}
      onDragStop={handleResponseDragStop}
      onResizeStop={handleResponseResizeStop}
      onResize={handleResponseResize}
      cancel=".drag-item"
      minHeight={minHeight}
      className="answer-draggable-wrapper"
    >
      {React.Children.map(children, child => (child ? React.cloneElement(child) : null))}
    </Rnd>
  );
};

ResponseRnd.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  isResizable: PropTypes.bool,
  index: PropTypes.number,
  question: PropTypes.object.isRequired,
  setQuestionData: PropTypes.func.isRequired
};

ResponseRnd.defaultProps = {
  isResizable: true,
  index: 0
};

const enhance = compose(
  connect(
    null,
    { setQuestionData: setQuestionDataAction }
  )
);

export default enhance(ResponseRnd);
