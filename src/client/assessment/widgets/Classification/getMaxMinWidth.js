/* eslint-disable*/
import { useState, useEffect, useRef } from "react";
import maxBy from "lodash/maxBy";
import minBy from "lodash/minBy";
import { measureText, getImageDimensions } from "@edulastic/common";

const getMaxMinWidth = (choices, fontSize) => {
  const dimensionsRef = useRef([null]);

  const setDimensions = (dimensions, index) => {
    dimensionsRef.current[index] = dimensions;
  };

  const measureTemplate = () => {
    choices.map(async function(choice, index) {
      const template = choice?.value || "";
      const parsedHTML = $("<div />").html(template);
      const hasImage = $(parsedHTML).find("img").length > 0;
      if (hasImage) {
        $(parsedHTML)
          .find("img")
          .each(async function() {
            // some images have width in style. for example: style="width:250px"
            // in this case, we don't need to get actual size
            const width = $(this).width();
            const height = $(this).height();
            if (!width) {
              const imageSrc = $(this).attr("src");
              const imageDimensions = await getImageDimensions(imageSrc);
              setDimensions(imageDimensions, index);
            } else {
              setDimensions({ width, height }, index);
            }
          });
      } else {
        setDimensions(measureText(template, { fontSize }), index);
      }
    });
  };

  useEffect(() => {
    dimensionsRef.current = Array.from({ length: choices.length }).fill(null);
    if (window.$) measureTemplate();
  }, [choices]);

  const dimensions = dimensionsRef.current;
  return {
    maxWidth: maxBy(dimensions, d => d?.width)?.width || 0,
    minWidth: minBy(dimensions, d => d?.width)?.width || 0,
    maxHeight: maxBy(dimensions, d => d?.height)?.height || 0,
    minHeight: minBy(dimensions, d => d?.height)?.height || 0
  };
};

export default getMaxMinWidth;
