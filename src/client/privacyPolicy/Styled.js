import styled from 'styled-components'
import { darkGrey2 } from '@edulastic/colors'

export const StyledHeader = styled.h3`
  font-size: ${(props) => props.fs || '14px'};
  color: ${darkGrey2};
`
export const StyledParagraph = styled.p`
  margin-top: 10px;
  color: ${darkGrey2} !important;
  text-align: left;
  font-size: 11px !important;
  line-height: 1.6;
`

export const BodyContentWrapper = styled.div`
  padding: 10px;
  color: ${darkGrey2};
`

export const StyledList = styled.ul`
  margin-top: 10px;
`
export const StyledHeader2 = styled.h4`
  margin-top: 5px;
  color: ${darkGrey2};
`

export const StyledHeader3 = styled.h3`
  margin-top: 10px;
  color: ${darkGrey2};
`

export const StickyHeader = styled(StyledHeader)`
  padding: 5px 0px;
  width: 100%;
  background-color: #f8f8f8;
  position: sticky;
  top: 0;
`
