import styled from 'styled-components'
import { themeColor, lightGreen11 } from '@edulastic/colors'
import { Row, Col } from 'antd'

export const RowWrapper = styled(Row)`
  display: flex;
  align-items: center;
`

export const LeftCol = styled(Col)`
  width: ${({ width }) => width || '45px'};
  margin-right: 10px;
`

export const CenterCol = styled(Col)``

export const CardText = styled.div`
  border: 1px solid ${lightGreen11};
  background-color: white;
  margin: auto;
  border-radius: 4px;
  text-transform: uppercase;
  color: ${themeColor};
  cursor: pointer;
  padding: 7px 22px;
  display: inline-block;
`

export const AssignmentCount = styled.p`
  font-size: 11px;
  font-weight: 700;
  display: inline;
`

export const ButtonHolder = styled.div`
  width: 100%;
  text-align: center;
  position: relative;
  margin-top: -18px;
  z-index: 31;
`
