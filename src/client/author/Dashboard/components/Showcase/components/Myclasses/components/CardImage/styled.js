import styled from 'styled-components'
import { Row } from 'antd'
import { white } from '@edulastic/colors'

export const Image = styled.img`
  width: 100%;
  height: 162px;
  position: relative;
  filter: brightness(50%);
  border: none;
  box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.1);
  border-radius: 10px;
`
export const OverlayText = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 30;
  color: ${white};
  overflow: hidden;
  padding: 0.5rem;
  font-weight: bold;
`
export const IconWrapper = styled.div`
  width: 34px;
  height: 34px;
  padding: 0.5rem;
  border-radius: 50%;
  background: ${white};
  cursor: pointer;
  position: absolute;
  top: 0px;
  right: 2px;
  display: flex;
  justify-content: center;
  align-items: center;
`
export const TextDiv = styled.p`
  font-size: ${(props) => props.theme.assignment.cardTitleFontSize};
  text-overflow: ellipsis;
  display: block;
  max-width: 100%;
  overflow: hidden;
  white-space: nowrap;
  font-weight: bold;
  padding-right: 50px;
`
export const SpanLeftMargin = styled.span`
  margin-left: 0.5rem;
`
export const RowWrapperGrade = styled(Row)`
  margin-top: 0.3rem;
`
export const RowWrapperSTudentCount = styled(Row)`
  margin-top: 1.3rem;
`

export const StyledRow = styled(Row)`
  display: flex;
  height: 34px;
  align-items: center;
`
