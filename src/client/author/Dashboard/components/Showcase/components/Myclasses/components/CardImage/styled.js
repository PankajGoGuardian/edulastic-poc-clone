import styled from 'styled-components'
import { Row } from 'antd'
import { white } from '@edulastic/colors'
import { TextWrapper } from '../../../../../styledComponents'

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
  margin-top: 2px;
  text-overflow: ellipsis;
  font-weight: bold;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`
export const MetaText = styled(TextWrapper)`
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  width: 100%;
  margin-top: 5px;
`

export const SpanLeftMargin = styled.span`
  margin-left: 0.5rem;
`
export const RowWrapperGrade = styled(Row)`
  margin-top: 2px;
`

export const StyledRow = styled(Row)`
  display: flex;
  max-height: 35px;
  min-height: 24px;
  align-items: top;
`
