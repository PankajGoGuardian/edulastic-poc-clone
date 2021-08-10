import styled from 'styled-components'
import { themeColor, white } from '@edulastic/colors'

export const CardContainer = styled.div`
  width: 240px;
  height: 212px;
  display: inline-block;
  margin: 0px 8px 10px 0px;
  border-radius: 10px;
  border: ${(props) => props.emptyBox || '1px solid #dadae4'};
  background: ${white};
  transform: scale(1);
  transition: 0.2s;
  &:hover {
    box-shadow: 0 0 3px 2px ${themeColor};
    transform: scale(1.03);
    border: none;
    overflow: hidden;
  }
`
export const EmptyBoxes = styled.div`
  width: 240px;
  height: 212px;
  display: inline-block;
`
export const CardBox = styled.div``
