import styled, { css } from 'styled-components'

export const ANSWER_STATUS = {
  correct: {
    color: '#DEF4E8',
    text: 'Correct',
  },
  partiallyCorrect: {
    color: '#FFE9A8',
    text: 'Partially Correct',
  },
  ungraded: {
    color: '#BEDEFF',
    text: 'Ungraded',
  },
  wrong: {
    color: '#FDE0E9',
    text: 'Wrong',
  },
  skipped: {
    color: '#E5E5E5',
    text: 'Skipped',
  },
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
  background-color: ${({ answerStatus: status }) =>
    ANSWER_STATUS[status]?.color};

  img {
    width: 0px;
    height: 0px;
  }
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
