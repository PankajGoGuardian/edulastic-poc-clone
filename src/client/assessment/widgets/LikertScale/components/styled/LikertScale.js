import { greyThemeLight } from '@edulastic/colors'
import styled from 'styled-components'

export const LikertScaleContainer = styled.div`
  display: flex;
  flex-grow: 0;
  flex-shrink: 0;
  flex-basis: auto;
  padding-top: 0.6em;
  margin-top: 50px;
`

export const LikertOption = styled.label`
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: 0;
  min-width: 150px;
  text-align: center;
  position: relative;
`
export const LikertLine = styled.span`
  display: inline-block;
  visibility: ${({ hide }) => (hide ? 'hidden' : 'unset')};
  width: 50%;
  vertical-align: top;
  margin-top: 2.4em;
  border-top: 3px solid ${greyThemeLight};
`

export const LikertOptionLabel = styled.span`
  display: inline-block;
  padding-top: 4em;
  padding-left: 0.4em;
  padding-right: 0.4em;
  width: 100%;
  box-sizing: border-box;
`
