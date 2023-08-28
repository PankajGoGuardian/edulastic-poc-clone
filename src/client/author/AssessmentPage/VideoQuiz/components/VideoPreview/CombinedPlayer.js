import { EduElse, EduIf, EduThen } from '@edulastic/common'
import React from 'react'
import { StyledReactPlayer } from '../../styled-components/VideoPreview'
import { extractVideoId } from '../../utils/videoPreviewHelpers'
import YouTubePlayer from './YouTubePlayer'

const CombinedPlayer = React.forwardRef(({ url, ...props }, ref) => {
  const showTYEducational = !!extractVideoId(url)

  const playerProps = {
    ref,
    url,
    ...props,
  }

  return (
    <EduIf condition={showTYEducational}>
      <EduThen>
        <YouTubePlayer {...playerProps} />
      </EduThen>
      <EduElse>
        <StyledReactPlayer {...playerProps} />
      </EduElse>
    </EduIf>
  )
})

export default CombinedPlayer
