import React, { useMemo } from 'react'
import { Empty, Row, Col } from 'antd'
import { reportUtils } from '@edulastic/constants'
import { FlexContainer, EduIf, EduElse, EduThen } from '@edulastic/common'
import { lightGrey17, black } from '@edulastic/colors'
import { isEmpty } from 'lodash'
import { Label } from '../../common/styled'

import SimplePieChart from '../../../../../common/components/charts/SimplePieChart'
import PieChartLabel from './PieChartLabel'
import { StyledEmptyContainer } from '../../../common/components/styledComponents'

const { RISK_BAND_COLOR_INFO } = reportUtils.common

const AttendanceRisk = ({ attendanceRisk }) => {
  const {
    riskBandLabel = '',
    score,
    riskBandType = 'attendance',
  } = attendanceRisk

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
      <Label $margin="0 0 10px 0" $fontSize="14px">
        ATTENDANCE
      </Label>
      <EduIf condition={!isEmpty(attendanceRisk)}>
        <EduThen>
          <EduIf condition={riskBandType === 'attendance-absence'}>
            <EduThen>
              <Row align="middle">
                <Row align="middle" type="flex" gutter={10}>
                  <Col>
                    <Label $fontSize="20px" $color={black} $fontWeight={600}>
                      {score}
                    </Label>
                  </Col>
                  <Col>
                    <Label
                      $color={RISK_BAND_COLOR_INFO[riskBandLabel]}
                      $fontSize="14px"
                      $fontWeight={600}
                    >
                      {riskBandLabel.toUpperCase()} RISK
                    </Label>
                  </Col>
                </Row>
                <Label $fontSize="14px" $fontWeight={600}>
                  Total Absence
                </Label>
              </Row>
            </EduThen>
            <EduElse>
              <FlexContainer>
                <Label
                  $margin="10px 30px 0 0"
                  $color={RISK_BAND_COLOR_INFO[riskBandLabel]}
                  $fontSize="14px"
                >
                  {riskBandLabel.toUpperCase()} RISK
                </Label>
                <SimplePieChart
                  data={pieData}
                  innerRadius={25}
                  outerRadius={42}
                  center={{ x: 37, y: 37 }}
                  width="84px"
                  height="84px"
                  label={<PieChartLabel score={score} />}
                  chartStyles={{
                    filter: 'drop-shadow(5px 10px 18px #00000000)',
                  }}
                />
              </FlexContainer>
            </EduElse>
          </EduIf>
        </EduThen>
        <EduElse>
          <StyledEmptyContainer
            margin="10px 0"
            description="No Attendance Risk Available."
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </EduElse>
      </EduIf>
    </div>
  )
}

export default AttendanceRisk
