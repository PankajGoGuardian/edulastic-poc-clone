import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { Rnd } from "react-rnd";
import produce from "immer";
import { get } from "lodash";
import { lightGrey } from "@edulastic/colors";
import { setQuestionDataAction } from "../../../author/QuestionEditor/ducks";

const ResponseRnd = props => {
  const { children, question, setQuestionData, isResizable, minHeight, width, height, index } = props;

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
    const { responseOptions = [] } = question;
    const responseOption = responseOptions[index] || {};

    // It can happen that we don't have imageOptions on the question,
    // or it can happen that width or height are not number values

    let updatedWidth;
    if (responseOption && responseOption.width) {
      updatedWidth = responseOption.width + delta.width;
    } else if (typeof width === "number") {
      updatedWidth = width + delta.width;
    } else {
      updatedWidth = ref.getBoundingClientRect().width;
    }

    let updatedHeight;
    if (responseOption && responseOption.height) {
      updatedHeight = responseOption.height + delta.height;
    } else if (typeof height === "number") {
      updatedHeight = height + delta.height;
    } else {
      updatedHeight = ref.getBoundingClientRect().height;
    }

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
          width: updatedWidth,
          height: updatedHeight
        };
      })
    );
  };

  const rndX = get(question, `responseOptions[${index}].x`, 0);
  const rndY = get(question, `responseOptions[${index}].y`, 0);
  const rndWidth = get(question, `responseOptions[${index}].width`, width);
  const rndHeight = get(question, `responseOptions[${index}].height`, height);

  return (
    <div style={{ position: "relative", minHeight: height }}>
      <Rnd
        style={{
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          padding: "2px",
          border: `1px solid ${lightGrey}`
        }}
        default={{
          x: rndX,
          y: rndY,
          width: rndWidth,
          height: rndHeight
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
        {...props}
      >
        {React.Children.map(children, child => {
          return child ? React.cloneElement(child) : null;
        })}
      </Rnd>
    </div>
  );
};

ResponseRnd.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  isResizable: PropTypes.bool,
  minHeight: PropTypes.string || PropTypes.number,
  width: PropTypes.string || PropTypes.number,
  height: PropTypes.string || PropTypes.number,
  index: PropTypes.number,
  question: PropTypes.object.isRequired,
  setQuestionData: PropTypes.func.isRequired
};

ResponseRnd.defaultProps = {
  isResizable: true,
  minHeight: 0,
  width: "100%",
  height: "auto",
  index: 0
};

const enhance = compose(
  connect(
    null,
    { setQuestionData: setQuestionDataAction }
  )
);

export default enhance(ResponseRnd);
