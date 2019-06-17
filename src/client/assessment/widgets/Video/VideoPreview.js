import React from "react";
import PropTypes from "prop-types";
import { Media, controls } from "react-media-player";

import { videoTypes } from "@edulastic/constants";

import { FlexContainer } from "@edulastic/common";
import { Subtitle } from "../../styled/Subtitle";
import { Label } from "../../styled/WidgetOptions/Label";
import { Player } from "./styled/Player";
import PlayPause from "./styled/PlayPause";
import Fullscreen from "./styled/Fullscreen";
import MuteUnmute from "./styled/MuteUnmute";
import SeekBar from "./styled/SeekBar";
import Volume from "./styled/Volume";
import { QuestionTitleWrapper, QuestionNumber } from "./styled/QustionNumber";

const { CurrentTime, Duration } = controls;

const VideoPreview = ({ item, showQuestionNumber, qIndex }) => (
  <div>
    <QuestionTitleWrapper>
      {showQuestionNumber && <QuestionNumber>{item.qLabel}</QuestionNumber>}
      {item.heading && <Subtitle>{item.heading}</Subtitle>}
    </QuestionTitleWrapper>
    {item.summary && <Label>{item.summary}</Label>}
    {item && item.ui_style && (
      <Media>
        {({ isFullscreen, playPause }) => (
          <div className="media">
            <div className={`media-player${isFullscreen ? " media-player--fullscreen" : ""}`} tabIndex="0">
              <Player
                poster={item.ui_style.posterImage}
                src={item.sourceURL}
                style={item.ui_style}
                onClick={playPause}
              />
            </div>
            {(!item.ui_style.hideControls || item.videoType === videoTypes.YOUTUBE) && (
              <FlexContainer style={{ width: item.ui_style.width }}>
                <PlayPause />
                <SeekBar style={{ width: item.ui_style.width - 338 }} />
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
    ui_style: PropTypes.shape({
      width: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired,
      posterImage: PropTypes.string.isRequired,
      captionURL: PropTypes.string.isRequired,
      hideControls: PropTypes.bool.isRequired
    }).isRequired
  }).isRequired,
  showQuestionNumber: PropTypes.bool,
  qIndex: PropTypes.number
};
VideoPreview.defaultProps = {
  showQuestionNumber: false,
  qIndex: null
};

export default VideoPreview;
