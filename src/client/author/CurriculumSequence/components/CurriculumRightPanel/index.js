import React, { Fragment } from "react";
import styled from "styled-components";
import { IconClose } from "@edulastic/icons";
import { Tooltip } from "antd";
import { ProgressBar } from "@edulastic/common";
import {
  desktopWidth,
  greyThemeDark1,
  lightGrey2,
  lightGrey5,
  smallDesktopWidth,
  titleColor,
  white,
  secondaryTextColor,
  extraDesktopWidthMax
} from "@edulastic/colors";

import ManageContentBlock from "../ManageContentBlock";
import SummaryPieChart from "../SummaryPieChart";
import { getProgressColor } from "../../util";

const CurriculumRightPanel = ({
  showRightPanel,
  isStudent,
  urlHasUseThis,
  hideRightpanel,
  summaryData,
  isManageContentActive,
  isNotStudentOrParent,
  destinationCurriculumSequence,
  shouldHidCustomizeButton
}) => {
  if (!showRightPanel || isStudent) {
    return <Fragment />;
  }

  const COLORS = [
    "#11AB96",
    "#F74565",
    "#0078AD",
    "#00C2FF",
    "#B701EC",
    "#496DDB",
    "#8884d8",
    "#82ca9d",
    "#EC0149",
    "#FFD500",
    "#00AD50"
  ];
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
      {isNotStudentOrParent && isManageContentActive && !urlHasUseThis && !shouldHidCustomizeButton ? (
        <ManageContentBlock
          testsInPlaylist={testsInPlaylist}
          urlHasUseThis={urlHasUseThis}
          subjectsFromCurriculumSequence={subjects?.[0]}
          gradesFromCurriculumSequence={grades}
          collectionFromCurriculumSequence={collections?.[0]?._id}
        />
      ) : null}
      {urlHasUseThis &&
        (isManageContentActive ? (
          <ManageContentBlock
            testsInPlaylist={testsInPlaylist}
            urlHasUseThis={urlHasUseThis}
            subjectsFromCurriculumSequence={destinationCurriculumSequence?.subjects?.[0]}
            gradesFromCurriculumSequence={destinationCurriculumSequence?.grades || []}
            collectionFromCurriculumSequence={destinationCurriculumSequence?.collections?.[0]?._id}
          />
        ) : (
          <SummaryBlock>
            <SummaryBlockTitle>Summary</SummaryBlockTitle>
            <SummaryBlockSubTitle>Most Time Spent</SummaryBlockSubTitle>
            <SummaryPieChart
              isStudent={isStudent}
              data={summaryData}
              totalTimeSpent={summaryData?.map(x => x?.tSpent)?.reduce((a, c) => a + c, 0)}
              colors={COLORS}
            />
            <Hr />
            <SummaryBlockSubTitle>Module Proficiency</SummaryBlockSubTitle>
            <div style={{ width: "80%", margin: "20px auto" }}>
              {summaryData?.map(
                item =>
                  ((isStudent && !item.hidden) || (!isStudent && urlHasUseThis)) && (
                    <div style={{ opacity: item.hidden ? `.5` : `1` }}>
                      <Tooltip placement="topLeft" title={item.title || item.name}>
                        <ModuleTitle>{item.title || item.name}</ModuleTitle>
                      </Tooltip>
                      <StyledProgressBar
                        strokeColor={getProgressColor(item?.value)}
                        strokeWidth={13}
                        percent={item.value}
                        size="small"
                        color={item.value ? greyThemeDark1 : lightGrey2}
                        format={percent => (percent ? `${percent}%` : "NO DATA")}
                        padding={hasSummaryDataNoData ? "0px 30px 0px 0px" : "0px"}
                      />
                    </div>
                  )
              )}
            </div>
          </SummaryBlock>
        ))}
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

const SummaryBlock = styled.div`
  width: 400px;
  min-height: calc(100vh - 125px);
  background: ${white};
  padding-top: 30px;
  border-radius: 4px;
  border: 1px solid #dadae4;

  .recharts-layer {
    tspan {
      text-transform: uppercase;
      fill: #434b5d;
      font-size: 11px;
      font-weight: 600;
    }
  }

  @media (max-width: ${extraDesktopWidthMax}) {
    width: 340px;
  }
  @media (max-width: ${smallDesktopWidth}) {
    position: fixed;
    right: 0px;
    top: ${props => props.theme.HeaderHeight.md}px;
    max-height: calc(100vh - 62px);
    min-height: calc(100vh - 62px);
    overflow: auto;
  }
  @media (max-width: ${desktopWidth}) {
    top: ${props => props.theme.HeaderHeight.xs}px;
  }
`;

const SummaryBlockTitle = styled.div`
  width: 100%;
  color: ${titleColor};
  font-weight: 700;
  font-size: 22px;
  text-align: center;

  @media (max-width: ${extraDesktopWidthMax}) {
    font-size: 18px;
  }
`;

const SummaryBlockSubTitle = styled.div`
  width: 100%;
  color: ${lightGrey5};
  font-weight: 600;
  font-size: 13px;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0;

  @media (max-width: ${extraDesktopWidthMax}) {
    font-size: 10px;
  }
`;

const Hr = styled.div`
  width: 70%;
  border: 2px dashed transparent;
  border-bottom: 2px dashed #d2d2d2;
  margin: 15px auto 30px auto;
`;

const ModuleTitle = styled.p`
  font-size: 11px;
  color: #434b5d;
  font-weight: 600;
  text-transform: uppercase;
  padding-right: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
  letter-spacing: 0.2px;
  margin-top: 8px;

  @media (max-width: ${extraDesktopWidthMax}) {
    font-size: 9px;
  }
`;

const StyledProgressBar = styled(ProgressBar)`
  & .ant-progress-text {
    @media (max-width: ${extraDesktopWidthMax}) {
      font-size: 9px;
    }
  }
`;
