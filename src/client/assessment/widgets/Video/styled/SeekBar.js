import React from "react";
import { withMediaProps } from "react-media-player";

import { Slider } from "antd";

const SeekBar = ({ style, media }) => {
  const _handleChange = value => {
    media.seekTo(+value);
  };
  return (
    <Slider
      max={media.duration.toFixed(4)}
      value={media.currentTime}
      style={{ ...style }}
      onChange={_handleChange}
      tooltipVisible={false}
    />
  );
};

export default withMediaProps(SeekBar);
