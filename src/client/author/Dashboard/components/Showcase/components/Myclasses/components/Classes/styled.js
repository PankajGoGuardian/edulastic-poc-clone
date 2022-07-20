import styled from 'styled-components'
import { white } from '@edulastic/colors'

export const CardContainer = styled.div`
  width: 275px;
  height: 250px;
  display: inline-block;
  margin: 0px 18px 20px 0px;
  border-radius: 10px;
  border: ${(props) => props.emptyBox || '1px solid #dadae4'};
  background: ${white};
  transform: scale(1);
  transition: 0.2s;
  &:hover {
    transform: scale(1.03);
    overflow: hidden;
  }
`
export const EmptyBoxes = styled.div`
  width: 240px;
  height: 212px;
  display: inline-block;
`
export const CardBox = styled.div``
