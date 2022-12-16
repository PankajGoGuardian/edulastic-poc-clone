import React from 'react'
import { Icon, Tooltip } from 'antd'
import { capitalize, round } from 'lodash'

import { themeColor, greyThemeDark2 } from '@edulastic/colors'
import { reportUtils } from '@edulastic/constants'
import { IconCheckMark } from '@edulastic/icons'
import { Link } from 'react-router-dom'
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
  ColorBandRow,
  ColorCircle,
  TooltipRow,
  TooltipRowTitle,
  TooltipRowValue,
} from '../../../../common/styled'
import SimplePieChartComponent from './PieChart'
import { getProficiencyPieChartData } from '../utils'
import { TableTooltipWrapper } from '../../common/styled'
import { percentage } from '../../../../common/util'

const { getFormattedName } = reportUtils.common

const getSelTooltipJSX = (payload) => {
  if (payload && payload.length) {
    const tooltipData = payload[0].payload
    return (
      <div>
        <TooltipRow>
          <TooltipRowValue>{`${
            // due to data issue sometimes count exceeds sum, so making it equal to sum in that case
            tooltipData.count > tooltipData.sum
              ? tooltipData.sum
              : tooltipData.count
          }/${tooltipData.sum}`}</TooltipRowValue>
          <TooltipRowTitle>
            &nbsp;&nbsp;&nbsp;competencies have a
          </TooltipRowTitle>
        </TooltipRow>
        <TooltipRow>
          <TooltipRowTitle>&nbsp;&nbsp;&nbsp;score of</TooltipRowTitle>
          <TooltipRowValue>{tooltipData.scale}</TooltipRowValue>
        </TooltipRow>
      </div>
    )
  }
  return false
}

const getProficiencyTooltipJSX = (payload) => {
  if (payload && payload.length) {
    return (
      <div>
        <TooltipRow>
          <TooltipRowValue>{`${payload[0].payload.count}/${payload[0].payload.sum}`}</TooltipRowValue>
          <TooltipRowTitle>&nbsp;assessments are in</TooltipRowTitle>
        </TooltipRow>
        <ColorBandRow>
          <ColorCircle color={payload[0].payload.fill} />
          <TooltipRowValue>{payload[0].payload.name}</TooltipRowValue>
        </ColorBandRow>
      </div>
    )
  }
  return false
}

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
  selPerformanceDetails,
  selReportURL,
}) => {
  const studentName = getFormattedName(
    `${firstName} ${middleName} ${lastName}`,
    false,
    true
  )

  const selDataLength = selPerformanceDetails.data.length

  const selAvg = selPerformanceDetails.sel_avg_score
  const selPieChartData = selPerformanceDetails.data.map((e) => ({
    fill: e.color,
    count: e.total,
    scale: e.scale,
    fillOpacity: 1,
    sum: selDataLength,
    score: round(e.total / selDataLength, 2),
  }))

  const CustomTooltip = (props) => (
    <TableTooltipWrapper>
      <Tooltip {...props} />
    </TableTooltipWrapper>
  )

  const TooltipRowItem = ({ title = '', value = '' }) => (
    <TooltipRow>
      <TooltipRowTitle>{title}</TooltipRowTitle>
      <TooltipRowValue>{value}</TooltipRowValue>
    </TooltipRow>
  )

  const totalpresents = attendancePieChartData.filter(
    (cd) => cd.name === 'Present'
  )[0]
  const attendanceChartLabel = percentage(
    totalpresents.count,
    totalpresents.sum,
    true
  )

  const [pieChartData, avgAverageScore] = getProficiencyPieChartData(
    chartData,
    selectedPerformanceBand
  )

  const performanceRiskColorMap = {
    Low: { fill: '#90DE85' },
    High: { fill: '#E55C5C' },
    Medium: { fill: '#EBDD54' },
  }

  const avgScoreRisk = avgAverageScore < pieChartData?.[1]?.threshold
  const selAvgRisk = percentage(selAvg, selDataLength) < 60
  const attendanceRisk = attendanceChartLabel < 90

  const getPerformanceRisk = () => {
    let key
    if (
      (avgScoreRisk && selAvgRisk && attendanceRisk) ||
      (avgScoreRisk && selAvgRisk && !attendanceRisk) ||
      (avgScoreRisk && !selAvgRisk && attendanceRisk) ||
      (!avgScoreRisk && selAvgRisk && attendanceRisk)
    )
      key = 'High'
    else if (
      (avgScoreRisk && !selAvgRisk && !attendanceRisk) ||
      (!avgScoreRisk && !selAvgRisk && attendanceRisk) ||
      (!avgScoreRisk && selAvgRisk && !attendanceRisk)
    )
      key = 'Medium'
    else key = 'Low'
    return key
  }

  const performanceRiskKey = getPerformanceRisk()

  const percentileTooltipText = (
    <div>
      <TooltipRow>
        <TooltipRowTitle>Computed based on scores</TooltipRowTitle>
      </TooltipRow>
      <TooltipRow>
        <TooltipRowTitle>achieved by students</TooltipRowTitle>
      </TooltipRow>
      <TooltipRow>
        <TooltipRowTitle>within the district.</TooltipRowTitle>
      </TooltipRow>
    </div>
  )

  const getPerformanceRiskTooltipText = () => {
    const { count, sum, name } = pieChartData?.[0]
    let tooltipText
    const selText = round(selAvg, 2)

    if (avgScoreRisk && selAvgRisk && attendanceRisk) {
      tooltipText = (
        <>
          <TooltipRow>
            <TooltipRowValue>{`${count}/${sum} `}</TooltipRowValue>
            <TooltipRowTitle>&nbsp;assessments are in</TooltipRowTitle>
          </TooltipRow>
          <TooltipRow>
            <TooltipRowValue>{name}</TooltipRowValue>
          </TooltipRow>
          <TooltipRowItem title="SEL Average is" value={selText} />
          <TooltipRowItem
            title="Attendance is"
            value={`${attendanceChartLabel}%`}
          />
        </>
      )
    } else if (avgScoreRisk && selAvgRisk && !attendanceRisk) {
      tooltipText = (
        <>
          <TooltipRow>
            <TooltipRowValue>{`${count}/${sum} `}</TooltipRowValue>
            <TooltipRowTitle>&nbsp;assessments are in</TooltipRowTitle>
          </TooltipRow>
          <TooltipRow>
            <TooltipRowValue>{name}</TooltipRowValue>
          </TooltipRow>
          <TooltipRowItem title="SEL Average is" value={selText} />
        </>
      )
    } else if (avgScoreRisk && !selAvgRisk && attendanceRisk) {
      tooltipText = (
        <>
          <TooltipRow>
            <TooltipRowValue>{`${count}/${sum} `}</TooltipRowValue>
            <TooltipRowTitle>&nbsp;assessments are in</TooltipRowTitle>
          </TooltipRow>
          <TooltipRow>
            <TooltipRowValue>{name}</TooltipRowValue>
          </TooltipRow>
          <TooltipRowItem
            title="Attendance is"
            value={`${attendanceChartLabel}%`}
          />
        </>
      )
    } else if (!avgScoreRisk && selAvgRisk && attendanceRisk) {
      tooltipText = (
        <>
          <TooltipRowItem title="SEL Average is" value={selText} />
          <TooltipRowItem
            title="Attendance is"
            value={`${attendanceChartLabel}%`}
          />
        </>
      )
    } else if (avgScoreRisk && !selAvgRisk && !attendanceRisk) {
      tooltipText = (
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
    } else if (!avgScoreRisk && !selAvgRisk && attendanceRisk) {
      tooltipText = (
        <TooltipRowItem
          title="Attendance is"
          value={`${attendanceChartLabel}%`}
        />
      )
    } else if (!avgScoreRisk && selAvgRisk && !attendanceRisk) {
      tooltipText = <TooltipRowItem title="SEL Average is" value={selText} />
    } else tooltipText = '-'
    return tooltipText
  }

  const performanceRisktooltipText = getPerformanceRiskTooltipText()

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
              <span data-testid="gender">{capitalize(gender || '-')}</span>
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
          <StyledSpan>
            <CustomTooltip
              title={percentileTooltipText}
              getPopupContainer={(triggerNode) => triggerNode}
            >
              PERCENTAGE:
            </CustomTooltip>
          </StyledSpan>
          <SimplePieChartComponent
            pieChartData={pieChartData}
            label={`${avgAverageScore}%`}
            getTooltipJSX={getProficiencyTooltipJSX}
          />
        </StyledDiv>
        <StyledLine width="1px" height="100px" />
        <StyledDiv marginX="94px">
          <StyledSpan>SEL: </StyledSpan>
          <Link
            to={selReportURL}
            style={{ display: 'block', color: 'inherit' }}
          >
            <SimplePieChartComponent
              pieChartData={selPieChartData}
              label={selAvg}
              getTooltipJSX={getSelTooltipJSX}
              selTooltip
            />
          </Link>
        </StyledDiv>
        <StyledLine width="1px" height="100px" />
        <StyledDiv>
          <StyledSpan>ATTENDANCE: </StyledSpan>
          <SimplePieChartComponent
            pieChartData={attendancePieChartData}
            label={`${attendanceChartLabel}%`}
            showTooltip={false}
          />
        </StyledDiv>
        <StyledLine width="1px" height="100px" />
        <StyledDiv>
          <StyledSpan>PERFORMANCE RISK: </StyledSpan>
          <CustomTooltip
            title={performanceRisktooltipText}
            getPopupContainer={(triggerNode) => triggerNode}
          >
            <StyledTag fill={performanceRiskColorMap[performanceRiskKey].fill}>
              {performanceRiskKey}
            </StyledTag>
          </CustomTooltip>
        </StyledDiv>
      </OverallPerformanceWrapper>
    </div>
  )
}

export default StudentDetails
