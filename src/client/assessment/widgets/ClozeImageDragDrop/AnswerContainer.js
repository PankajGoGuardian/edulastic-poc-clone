import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { MathSpan } from "@edulastic/common";

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    margin: 0px !important;
    max-width: 100%;
  }
`;

const AnswerContainer = ({ answer, height, width, isWrapText, fontSize }) => {
  const [imageOriginalSize, setSize] = useState({ width: 1, height: 1 });

  const getImageWidth = (index, em) => {
    const img = new Image();
    // eslint-disable-next-line
    img.onload = function() {
      // eslint-disable-next-line
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
      <MathSpan
        style={{ height: "100%", width: "100%", display: "flex", alignItems: "center", fontSize }}
        dangerouslySetInnerHTML={{ __html: answer }}
      />
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
