import { Row } from 'antd'
import React from 'react'
import {
  getScoreLabel,
  getScoreLabelNoSuffix,
} from '@edulastic/constants/const/dataWarehouse'
import { CustomStyledCell } from '../../../../../multipleAssessmentReport/PreVsPost/common/styledComponents'
import { analyseBykeys } from '../../../utils'

const AvgPerformance = ({ data, analyseBy, testInfo }) => {
  const { preTestData, postTestData } = data
  const { preTestInfo, postTestInfo } = testInfo
  const preTestScore =
    analyseBy === analyseBykeys.RAW_SCORE
      ? getScoreLabelNoSuffix(preTestData.avgScore, preTestData)
      : getScoreLabel(preTestData.normScore, preTestInfo)
  const postTestScore =
    analyseBy === analyseBykeys.RAW_SCORE
      ? getScoreLabelNoSuffix(postTestData.avgScore, postTestData)
      : getScoreLabel(postTestData.normScore, postTestInfo)
  return (
    <Row type="flex" justify="center">
      <CustomStyledCell
        justify="center"
        color={preTestData.band?.color}
        padding="15px"
      >
        {preTestScore}
      </CustomStyledCell>
      <CustomStyledCell
        justify="center"
        color={postTestData.band?.color}
        padding="15px"
      >
        {postTestScore}
      </CustomStyledCell>
    </Row>
  )
}

export default AvgPerformance
