import React from 'react'
import { EduIf, FlexContainer } from '@edulastic/common'
import { ExpressGraderLegend, Color, Label } from './styled'

const colorLabelsMap = [
  {
    label: 'correct',
    color: '#DEF4E8',
  },
  {
    label: 'incorrect',
    color: '#FDE0E9',
  },
  {
    label: 'partially correct',
    color: '#FFE9A8',
  },
  {
    label: 'skipped',
    color: '#E5E5E5',
  },
  {
    label: 'manually graded',
    color: '#BEDEFF',
  },
]

const ColorLabel = ({ item }) => (
  <FlexContainer>
    <Color color={item.color} />
    <Label>{item.label}</Label>
  </FlexContainer>
)

const ExpressGraderScoreColors = (props) => {
  const { isSurveyTest } = props

  return (
    <ExpressGraderLegend
      padding="10px 0"
      width="calc(100% - 68px)"
      justifyContent={isSurveyTest ? 'flex-end' : 'space-between'}
    >
      <EduIf condition={!isSurveyTest}>
        <FlexContainer>
          {colorLabelsMap.map((item) => (
            <ColorLabel item={item} />
          ))}
        </FlexContainer>
      </EduIf>
      <FlexContainer>
        <Label>Click on any score to open express grader</Label>
      </FlexContainer>
    </ExpressGraderLegend>
  )
}

export default ExpressGraderScoreColors
