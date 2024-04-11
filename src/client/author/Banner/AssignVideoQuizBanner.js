import { segmentApi } from '@edulastic/api'
import { EduIf } from '@edulastic/common'
import { IconAssignVideoQuiz, IconAssignVideoQuizSmall } from '@edulastic/icons'
import { Tooltip } from 'antd'
import React from 'react'

function AssignVideoQuizBanner({
  showBanner,
  clickedFrom,
  user,
  history,
  style = {},
}) {
  const handleBannerClick = () => {
    segmentApi.genericEventTrack('VQBannerButton', {
      userId: user._id,
      districtId: user.districtIds,
      role: user.role,
      origin: clickedFrom,
    })
    history.push('/author/vqlibrary')
  }

  const ComponentToRender =
    clickedFrom === 'LCB' ? IconAssignVideoQuizSmall : IconAssignVideoQuiz

  return (
    <EduIf condition={showBanner}>
      <Tooltip
        title="Easily Explain Concepts and Improve Mastery with Fun Interactive Video Quizzes!"
        placement="bottom"
        overlayClassName="vqTooltip"
      >
        <ComponentToRender
          data-cy="VQBannerButton"
          onClick={handleBannerClick}
          style={{
            marginTop: '-8px',
            cursor: 'pointer',
            ...style,
          }}
        />
      </Tooltip>
    </EduIf>
  )
}

export default AssignVideoQuizBanner
