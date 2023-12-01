import styled from 'styled-components'

import { themeColor } from '@edulastic/colors'

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  color: ${themeColor};
  font-weight: 600;
  font-size: 10px;
  user-select: none;
  white-space: nowrap;
`

export const SpaceElement = styled.div`
  display: inline-block;
  width: 4px;
`
