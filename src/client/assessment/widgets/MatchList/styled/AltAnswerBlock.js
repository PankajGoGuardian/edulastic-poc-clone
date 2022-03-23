import styled from 'styled-components'
import { CorItem } from '@edulastic/common'
import { Index } from './Index'

export const AltAnswersContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: stretch;
  height: 100%;
  padding-left: ${({ showAnswerScore }) => (showAnswerScore ? '22px' : '')};
`

export const AltAnswerBlock = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 1px solid #b6b6cc;

  &:last-child {
    border-right: none;
  }
`

export const AltScoreContainer = styled(CorItem)`
  margin-left: auto;
  margin-bottom: 10px;
  margin-right: 10px;
  width: calc(50% - 62px);
  align-items: stretch;
`

export const ScoreLabel = styled(Index)`
  width: ${({ showAnswerScore }) => (showAnswerScore ? '50px' : null)};
`
