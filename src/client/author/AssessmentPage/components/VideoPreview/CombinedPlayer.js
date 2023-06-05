import React from 'react'
import { EduElse, EduIf, EduThen } from '@edulastic/common'
import { StyledReactPlayer } from './styled'
import { extractVideoId } from './utils'
import YouTubePlayer from './YouTubePlayer'
import appConfig from '../../../../../app-config'

const CombinedPlayer = React.forwardRef(({ url, ...props }, ref) => {
  const showTYEducational = appConfig.edYouTubePlayerKey && extractVideoId(url)

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
