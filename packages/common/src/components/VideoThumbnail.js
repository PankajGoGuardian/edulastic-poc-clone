import React from "react";
import styled from "styled-components";
import { darkGrey1 } from "@edulastic/colors";

const VideoThumbnail = ({ width = "", maxWidth = "", title = "", margin = "" }) => {
  const imageStyle = {
    width,
    maxWidth,
    margin,
    border: `1px solid ${darkGrey1}`
  };

  return (
    <ImageFlexContainer {...imageStyle} alt={title}>
      <i className="fa fa-youtube-play fa-3x" aria-hidden="true" style={{ opacity: "0.75" }} />
    </ImageFlexContainer>
  );
};

export default VideoThumbnail;

const ImageFlexContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: "30px";
  background: url("https://img.youtube.com/vi/9IRCouBvAQ8/hqdefault.jpg");
  width: ${({ width }) => width || ""};
  max-width: ${({ maxWidth }) => maxWidth || ""};
  min-height: 128px;
  background-position: center; /* Center the image */
  background-repeat: no-repeat; /* Do not repeat the image */
  background-size: cover; /* Resize the background image to cover the entire container */
  border: 1px solid #dddddd;
  cursor: pointer;
`;
