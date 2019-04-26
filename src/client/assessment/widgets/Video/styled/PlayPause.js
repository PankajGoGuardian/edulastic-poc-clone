import React from "react";
import { withMediaProps } from "react-media-player";
import { Circle, Polygon, G, Svg } from "./styledSVG";

const PlayPause = ({ media, style }) => {
  const _handlePlayPause = () => {
    media.playPause();
  };

  return (
    <Svg role="button" width="36px" height="36px" viewBox="0 0 36 36" style={style} onClick={_handlePlayPause}>
      <Circle cx="18" cy="18" r="18" />

      {media.isPlaying && (
        <G key="pause" style={{ transformOrigin: "0% 50%" }}>
          <rect x="12" y="11" width="4" height="14" />
          <rect x="20" y="11" width="4" height="14" />
        </G>
      )}

      {!media.isPlaying && <Polygon key="play" points="14,11 26,18 14,25" style={{ transformOrigin: "100% 50%" }} />}
    </Svg>
  );
};

export default withMediaProps(PlayPause);
