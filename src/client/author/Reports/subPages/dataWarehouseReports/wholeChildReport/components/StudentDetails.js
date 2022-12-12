import React from 'react'
import { Icon, Tooltip } from 'antd'

import { themeColor, greyThemeDark2 } from '@edulastic/colors'
import { reportUtils } from '@edulastic/constants'
import { IconCheckMark } from '@edulastic/icons'
import {
  DetailsWrapper,
  Details,
  StudentName,
  StyledIcon,
  StudentMetaData,
  StyledLine,
  Demographics,
  UserIcon,
  OverallPerformanceWrapper,
  StyledDiv,
  StyledSpan,
  StyledTag,
} from '../common/styled'
import {
  TooltipRow,
  TooltipRowTitle,
  TooltipRowValue,
} from '../../../../common/styled'
import SimplePieChartComponent from './PieChart'
import { getProficiencyPieChartData } from '../utils'
import { TableTooltipWrapper } from '../../common/styled'
import { percentage } from '../../../../common/util'

const { getFormattedName } = reportUtils.common

const StudentDetails = ({
  studentInformation: {
    firstName = '',
    middleName = '',
    lastName = '',
    schoolName,
    grades,
    race,
    gender,
    iepStatus,
    frlStatus,
    ellStatus,
    hispanicEthnicity,
    thumbnail,
  },
  chartData,
  selectedPerformanceBand,
  attendancePieChartData,
}) => {
  const studentName = getFormattedName(
    `${firstName} ${middleName} ${lastName}`,
    false,
    true
  )

  const CustomTooltip = (props) => (
    <TableTooltipWrapper>
      <Tooltip {...props} />
    </TableTooltipWrapper>
  )

  const [pieChartData, avgAverageScore] = getProficiencyPieChartData(
    chartData,
    selectedPerformanceBand
  )

  const performanceRiskMap = {
    above: { fill: '#afe1af', label: 'Not at risk' },
    below: { fill: '#E55C5C', label: 'At risk' },
  }

  const threshold = 30

  const getTooltipText = () => {
    const { count, sum, name } = pieChartData.reduce((prev, curr) =>
      prev.threshold < curr.threshold ? prev : curr
    )

    const performanceRiskKey =
      percentage(count, sum, true) > threshold ? 'below' : 'above'

    const tooltipText = (
      <>
        <TooltipRow>
          <TooltipRowValue>{`${count}/${sum} `}</TooltipRowValue>
          <TooltipRowTitle>&nbsp;assessments are in</TooltipRowTitle>
        </TooltipRow>
        <TooltipRow>
          <TooltipRowValue>{name}</TooltipRowValue>
        </TooltipRow>
      </>
    )
    return [tooltipText, performanceRiskKey]
  }

  const totalpresents = attendancePieChartData.filter(
    (cd) => cd.name === 'Present'
  )[0]
  const attendanceChartLabel = percentage(
    totalpresents.count,
    totalpresents.sum,
    true
  )

  const [tooltipText, performanceRiskKey] = getTooltipText()

  return (
    <div>
      <DetailsWrapper>
        <Details>
          <StudentName>
            {thumbnail ? (
              <UserIcon src={thumbnail} />
            ) : (
              <StyledIcon data-testid="userIcon" />
            )}
            <span data-testid="studentName">{studentName}</span>
          </StudentName>
          <StyledLine />
          <StudentMetaData>
            <div>
              <span>School : </span>
              <span data-testid="schoolName">{schoolName || '-'}</span>
            </div>
            <div>
              <span>Grade : </span>
              <span data-testid="grade">{grades || '-'}</span>
            </div>
            <div>
              <span>Race : </span>
              <span data-testid="race">{race || '-'}</span>
            </div>
            <div>
              <span>Gender : </span>
              <span data-testid="gender">{gender || '-'}</span>
            </div>
          </StudentMetaData>
        </Details>
      </DetailsWrapper>
      <Demographics>
        {frlStatus ? (
          <div className="demographic-item">
            {['yes', 'y'].includes(frlStatus?.toLowerCase()) ? (
              <IconCheckMark color={themeColor} />
            ) : (
              <Icon
                type="close-circle"
                theme="filled"
                style={{ color: greyThemeDark2 }}
              />
            )}
            <span>FRL Status</span>
          </div>
        ) : null}
        {iepStatus ? (
          <div className="demographic-item">
            {['yes', 'y'].includes(iepStatus?.toLowerCase()) ? (
              <IconCheckMark color={themeColor} />
            ) : (
              <Icon
                type="close-circle"
                theme="filled"
                style={{ color: greyThemeDark2 }}
              />
            )}
            <span>IEP Status</span>
          </div>
        ) : null}
        {ellStatus ? (
          <div className="demographic-item">
            {['yes', 'y'].includes(ellStatus?.toLowerCase()) ? (
              <IconCheckMark color={themeColor} />
            ) : (
              <Icon
                type="close-circle"
                theme="filled"
                style={{ color: greyThemeDark2 }}
              />
            )}
            <span>ELL Status</span>
          </div>
        ) : null}
        {hispanicEthnicity ? (
          <div className="demographic-item">
            {['yes', 'y'].includes(hispanicEthnicity?.toLowerCase()) ? (
              <IconCheckMark color={themeColor} />
            ) : (
              <Icon
                type="close-circle"
                theme="filled"
                style={{ color: greyThemeDark2 }}
              />
            )}
            <span>Hispanic Ethnicity</span>
          </div>
        ) : null}
      </Demographics>
      <OverallPerformanceWrapper>
        <StyledDiv>
          <StyledSpan>OVERALL PROFICIENCY: </StyledSpan>
          <SimplePieChartComponent
            pieChartData={pieChartData}
            label={avgAverageScore}
            showTooltip
          />
        </StyledDiv>
        <StyledLine width="1px" height="100px" />
        <StyledDiv>
          <StyledSpan>PERFORMANCE RISK: </StyledSpan>
          <CustomTooltip
            title={tooltipText}
            getPopupContainer={(triggerNode) => triggerNode}
          >
            <StyledTag fill={performanceRiskMap[performanceRiskKey].fill}>
              {performanceRiskMap[performanceRiskKey].label}
            </StyledTag>
          </CustomTooltip>
        </StyledDiv>

        <StyledLine width="1px" height="100px" />
        <StyledDiv>
          <StyledSpan>ATTENDANCE: </StyledSpan>
          <SimplePieChartComponent
            pieChartData={attendancePieChartData}
            label={attendanceChartLabel}
            showTooltip={false}
          />
        </StyledDiv>
        <StyledLine width="1px" height="100px" />
        <StyledDiv>
          <StyledSpan>SEL: </StyledSpan>
          <StyledTag>Favourable</StyledTag>
        </StyledDiv>
      </OverallPerformanceWrapper>
    </div>
  )
}

export default StudentDetails
