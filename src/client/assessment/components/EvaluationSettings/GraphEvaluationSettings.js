import React from 'react'
import styled from 'styled-components'
import { math as mathConstants } from '@edulastic/constants'
import EvaluationOption from './components/EvaluationOption'

const { evaluationSettings, GRAPH_EVALUATION_SETTING } = mathConstants

const GraphEvaluationSettings = ({
  onChangeOption,
  options,
  hidePointOnEquation,
}) => {
  const groupedOptionsLabels =
    evaluationSettings[GRAPH_EVALUATION_SETTING] || []

  return (
    <Container>
      {groupedOptionsLabels.map((label) => (
        <OptionPanel key={label}>
          <EvaluationOption
            optionKey={label}
            options={options}
            hidePointOnEquation={hidePointOnEquation}
            onChangeOption={onChangeOption}
          />
        </OptionPanel>
      ))}
    </Container>
  )
}

export default GraphEvaluationSettings

const Container = styled.div`
  max-height: 78vh;
  overflow: auto;
`

const OptionPanel = styled.div``
