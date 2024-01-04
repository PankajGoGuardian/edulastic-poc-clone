import React from 'react'
import { EduButton } from '@edulastic/common'
import { IconTick } from '@edulastic/icons'
import { themeColor } from '@edulastic/colors'
import { SECTION_STATUS } from '@edulastic/constants/const/testActivityStatus'
import { Completed } from '../styled-components'

const SectionActionButtons = ({
  attempted,
  skipped,
  preventSectionNavigation,
  handleReviewSection,
  handleStartSection,
  showLockIcon,
  index,
  status,
  isTestPreviewModal,
}) => {
  // Tried applying EduIf here but looks so much nested hence going with this approach for readability
  const totalVisited = attempted + skipped
  const showContinueButtonInTestPreviewCondition =
    isTestPreviewModal &&
    totalVisited > 0 &&
    status === SECTION_STATUS.SUBMITTED &&
    !preventSectionNavigation

  if (totalVisited === 0 && !showLockIcon) {
    return (
      <EduButton
        onClick={handleStartSection(index)}
        data-cy={`startButtton-${index}`}
      >
        Start Test
      </EduButton>
    )
  }
  if (
    (totalVisited > 0 && status !== SECTION_STATUS.SUBMITTED) ||
    showContinueButtonInTestPreviewCondition
  ) {
    return (
      <EduButton
        onClick={handleStartSection(index, true)}
        data-cy={`continueButton-${index}`}
      >
        Continue
      </EduButton>
    )
  }
  if (preventSectionNavigation && status === SECTION_STATUS.SUBMITTED) {
    return (
      <Completed data-cy={`completedSectionStatus-${index}`}>
        <IconTick fill={themeColor} />
        Completed
      </Completed>
    )
  }
  if (!isTestPreviewModal && status === SECTION_STATUS.SUBMITTED) {
    return (
      <EduButton
        onClick={handleReviewSection(index)}
        data-cy={`reviewButton-${index}`}
      >
        Review
      </EduButton>
    )
  }
  return null
}

export default SectionActionButtons
