/* eslint-disable react/prop-types */
/* eslint-disable func-names */
/* eslint-disable no-undef */
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Popover } from "antd";
import { MathSpan, measureText } from "@edulastic/common";

const convertNumToPixel = val => {
  if (val.toString().search("px") === -1) {
    return `${val}px`;
  }
  return val;
};

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    height: 100%;
    width: 100%;
    margin: 0px !important;
    max-width: 100%;
  }
  .clipText {
    white-space: ${({ isWrapText }) => (isWrapText ? "normal" : "nowrap")};
    height: ${({ containerH, isWrapText }) =>
      isWrapText ? (containerH ? convertNumToPixel(parseInt(containerH, 10) - 10) : "auto") : "auto"};
  }
`;

const AnswerContainer = ({ answer, height, width, isWrapText, fontSize }) => {
  const [imageOriginalSize, setSize] = useState({ width: 1, height: 1 });
  const [showPopover, togglePopover] = useState(false);

  const getImageWidth = (index, em) => {
    const img = new Image();

    img.onload = function() {
      // eslint-disable-next-line react/no-this-in-sfc
      setSize({ width: this.width, height: this.height });
    };
    img.src = $(em).attr("src");
  };

  useEffect(() => {
    if (!window.$) {
      return;
    }
    const parsedHTML = $("<div />").html(answer);
    $(parsedHTML)
      .find("img")
      .each(getImageWidth);
  }, [answer]);

  // keep the image aspect ratio
  // 20 is padding and margin of Dropable box
  let imageWidth = parseInt(width, 10) - 20;
  let imageHeight = parseInt(height, 10) - 20;

  if (imageWidth > imageHeight) {
    imageWidth = Math.round((imageOriginalSize.width * imageHeight) / imageOriginalSize.height);
  } else {
    imageHeight = Math.round((imageOriginalSize.height * imageWidth) / imageOriginalSize.width);
  }
  const { width: contentWidth } = measureText(answer, { fontSize });
  const isOverText = width < contentWidth || height < imageOriginalSize.height;
  const content = (
    <div style={{ overflow: "hidden" }}>
      <MathSpan dangerouslySetInnerHTML={{ __html: answer || "" }} />
    </div>
  );

  return (
    <Container
      height={imageHeight}
      containerH={height}
      width={imageWidth}
      isWrapText={isWrapText}
      onMouseLeave={() => togglePopover(false)}
      onMouseEnter={() => togglePopover(true)}
    >
      <Popover placement="bottomLeft" content={content} visible={isOverText && showPopover}>
        <MathSpan
          style={{ height: "100%", width: "100%", display: "flex", alignItems: "center" }}
          dangerouslySetInnerHTML={{
            __html: answer.replace("<p>", "<p class='clipText'>") || ""
          }}
        />
      </Popover>
    </Container>
  );
};

AnswerContainer.propTypes = {
  answer: PropTypes.string.isRequired,
  isWrapText: PropTypes.bool.isRequired,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
};

export default AnswerContainer;
