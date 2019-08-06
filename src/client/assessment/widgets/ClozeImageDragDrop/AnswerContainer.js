/* eslint-disable func-names */
/* eslint-disable no-undef */
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Tooltip } from "antd";
import { MathSpan } from "@edulastic/common";

const convertNumToPixel = val => {
  if (val.toString().search("px") === -1) {
    return `${val}px`;
  }
  return val;
};

const Container = styled.div`
  width: 100%;
  img {
    height: ${({ height }) => `${convertNumToPixel(height)} !important`};
    width: ${({ width }) => `${convertNumToPixel(width)} !important`};
    margin: 0px !important;
  }
  .clipText {
    white-space: ${({ isWrapText }) => (isWrapText ? "normal" : "nowrap")};
    height: ${({ containerH, isWrapText }) =>
      isWrapText ? (containerH ? convertNumToPixel(parseInt(containerH, 10) - 10) : "auto") : "auto"};
  }
`;

const AnswerContainer = ({ answer, height, width, isWrapText }) => {
  const [imageOriginalSize, setSize] = useState({ width: 1, height: 1 });
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

  return (
    <Container height={imageHeight} containerH={height} width={imageWidth} isWrapText={isWrapText}>
      <Tooltip
        placement="bottomLeft"
        title={() => (
          <MathSpan
            dangerouslySetInnerHTML={{
              __html: answer || ""
            }}
          />
        )}
      >
        <MathSpan
          dangerouslySetInnerHTML={{
            __html: answer.replace("<p>", "<p class='clipText'>") || ""
          }}
        />
      </Tooltip>
    </Container>
  );
};

AnswerContainer.propTypes = {
  answer: PropTypes.string.isRequired,
  isWrapText: PropTypes.bool.isRequired,
  height: PropTypes.oneOfType(PropTypes.string, PropTypes.number).isRequired,
  width: PropTypes.oneOfType(PropTypes.string, PropTypes.number).isRequired
};

export default AnswerContainer;
