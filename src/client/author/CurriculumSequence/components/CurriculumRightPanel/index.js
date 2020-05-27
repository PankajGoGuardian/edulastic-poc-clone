import React, { Fragment } from "react";
import styled from "styled-components";
import { IconClose } from "@edulastic/icons";
import { desktopWidth, smallDesktopWidth, secondaryTextColor } from "@edulastic/colors";

import ManageContentBlock from "../ManageContentBlock";
import SummaryBlock from "./SummaryBlock";

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
  shouldHidCustomizeButton
}) => {
  if (!showRightPanel || !activeRightPanel) {
    return <Fragment />;
  }

  const { subjects, grades = [], collections } = destinationCurriculumSequence;
  const testsInPlaylist = destinationCurriculumSequence?.modules?.flatMap(m => m?.data?.map(d => d?.contentId)) || [];
  const hasSummaryDataNoData = summaryData?.filter(item => (item.hidden ? !item.value && !isStudent : !item.value))
    .length;

  return (
    <div data-cy="curriculum-sequence-right-panel" style={{ position: "relative" }}>
      {showRightPanel && !shouldHidCustomizeButton && (
        <HideRightPanel onClick={hideRightpanel}>
          <IconClose />
        </HideRightPanel>
      )}
      {((isNotStudentOrParent && isManageContentActive && !urlHasUseThis && !shouldHidCustomizeButton) ||
        (urlHasUseThis && isManageContentActive)) &&
      !isStudent ? (
        <ManageContentBlock
          testsInPlaylist={testsInPlaylist}
          urlHasUseThis={urlHasUseThis}
          subjectsFromCurriculumSequence={subjects?.[0]}
          gradesFromCurriculumSequence={grades}
          collectionFromCurriculumSequence={collections?.[0]?._id}
        />
      ) : null}
      {(!isManageContentActive || isStudent) && (
        <SummaryBlock
          isStudent={isStudent}
          summaryData={summaryData}
          urlHasUseThis={urlHasUseThis}
          hasSummaryDataNoData={hasSummaryDataNoData}
        />
      )}
    </div>
  );
};

export default CurriculumRightPanel;

const HideRightPanel = styled.div`
  position: absolute;
  right: 16px;
  top: 10px;
  z-index: 50;
  cursor: pointer;

  svg {
    width: 12px;
    height: 12px;
    fill: ${secondaryTextColor};
  }

  @media (max-width: ${smallDesktopWidth}) {
    position: fixed;
    right: 16px;
    top: ${props => props.theme.HeaderHeight.md + 12}px;
  }
  @media (max-width: ${desktopWidth}) {
    top: ${props => props.theme.HeaderHeight.xs + 12}px;
  }
`;
