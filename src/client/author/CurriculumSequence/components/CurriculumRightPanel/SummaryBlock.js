import React from 'react'
import styled from 'styled-components'
import { Tooltip } from 'antd'
import { ProgressBar } from '@edulastic/common'
import {
  desktopWidth,
  greyThemeDark1,
  lightGrey2,
  lightGrey5,
  smallDesktopWidth,
  titleColor,
  white,
  extraDesktopWidthMax,
  tabletWidth,
  mobileWidthLarge,
} from '@edulastic/colors'

import SummaryPieChart from './SummaryPieChart'
import { getProgressColor } from '../../util'

const SummaryBlock = ({
  isStudent,
  summaryData,
  urlHasUseThis,
  hasSummaryDataNoData,
}) => {
  const COLORS = [
    '#11AB96',
    '#F74565',
    '#0078AD',
    '#00C2FF',
    '#B701EC',
    '#496DDB',
    '#8884d8',
    '#82ca9d',
    '#EC0149',
    '#FFD500',
    '#00AD50',
  ]

  return (
    <SummaryBlockContainer urlHasUseThis={urlHasUseThis}>
      <SummaryBlockTitle>Summary</SummaryBlockTitle>
      <SummaryBlockSubTitle>Most Time Spent</SummaryBlockSubTitle>
      <SummaryPieChart
        isStudent={isStudent}
        data={summaryData}
        totalTimeSpent={summaryData
          ?.map((x) => x?.tSpent)
          ?.reduce((a, c) => a + c, 0)}
        colors={COLORS}
      />
      <Hr />
      <SummaryBlockSubTitle>Module Proficiency</SummaryBlockSubTitle>
      <SummaryDataRows urlHasUseThis={urlHasUseThis}>
        {summaryData?.map(
          (item) =>
            ((isStudent && !item.hidden) || (!isStudent && urlHasUseThis)) && (
              <div style={{ opacity: item.hidden ? `.5` : `1` }}>
                <Tooltip placement="left" title={item.title || item.name}>
                  <ModuleTitle data-testid="moduleTitle">
                    {item.title || item.name}
                  </ModuleTitle>
                </Tooltip>
                <StyledProgressBar
                  data-testid="progressBar"
                  strokeColor={getProgressColor(item?.value)}
                  strokeWidth={13}
                  percent={item.value}
                  size="small"
                  color={item.value ? greyThemeDark1 : lightGrey2}
                  format={(percent) => (percent ? `${percent}%` : 'NO DATA')}
                  padding={hasSummaryDataNoData ? '0px 30px 0px 0px' : '0px'}
                />
              </div>
            )
        )}
      </SummaryDataRows>
    </SummaryBlockContainer>
  )
}

export default SummaryBlock

const SummaryBlockContainer = styled.div`
  width: 450px;
  height: 100%;
  background: ${white};
  padding: 30px 20px 20px;
  border-left: 1px solid #dadae4;

  .recharts-layer {
    tspan {
      text-transform: uppercase;
      fill: #434b5d;
      font-size: 11px;
      font-weight: 600;
    }
  }

  @media (max-width: ${extraDesktopWidthMax}) {
    width: 390px;
  }

  @media (max-width: ${smallDesktopWidth}) {
    width: 290px;
  }

  @media (min-width: ${tabletWidth}) and (max-width: ${smallDesktopWidth}) {
    height: ${({ urlHasUseThis }) =>
      urlHasUseThis ? 'calc(100vh - 105px)' : 'calc(100vh - 140px)'};
  }

  @media (max-width: ${desktopWidth}) {
    position: fixed;
    right: 0px;
    top: ${(props) => props.theme.HeaderHeight?.sd}px;
    height: ${({ theme }) => `calc(100vh - ${theme.HeaderHeight?.sd}px)`};
    overflow: auto;
  }

  @media (max-width: ${mobileWidthLarge}) {
    top: ${(props) => props.theme.HeaderHeight?.xs}px;
    height: ${({ theme }) => `calc(100vh - ${theme.HeaderHeight?.xs}px)`};
  }
`

const SummaryBlockTitle = styled.div`
  width: 100%;
  color: ${titleColor};
  font-weight: 700;
  font-size: 22px;
  text-align: center;

  @media (max-width: ${extraDesktopWidthMax}) {
    font-size: 18px;
  }
`

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
`

const Hr = styled.div`
  width: 70%;
  border: 2px dashed transparent;
  border-bottom: 2px dashed #d2d2d2;
  margin: 20px auto;
`

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
`

const StyledProgressBar = styled(ProgressBar)`
  & .ant-progress-text {
    @media (max-width: ${extraDesktopWidthMax}) {
      font-size: 9px;
    }
  }
`

const SummaryDataRows = styled.div`
  width: 100%;
  margin: 10px auto;
  overflow: auto;
  height: calc(100vh - 450px);

  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }

  &:hover {
    &::-webkit-scrollbar-track {
      background: #f1f1f1;
    }

    &::-webkit-scrollbar-thumb {
      background: #888;
    }
  }
`
