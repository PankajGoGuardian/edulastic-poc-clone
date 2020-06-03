/* eslint-disable react/prop-types */
import React, { useState, useContext } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import produce from "immer";
import { get } from "lodash";
import { lightGrey } from "@edulastic/colors";
import { QuestionContext } from "@edulastic/common";
import { setQuestionDataAction } from "../../../author/QuestionEditor/ducks";
import { RndWrapper, Rnd } from "./styled/RndWrapper";

const ResponseRnd = props => {
  const {
    children,
    question,
    setQuestionData,
    isResizable,
    index,
    hasRowTitle = true,
    width,
    maxWidth,
    showIndex
  } = props;

  const { questionId } = useContext(QuestionContext);

  const [minHeight, setMinHeight] = useState(get(question, `responseOptions[${index}].height`, 0));

  const handleResponseDragStop = (evt, d) => {
    setQuestionData(
      produce(question, draft => {
        if (!draft.responseOptions) {
          draft.responseOptions = [];
        }

        draft.responseOptions[index] = {
          ...draft.responseOptions[index],
          x: d.x < 0 ? 0 : d.x,
          y: d.y < 0 ? 0 : d.y
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

  let offsetX = width + 40;

  if (offsetX > maxWidth) {
    offsetX = maxWidth;
  }

  if (showIndex) {
    offsetX += 45;
  }
  /**
   * +100 will be width of rowTitle
   * TODO: need to get width of rowTitle, if it is not set
   */
  const rndX = get(question, `responseOptions[${index}].x`, hasRowTitle ? index * offsetX + 100 : index * offsetX);
  const rndY = get(question, `responseOptions[${index}].y`, 0);
  const rndWidth = get(question, `responseOptions[${index}].width`, offsetX);
  return (
    <RndWrapper isResizable={isResizable} translateProps={`${rndX}px, ${rndY}px`}>
      <Rnd
        style={{
          padding: "2px",
          border: `1px solid ${lightGrey}`
        }}
        isResizable={isResizable}
        size={{ width: rndWidth, height: "auto" }}
        position={{ x: rndX, y: rndY }}
        disableDragging={!isResizable}
        onDragStop={handleResponseDragStop}
        onResizeStop={handleResponseResizeStop}
        onResize={handleResponseResize}
        cancel=".drag-item"
        minHeight={minHeight}
        className={`answer-draggable-wrapper-${questionId}`}
      >
        {React.Children.map(children, child => (child ? React.cloneElement(child) : null))}
      </Rnd>
    </RndWrapper>
  );
};

ResponseRnd.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  width: PropTypes.number,
  isResizable: PropTypes.bool,
  showIndex: PropTypes.bool,
  index: PropTypes.number,
  question: PropTypes.object.isRequired,
  setQuestionData: PropTypes.func.isRequired
};

ResponseRnd.defaultProps = {
  isResizable: true,
  showIndex: false,
  width: 220,
  index: 0
};

const enhance = compose(
  connect(
    null,
    { setQuestionData: setQuestionDataAction }
  )
);

export default enhance(ResponseRnd);
