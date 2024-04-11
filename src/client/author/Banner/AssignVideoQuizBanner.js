import { segmentApi } from '@edulastic/api'
import { EduIf } from '@edulastic/common'
import { IconAssignVideoQuiz } from '@edulastic/icons'
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

  return (
    <EduIf condition={showBanner}>
      <Tooltip
        title="Easily Explain Concepts and Improve Mastery with Fun Interactive Video Quizzes!"
        placement="bottom"
        overlayClassName="vqTooltip"
      >
        <IconAssignVideoQuiz
          data-cy="VQBannerButton"
          onClick={handleBannerClick}
          style={{ marginTop: '-10px', cursor: 'pointer', ...style }}
        />
      </Tooltip>
    </EduIf>
  )
}

export default AssignVideoQuizBanner
