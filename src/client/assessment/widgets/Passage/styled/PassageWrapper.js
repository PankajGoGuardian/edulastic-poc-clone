import styled from 'styled-components'
import { Paper } from '@edulastic/common'
import { white, boxShadowDefault } from '@edulastic/colors'

export const EmptyWrapper = styled.div``

// Do not change id here
export const PassageWrapper = styled(Paper).attrs(() => ({
  id: 'passage-wrapper',
  className: 'passage-wrapper',
}))`
  border-radius: ${({ flowLayout }) => (flowLayout ? 0 : 10)}px;
  background: ${(props) =>
    props.flowLayout ? 'transparent' : props?.isDefaultTheme && white};
  box-shadow: ${({ flowLayout }) =>
    flowLayout ? 'unset' : `0 3px 10px 0 ${boxShadowDefault}`};
  position: relative;
  text-align: justify;
  word-break: break-word;
`
