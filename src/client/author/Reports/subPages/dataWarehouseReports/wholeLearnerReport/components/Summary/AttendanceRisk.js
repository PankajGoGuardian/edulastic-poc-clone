import React, { useMemo } from 'react'
import { reportUtils } from '@edulastic/constants'
import { FlexContainer } from '@edulastic/common'
import { lightGrey17 } from '@edulastic/colors'
import { Label } from '../../common/styled'

import SimplePieChart from '../../../../../common/components/charts/SimplePieChart'
import PieChartLabel from './PieChartLabel'

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
      </FlexContainer>
    </div>
  )
}

export default AttendanceRisk
