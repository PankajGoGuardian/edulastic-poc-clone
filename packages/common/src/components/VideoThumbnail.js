import React from "react";
import styled from "styled-components";
import { darkGrey1 } from "@edulastic/colors";
import { youtubeVideoDetails } from "@edulastic/constants";

const VideoThumbnail = ({ width = "", maxWidth = "", title = "", margin = "", questionTitle = "" }) => {
  const imageStyle = {
    width,
    maxWidth,
    margin,
    border: `1px solid ${darkGrey1}`
  };

  const videoDetails = youtubeVideoDetails[questionTitle];

  // loads component only when video details is available
  if (!videoDetails) return null;

  const { videoId } = videoDetails;

  const thumbNailSource = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  return (
    <ImageFlexContainer {...imageStyle} thumbNailSource={thumbNailSource} alt={title}>
      <i className="fa fa-youtube-play fa-3x" aria-hidden="true" style={{ opacity: "0.75" }} />
    </ImageFlexContainer>
  );
};

const ImageFlexContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: "30px";
  background: url(${({ thumbNailSource }) => thumbNailSource});
  width: ${({ width }) => width || ""};
  max-width: ${({ maxWidth }) => maxWidth || ""};
  min-height: 128px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  border: 1px solid #dddddd;
  cursor: pointer;
`;

export default VideoThumbnail;
