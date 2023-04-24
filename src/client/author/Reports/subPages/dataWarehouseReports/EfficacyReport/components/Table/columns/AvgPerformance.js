import { Row } from 'antd'
import React from 'react'
import { CustomStyledCell } from '../../../../../multipleAssessmentReport/PreVsPost/common/styledComponents'
import { analyseBykeys } from '../../../utils'

const AvgPerformance = ({ data, analyseBy }) => {
  const { preTestData, postTestData } = data
  const preTestScore =
    analyseBy === analyseBykeys.RAW_SCORE
      ? preTestData.avgScore
      : `${
          preTestData.avgScorePercentage
            ? `${preTestData.avgScorePercentage}%`
            : preTestData.avgScore
        }`
  const postTestScore =
    analyseBy === analyseBykeys.RAW_SCORE
      ? postTestData.avgScore
      : `${
          postTestData.avgScorePercentage
            ? `${postTestData.avgScorePercentage}%`
            : postTestData.avgScore
        }`
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
