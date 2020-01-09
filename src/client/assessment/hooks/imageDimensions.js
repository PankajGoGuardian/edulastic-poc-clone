/**
 * this is used to calculate dimensions of image if any inside a html template
 * input {string}
 * output {object} containing height and width of image
 */

import { useState, useEffect } from "react";
import { templateHasImage, getImageUrl, getImageDimensions } from "@edulastic/common";

const imageDimensions = answer => {
  const [dimensions, setImageDimensions] = useState({ height: 1, width: 1 });

  useEffect(() => {
    const answerHasImage = templateHasImage(answer);
    if (answerHasImage) {
      const url = getImageUrl(answer);
      getImageDimensions(url).then(_dimensions => {
        setImageDimensions(_dimensions);
      });
    }
  }, [answer]);

  return dimensions;
};

export default imageDimensions;
