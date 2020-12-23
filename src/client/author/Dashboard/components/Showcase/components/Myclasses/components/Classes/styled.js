import styled from 'styled-components'
import { white } from '@edulastic/colors'

export const CardContainer = styled.div`
  width: 240px;
  height: 212px;
  display: inline-block;
  margin: 0px 7px 10px 0px;
  border-radius: 10px;
  border: ${(props) => props.emptyBox || '1px solid #dadae4'};
  background: ${white};
`
export const CardBox = styled.div``
