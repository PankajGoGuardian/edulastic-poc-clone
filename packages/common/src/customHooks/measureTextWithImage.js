/* eslint-disable func-names */
import { useState, useEffect } from "react";
import { getImageDimensions } from "@edulastic/common";
import { replaceLatexesWithMathHtml } from "@edulastic/common/src/utils/mathUtils";

const measureTextWithImage = ({ text, style = {}, tag1 = "div", tag2 = "span", targetChild = "", childStyle = {} }) => {
  const [dimensions, setDimensions] = useState({ height: 0, width: 0, scrollWidth: 0, scrollHeight: 0 });

  const updateDimensions = em => {
    setDimensions({
      width: em.offsetWidth + 10,
      height: em.offsetHeight,
      scrollWidth: em.scrollWidth + 10,
      scrollHeight: em.scrollHeight
    });
    document.body.removeChild(em);
  };

  useEffect(() => {
    if (window.$) {
      const fakeEm = document.createElement(tag1);
      const innerEm = document.createElement(tag2);
      document.body.appendChild(fakeEm);
      if (style.fontSize) {
        fakeEm.style.fontSize = style.fontSize;
      }

      if (style.padding) {
        fakeEm.style.padding = style.padding;
      }

      if (style.height) {
        fakeEm.style.height = style.height;
      }

      if (style.letterSpacing) {
        fakeEm.style.letterSpacing = style.letterSpacing;
      }

      if (style.lineHeight) {
        fakeEm.style.lightingColor = style.lineHeight;
      }

      if (style.maxWidth) {
        fakeEm.style.maxWidth = `${style.maxWidth}px`;
      }

      fakeEm.style.position = "absolute";
      fakeEm.style.left = "-1000px";
      fakeEm.style.top = "-1000px";
      fakeEm.style.visibility = "hidden";

      innerEm.innerHTML = replaceLatexesWithMathHtml(text);
      fakeEm.appendChild(innerEm);

      if (targetChild) {
        $(fakeEm)
          .find(targetChild)
          .css(childStyle);
      }

      $(fakeEm).each(function() {
        const parentEm = this;
        const hasImage = $(parentEm).find("img").length > 0;

        $(this)
          .find("img")
          .each(async function() {
            const imageSrc = $(this).attr("src");
            await getImageDimensions(imageSrc);
            updateDimensions(parentEm);
          });

        if (!hasImage) {
          updateDimensions(fakeEm);
        }
      });
    }
  }, [text]);

  return dimensions;
};

export default measureTextWithImage;
