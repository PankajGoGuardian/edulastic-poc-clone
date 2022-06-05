import React, { Fragment } from 'react'
import styled from 'styled-components'
import { IconClose } from '@edulastic/icons'
import {
  desktopWidth,
  mobileWidthLarge,
  secondaryTextColor,
} from '@edulastic/colors'

import ManageContentBlock from '../ManageContentBlock'
import SummaryBlock from './SummaryBlock'

const CurriculumRightPanel = ({
  showRightPanel,
  activeRightPanel,
  isStudent,
  urlHasUseThis,
  hideRightpanel,
  summaryData,
  isManageContentActive,
  isNotStudentOrParent,
  destinationCurriculumSequence,
  shouldHidCustomizeButton,
}) => {
  if (!showRightPanel || !activeRightPanel) {
    return <></>
  }

  const { subjects, grades = [], collections } = destinationCurriculumSequence
  const testsInPlaylist =
    destinationCurriculumSequence?.modules?.flatMap((m) =>
      m?.data?.map((d) => d?.contentId)
    ) || []
  const hasSummaryDataNoData = summaryData?.filter((item) =>
    item.hidden ? !item.value && !isStudent : !item.value
  ).length

  const showManageContent =
    ((isNotStudentOrParent &&
      isManageContentActive &&
      !urlHasUseThis &&
      !shouldHidCustomizeButton) ||
      (urlHasUseThis && isManageContentActive)) &&
    !isStudent
  const showSummaryBlock = !isManageContentActive || isStudent

  return (
    <RightContentWrapper data-cy="curriculum-sequence-right-panel">
      {(showManageContent || showSummaryBlock) && (
        <HideRightPanel onClick={hideRightpanel}>
          <IconClose />
        </HideRightPanel>
      )}
      {showManageContent && (
        <ManageContentBlock
          testsInPlaylist={testsInPlaylist}
          urlHasUseThis={urlHasUseThis}
          subjectsFromCurriculumSequence={subjects?.[0]}
          gradesFromCurriculumSequence={grades}
          collectionFromCurriculumSequence={collections?.[0]?._id}
          playlistId={destinationCurriculumSequence?._id}
        />
      )}
      {showSummaryBlock && (
        <SummaryBlock
          isStudent={isStudent}
          summaryData={summaryData}
          urlHasUseThis={urlHasUseThis}
          hasSummaryDataNoData={hasSummaryDataNoData}
        />
      )}
    </RightContentWrapper>
  )
}

export default CurriculumRightPanel

export const RightContentWrapper = styled.div`
  position: fixed;
  top: 62px;
  height: calc(100vh - 62px);
  right: 20px;
`

export const HideRightPanel = styled.div`
  position: absolute;
  right: 10px;
  top: 2rem;
  z-index: 50;
  cursor: pointer;

  svg {
    width: 12px;
    height: 12px;
    fill: ${secondaryTextColor};
  }

  @media (max-width: ${desktopWidth}) {
    position: fixed;
    top: ${(props) => props.theme.HeaderHeight?.sd + 18}px;
  }

  @media (max-width: ${mobileWidthLarge}) {
    top: ${(props) => props.theme.HeaderHeight?.xs + 18}px;
  }
`
