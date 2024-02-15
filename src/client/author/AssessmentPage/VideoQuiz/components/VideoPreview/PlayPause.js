import React from 'react'
import { Circle, Polygon, G, Svg } from '../../styled-components/styledSVG'

const PlayPause = ({ isPlaying, style, onPlay, onPause }) => {
  const _handlePlayPause = () => {
    if (isPlaying) {
      onPause()
    } else {
      onPlay()
    }
  }

  return (
    <Svg
      role="button"
      width="36px"
      height="36px"
      viewBox="0 0 36 36"
      style={style}
      onClick={_handlePlayPause}
      data-cy="playPauseIcon"
    >
      <Circle cx="18" cy="18" r="18" />

      {isPlaying && (
        <G key="pause" style={{ transformOrigin: '0% 50%' }}>
          <rect x="12" y="11" width="4" height="14" />
          <rect x="20" y="11" width="4" height="14" />
        </G>
      )}

      {!isPlaying && (
        <Polygon
          key="play"
          points="14,11 26,18 14,25"
          style={{ transformOrigin: '100% 50%' }}
        />
      )}
    </Svg>
  )
}

export default PlayPause
