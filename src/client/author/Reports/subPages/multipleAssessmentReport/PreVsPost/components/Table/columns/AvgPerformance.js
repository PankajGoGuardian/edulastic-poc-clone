import { Row } from 'antd'
import React from 'react'
import { CustomStyledCell } from '../../../common/styledComponents'

const AvgPerformance = ({ record, analyseBy }) => {
  const {
    preBand,
    postBand,
    preAvgScore,
    postAvgScore,
    preAvgScorePercentage,
    postAvgScorePercentage,
  } = record
  const preTestScore =
    analyseBy === 'rawScore' ? preAvgScore : `${preAvgScorePercentage}%`
  const postTestScore =
    analyseBy === 'rawScore' ? postAvgScore : `${postAvgScorePercentage}%`
  return (
    <Row type="flex" justify="center">
      <CustomStyledCell justify="center" color={preBand.color} padding="15px">
        {preTestScore}
      </CustomStyledCell>
      <CustomStyledCell justify="center" color={postBand.color} padding="15px">
        {postTestScore}
      </CustomStyledCell>
    </Row>
  )
}

export default AvgPerformance
