import styled, { css } from 'styled-components'

export const AnswerContent = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 0px 10px;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  display: flex;
  align-items: center;
  vertical-align: middle;
  text-align: center;
  min-height: 30px;
  ${({ inPopover }) =>
    inPopover &&
    css`
      white-space: normal;
      width: unset;
      margin-right: 0.5rem;
    `}

  ${({ showIndex, inPopover }) => `
    max-width: ${showIndex ? 560 : 600}px;
    width: ${showIndex && !inPopover ? 'calc(100% - 60px)' : '100%'};
    padding-right: ${showIndex ? 5 : 20}px;
  `}
`
