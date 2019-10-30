import React from "react";
import PropTypes from "prop-types";
import { Media, controls } from "react-media-player";

import { videoTypes } from "@edulastic/constants";

import { FlexContainer, QuestionTitle } from "@edulastic/common";
import { Label } from "../../styled/WidgetOptions/Label";
import { Player } from "./styled/Player";
import PlayPause from "./styled/PlayPause";
import Fullscreen from "./styled/Fullscreen";
import MuteUnmute from "./styled/MuteUnmute";
import SeekBar from "./styled/SeekBar";
import Volume from "./styled/Volume";

const { CurrentTime, Duration } = controls;

const VideoPreview = ({ item, showQuestionNumber }) => (
  <div>
    <QuestionTitle show={showQuestionNumber} label={item.qLabel} stimulus={item.heading} />
    {item.summary && <Label>{item.summary}</Label>}
    {item && item.uiStyle && (
      <Media>
        {({ isFullscreen, playPause }) => (
          <div className="media">
            <div className={`media-player${isFullscreen ? " media-player--fullscreen" : ""}`} tabIndex="0">
              <Player
                poster={item.uiStyle.posterImage}
                src={item.sourceURL}
                style={{
                  ...item.uiStyle,
                  width: "100%",
                  maxWidth: item.uiStyle.width
                }}
                onClick={playPause}
              />
            </div>
            {(!item.uiStyle.hideControls || item.videoType === videoTypes.YOUTUBE) && (
              <FlexContainer style={{ width: "100%", maxWidth: item.uiStyle.width }}>
                <PlayPause />
                <SeekBar style={{ width: item.uiStyle.width - 338 }} />
                <div>
                  <CurrentTime /> / <Duration />
                </div>
                <MuteUnmute />
                <Volume />
                <Fullscreen />
              </FlexContainer>
            )}
          </div>
        )}
      </Media>
    )}
  </div>
);

VideoPreview.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    heading: PropTypes.string.isRequired,
    summary: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    videoType: PropTypes.string.isRequired,
    sourceURL: PropTypes.string.isRequired,
    transcript: PropTypes.string.isRequired,
    uiStyle: PropTypes.shape({
      width: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired,
      posterImage: PropTypes.string.isRequired,
      captionURL: PropTypes.string.isRequired,
      hideControls: PropTypes.bool.isRequired
    }).isRequired
  }).isRequired,
  showQuestionNumber: PropTypes.bool
};
VideoPreview.defaultProps = {
  showQuestionNumber: false
};

export default VideoPreview;
