import React from 'react'
import qs from 'qs'
import styled from 'styled-components'
import IconMagicWand from '@edulastic/icons/src/IconMagicWand'
import { AiEduButton } from '../../../../../AssessmentCreate/components/CreateAITest/styled'

function AIRecommendation({ history, response }) {
  const {
    value: { strengths, areasToImprove, feedback, standardsToImprove },
    type: responseType,
  } = response
  const onAssignClick = () => {
    history.push(
      `/author/tests/select?${qs.stringify({
        standards: standardsToImprove.join(','),
      })}`
    )
  }
  return (
    <Wrapper>
      <OverallFeedback>
        <div className="title">
          <IconMagicWand />
          Pear Intelligence
        </div>
        <div>{feedback}</div>
      </OverallFeedback>
      <StyledCard>
        <div className="title">Strengths</div>
        <ol>
          {strengths.map((strength, idx) => (
            <li key={`strength - ${idx}`}>{strength}</li>
          ))}
        </ol>
      </StyledCard>
      <StyledCard>
        <div className="title">Areas of Improvement</div>
        <ol>
          {areasToImprove.map((aoi, idx) => (
            <li key={`aoi - ${idx}`}>{aoi}</li>
          ))}
        </ol>
        <div className="assign-ai-test">
          <IconMagicWand />
          <div>Improvement by AI</div>
          <AiEduButton isGhost onClick={onAssignClick} fontWeight={700}>
            <IconMagicWand />
            Assign a quick AI test
          </AiEduButton>
        </div>
      </StyledCard>
    </Wrapper>
  )
}

export default AIRecommendation

const OverallFeedback = styled.div`
  color: white;
  max-width: 500px;
  .title {
    display: flex;
    gap: 15px;
    align-items: center;
    font-size: 20px;
    margin-bottom: 10px;
  }
  text-align: justify;
`

const StyledCard = styled.div`
  background-color: #ffffff;
  padding: 20px;
  color: black;
  border-radius: 20px;
  .title {
    font-size: 16px;
    font-weight: 400;
    color: #737373;
    margin-bottom: 10px;
  }
  ol {
    list-style-type: number;
  }
  .assign-ai-test {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 12px;
    color: #737373;
    justify-content: flex-end;
  }
`

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: stretch;
  background: #0f0838;
  margin-bottom: 20px;
  border-radius: 15px;
  padding: 20px 40px;
  gap: 20px;
  border: 3px solid #20c1e4;
`
