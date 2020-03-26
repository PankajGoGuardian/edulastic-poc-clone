import { useEffect, useState } from "react";

/**
 *  This custom hook returns container width when the zoom is applied
 *  @returns {number}
 */
const getZoomedResponsiveWidth = ({ windowWidth, diff, zoomLevel }) => {
  const minWidth = 480;
  const defaultContentWidth = 900;
  const [containerWidth, updateWidth] = useState(windowWidth - diff);

  useEffect(() => {
    const availableWidth = windowWidth - diff;
    let responsiveWidth = availableWidth;

    if (defaultContentWidth * zoomLevel > availableWidth) {
      if (availableWidth / zoomLevel < minWidth) {
        zoomLevel = availableWidth / minWidth;
        responsiveWidth = minWidth;
      } else {
        responsiveWidth = availableWidth / zoomLevel;
      }
    } else if (availableWidth / zoomLevel > defaultContentWidth && zoomLevel > "1") {
      responsiveWidth = availableWidth / zoomLevel;
    }
    // 20, 18 and 12 are right margin for right nave on zooming
    if (zoomLevel >= 1.5 && zoomLevel < 1.75) {
      responsiveWidth -= 20;
    }
    if (zoomLevel >= 1.75 && zoomLevel < 2.5) {
      responsiveWidth -= 18;
    }
    if (zoomLevel >= 2.5) {
      responsiveWidth -= 12;
    }
    updateWidth(responsiveWidth);
  }, [zoomLevel]);

  return containerWidth;
};

export default getZoomedResponsiveWidth;
