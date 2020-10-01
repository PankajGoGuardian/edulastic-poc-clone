import styled, { css } from 'styled-components'

const statusColors = {
  correct: '#DEF4E8',
  partiallyCorrect: '#FFE9A8',
  ungraded: '#BEDEFF',
  wrong: '#FDE0E9',
  skipped: '#E5E5E5',
}

const KatexStyle = css`
  .katex .base {
    max-width: 100%;
    vertical-align: middle;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
`

export const StyledWrapper = styled.div`
  cursor: pointer;
  display: flex;
  justify-content: center;
  background-color: ${({ answerStatus: status }) => statusColors[status]};
`

export const StyledText = styled.span`
  color: #434b5d;
  font-size: 14px;
  font-weight: 600;
  padding-left: 4px;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  ${({ responseView }) => responseView && KatexStyle};
`
