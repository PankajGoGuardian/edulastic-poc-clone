import styled, { css } from 'styled-components'
import { Row } from 'antd'
import { white } from '@edulastic/colors'
import { TextWrapper } from '../../../../../styledComponents'

const CircleBtnStyle = css`
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  margin: 3px 5px;
`

export const Image = styled.img`
  width: 100%;
  height: 145px;
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
  padding: 9px 15px;
  font-weight: bold;
  cursor: pointer;
`
export const IconWrapper = styled.div`
  display: flex;
  justify-content: end;
`

export const FavCircleBtn = styled.div`
  ${CircleBtnStyle}
  &:hover {
    svg {
      transform: scale(1.15);
    }
  }
  & > i > svg {
    fill: ${(props) => (props.isFavorite ? '#ca481e' : white)};
  }
`

export const TextDiv = styled.p`
  font-size: 14px;
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
  margin: 5px 0px;
`

export const StyledRow = styled(Row)`
  display: flex;
  max-height: 35px;
  min-height: 24px;
  align-items: top;
  margin: 5px 0px;
`
