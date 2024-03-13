import { black } from '@edulastic/colors'
import styled from 'styled-components'

export const RIGHT_SECTION_PADDING_TOP = 24
export const RIGHT_SECTION_GAP = 24

export const ContentContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-evenly;
  gap: 52px;
`

export const RightSectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: space-evenly;
  gap: ${RIGHT_SECTION_GAP}px;
  padding-top: ${RIGHT_SECTION_PADDING_TOP}px;
  height: max-content;
  max-height: calc(100vh - 64px);
  overflow: auto;
  flex-grow: 6;
  padding-right: 52px;
`

export const LeftSectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: space-evenly;
  gap: 75px;
  height: max-content;
  flex-grow: 4;
  padding-left: 52px;
`

export const BackButtonContainer = styled.div`
  stroke: ${black};
  fill: ${black};
  color: ${black};
  cursor: pointer;
  margin-top: 36px;
`
