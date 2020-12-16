import styled from 'styled-components'
import { Row } from 'antd'
import { white } from '@edulastic/colors'

export const Image = styled.img`
  width: 100%;
  height: 98px;
  position: relative;
  filter: brightness(50%);
  border: none;
  box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.1);
  border-radius: 10px 10px 0px 0px;
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
  padding: 9px 12px;
  font-weight: bold;
`
export const IconWrapper = styled.div`
  position: absolute;
  top: 0px;
  right: 2px;
  display: flex;
`
export const CircleBtn = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${(props) => props.bg || white};
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
`
export const TextDiv = styled.p`
  font-size: 13px;
  text-overflow: ellipsis;
  display: block;
  max-width: 100%;
  overflow: hidden;
  white-space: nowrap;
  font-weight: bold;
  padding-right: 60px;
`
export const SpanLeftMargin = styled.span`
  margin-left: 0.5rem;
`
export const RowWrapperGrade = styled(Row)`
  margin-top: 2px;
`

export const StyledRow = styled(Row)`
  display: flex;
  height: 24px;
  align-items: center;
`
