/* eslint-disable func-names */
import { useEffect, useContext } from "react";
import { maxBy } from "lodash";
import { QuestionContext } from "@edulastic/common";

const TriggerStyle = () => {
  const { questionId } = useContext(QuestionContext);

  const setContainerStyle = () => {
    const colsContainer = $(`.classification-cols-container-${questionId}`);
    const colsWrappers = $(`.answer-draggable-wrapper-${questionId}`);

    const dimensions = [];
    colsWrappers.each(function(_i) {
      const clientWidth = $(this).width();
      const clientHeight = $(this).height();
      const { top, left } = $(this).position();
      dimensions[_i] = {
        width: clientWidth + left,
        height: clientHeight + top
      };
    });

    const contMaxWidth = maxBy(dimensions, d => d.width);
    const contMaxHeight = maxBy(dimensions, d => d.height);
    if (contMaxHeight && contMaxWidth) {
      $(colsContainer).height(contMaxHeight.height + 5);
      $(colsContainer).width(contMaxWidth.width + 5);
    }
  };

  useEffect(() => {
    if (window.$) {
      setContainerStyle();
    }
  });
  return null;
};

export default TriggerStyle;
