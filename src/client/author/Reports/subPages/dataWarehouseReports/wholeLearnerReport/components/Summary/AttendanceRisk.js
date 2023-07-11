import React, { useMemo } from 'react'
import { Empty } from 'antd'
import { reportUtils } from '@edulastic/constants'
import { FlexContainer, EduIf, EduElse, EduThen } from '@edulastic/common'
import { lightGrey17 } from '@edulastic/colors'
import { isEmpty } from 'lodash'
import { Label } from '../../common/styled'

import SimplePieChart from '../../../../../common/components/charts/SimplePieChart'
import PieChartLabel from './PieChartLabel'
import { StyledEmptyContainer } from '../../../common/components/styledComponents'

const { RISK_BAND_COLOR_INFO } = reportUtils.common

const AttendanceRisk = ({ attendanceRisk }) => {
  const { riskBandLabel, score } = attendanceRisk
  const pieData = useMemo(
    () => [
      {
        value: score,
        fill: RISK_BAND_COLOR_INFO[riskBandLabel],
      },
      { value: 100 - score, fill: lightGrey17 },
    ],
    [attendanceRisk]
  )

  return (
    <div>
      <Label $margin="0 0 10px 0" $fontSize="16px">
        ATTENDANCE
      </Label>
      <FlexContainer>
        <EduIf condition={!isEmpty(attendanceRisk)}>
          <EduThen>
            <Label
              $margin="10px 30px 0 0"
              $color={RISK_BAND_COLOR_INFO[riskBandLabel]}
              $fontSize="10px"
            >
              {riskBandLabel} RISK
            </Label>
            <SimplePieChart
              data={pieData}
              innerRadius={25}
              outerRadius={42}
              center={{ x: 37, y: 37 }}
              width="84px"
              height="84px"
              label={<PieChartLabel score={score} />}
              chartStyles={{ filter: 'drop-shadow(5px 10px 18px #00000000)' }}
            />
          </EduThen>
          <EduElse>
            <StyledEmptyContainer
              margin="10px 0"
              description="No Attendance Risk Available."
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          </EduElse>
        </EduIf>
      </FlexContainer>
    </div>
  )
}

export default AttendanceRisk
