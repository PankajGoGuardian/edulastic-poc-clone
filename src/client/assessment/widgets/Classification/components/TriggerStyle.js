/* eslint-disable func-names */
import { useEffect } from "react";
import { maxBy } from "lodash";

const TriggerStyle = () => {
  const setContainerStyle = () => {
    const colsContainer = $("#classification-cols-container");
    const colsWrappers = $(".answer-draggable-wrapper");

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
    $(colsContainer).height(contMaxHeight.height + 5);
    $(colsContainer).width(contMaxWidth.width + 5);
  };

  useEffect(() => {
    if (window.$) {
      setTimeout(() => {
        setContainerStyle();
      }, 150);
    }
  });
  return null;
};

export default TriggerStyle;
