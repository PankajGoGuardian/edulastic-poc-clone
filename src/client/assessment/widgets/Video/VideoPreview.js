import React from 'react'
import PropTypes from 'prop-types'
import { Media, controls } from 'react-media-player'

import { videoTypes } from '@edulastic/constants'

import { FlexContainer, QuestionNumberLabel } from '@edulastic/common'
import { Subtitle } from '../../styled/Subtitle'
import { Label } from '../../styled/WidgetOptions/Label'
import { Player } from './styled/Player'
import PlayPause from './styled/PlayPause'
import Fullscreen from './styled/Fullscreen'
import MuteUnmute from './styled/MuteUnmute'
import SeekBar from './styled/SeekBar'
import Volume from './styled/Volume'
import { QuestionTitleWrapper } from './styled/QustionNumber'
import VideoPreviewErrorBoundary from './components/ErrorBoundary'

const { CurrentTime, Duration } = controls

const VideoPreview = ({ item, showQuestionNumber, qIndex }) => (
  <div>
    <QuestionTitleWrapper>
      {showQuestionNumber && (
        <QuestionNumberLabel>{item.qLabel}:</QuestionNumberLabel>
      )}
      {item.heading && <Subtitle>{item.heading}</Subtitle>}
    </QuestionTitleWrapper>
    {item.summary && <Label data-cy="videoSummary">{item.summary}</Label>}
    {item && item.uiStyle && (
      <VideoPreviewErrorBoundary>
        <Media>
          {({ isFullscreen, playPause }) => (
            <div className="media">
              <div
                className={`media-player${
                  isFullscreen ? ' media-player--fullscreen' : ''
                }`}
                tabIndex="0"
              >
                <Player
                  poster={item.uiStyle.posterImage}
                  src={item.sourceURL}
                  style={{
                    ...item.uiStyle,
                    width: '100%',
                    maxWidth: item.uiStyle.width,
                  }}
                  onClick={playPause}
                />
              </div>
              {(!item.uiStyle.hideControls ||
                item.videoType === videoTypes.YOUTUBE) && (
                <FlexContainer
                  style={{ width: '100%', maxWidth: item.uiStyle.width }}
                >
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
      </VideoPreviewErrorBoundary>
    )}
  </div>
)

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
      hideControls: PropTypes.bool.isRequired,
    }).isRequired,
  }).isRequired,
  showQuestionNumber: PropTypes.bool,
  qIndex: PropTypes.number,
}
VideoPreview.defaultProps = {
  showQuestionNumber: false,
  qIndex: null,
}

export default VideoPreview
