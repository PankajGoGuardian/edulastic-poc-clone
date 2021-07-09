import styled, { css } from 'styled-components'
import {
  green,
  title,
  cardTitleColor,
  themeColorLighter,
  themeColor,
  greyThemeDark2,
  lightGrey1,
} from '@edulastic/colors'
import { Row, Col, Icon } from 'antd'

export const IconWrapper = styled.div`
  width: 36px;
  height: 36px;
  background: ${themeColorLighter}33;
  border-radius: 50%;
  position: relative;
`
export const OverlayText = styled.div`
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  position: absolute;
  text-align: center;
  color: ${themeColorLighter};
  font-size: 14px;
  z-index: 30;
  line-height: 36px;
  font-weight: 600;
`

export const RowWrapper = styled(Row)`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  height: 36px;
  cursor: pointer;
`

export const LeftCol = styled(Col)`
  width: ${({ width }) => width || '45px'};
  margin-right: 12px;
`

export const CenterCol = styled(Col)`
  width: calc(100% - 60px);
  display: flex;
  flex-direction: column;
`

export const RightCol = styled(Col)`
  width: ${({ width }) => width || '30px'};
  height: ${({ height }) => height || '45px'};
  margin-left: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const Label = styled.label`
  color: #aaafb5;
  font-size: 9px;
  width: 100%;
  margin-bottom: 3px;
  text-transform: uppercase;
  font-weight: bold;
`

export const RowWrapper1 = styled(Row)`
  cursor: pointer;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  height: 44px;
`

export const CardText = styled.div`
  padding: 10px 12px;
`
export const Image = styled.img`
  width: 44px;
  height: 26px;
  border-radius: 5px;
`

export const TextDiv = styled.p`
  color: ${title};
  size: 12px;
  text-overflow: ellipsis;
  display: block;
  max-width: 100%;
  overflow: hidden;
  white-space: nowrap;
`
export const IconRightArrow = styled(Icon)`
  color: ${green};
  font-size: 20px;
`

const SharedTextStyle = css`
  font-weight: 600;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`
export const AssignmentStatusText = styled.p`
  font-size: 9px;
  padding: 2px 0px 0px !important;
  color: ${cardTitleColor};
  ${SharedTextStyle}
`
export const AssignmentTitle = styled.p`
  font-size: 11px;
  padding: 0px !important;
  ${SharedTextStyle}
`

export const AssignmentCount = styled.p`
  font-size: 13px;
  font-weight: 600;
  color: #30404f;
`
export const StyledPopoverContainer = styled.div`
  > div {
    .ant-popover-content {
      .ant-popover-arrow {
        display: block;
      }
      .ant-popover-inner {
        border-radius: 5px;
        .ant-popover-inner-content {
          padding: 12px 10px;
          > a {
            font-size: 12px;
            display: flex;
            justify-content: space-between;
            padding: 2px 4px;
            border-radius: 4px;
            transition: transform 0.2s ease;
            :hover {
              background: ${lightGrey1};
              cursor: pointer;
              transform: scale(1.05);
            }
            >span: first-child {
              display: block;
              width: 64%;
              color: ${greyThemeDark2};
              font-weight: 600;
            }
            >span: last-child {
              width: 34%;
              text-align: center;
              color: ${themeColor};
              font-weight: 600;
            }
          }
        }
      }
    }
  }
`
