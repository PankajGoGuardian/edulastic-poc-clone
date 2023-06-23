import React from 'react'
import { StyledReactPlayer } from './styled'
import { extractVideoId } from './utils'
import YouTubePlayer from './YouTubePlayer'

const CombinedPlayer = React.forwardRef(({ url, ...props }, ref) => {
  const isYouTube = extractVideoId(url)

  return isYouTube ? (
    <YouTubePlayer ref={ref} url={url} {...props} />
  ) : (
    <StyledReactPlayer ref={ref} url={url} {...props} />
  )
})

export default CombinedPlayer
