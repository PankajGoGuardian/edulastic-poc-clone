/* eslint-disable func-names */
/* eslint-disable no-undef */
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { MathSpan } from "@edulastic/common";

const convertNumToPixel = val => {
  if (val.toString().search("px") === -1) {
    return `${val}px`;
  }
  return val;
};

const Container = styled.div`
  img {
    height: ${({ height }) => `${convertNumToPixel(height)} !important`};
    width: ${({ width }) => `${convertNumToPixel(width)} !important`};
    margin: 0px !important;
  }
`;

const AnswerContainer = ({ answer, height, width }) => {
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
    <Container height={imageHeight} width={imageWidth}>
      <MathSpan
        dangerouslySetInnerHTML={{
          __html: answer
        }}
      />
    </Container>
  );
};

AnswerContainer.propTypes = {
  answer: PropTypes.string.isRequired,
  height: PropTypes.oneOfType(PropTypes.string, PropTypes.number).isRequired,
  width: PropTypes.oneOfType(PropTypes.string, PropTypes.number).isRequired
};

export default AnswerContainer;
