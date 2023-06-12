import { darkGrey, title, white } from '@edulastic/colors'
import { Col } from 'antd'
import styled from 'styled-components'
import {
  testStatusBackgroundColor,
  testStatusTextColor,
} from '../../../constants/colors'

export const Title = styled.div`
  h2 {
    font-size: 18px;
    display: flex;
    align-items: center;
    margin: 0px;
    font-weight: bold;
    span {
      margin-left: 20px;
    }
  }
`
export const ModalBody = styled.div`
  font-size: 14px;
  color: #304050;
`
export const FlexRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
`
export const Boxes = styled.div`
  width: 210px;
  height: 210px;
  border: 2px solid #dadae4;
  border-radius: 10px;
  color: ${title};
  font-size: 16px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-direction: column;
  svg {
    height: 85px;
    margin-bottom: 30px;
  }
`
export const StyledCol = styled(Col)`
  margin-bottom: 25px;
`

export const EmailWrapper = styled.div`
  margin-top: 25px;
  margin-bottom: 15px;
`
export const LabelIconWrapper = styled.div`
  display: flex;
`

export const ModalTitle = styled.div`
  display: flex;
  justify-content: space-between;
  .expire-on {
    font-size: 14px;
    font-weight: 500;
    padding-right: 35px;
  }
`
export const StyledTag = styled.span`
  color: ${title};
  font-size: 11px;
  background: #e3e3e3;
  padding: 7px 22px;
  font-weight: 600;
  border-radius: 20px;
  margin-bottom: 5px;
  margin-right: 5px;
  text-transform: uppercase;
  cursor: pointer;
  &:hover,
  &.active {
    background: #3f85e5;
    color: ${white};
  }
`
export const ContentWrapper = styled.div`
  padding: 5px 0px 20px;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  max-height: 250px;
  overflow: auto;
  flex-wrap: wrap;
`
export const CurriculumCard = styled.div`
  width: 160px;
  margin-right: 10px;
  margin-bottom: 10px;
  border-radius: 6px 6px 0px 0px;
  overflow: hidden;
  cursor: pointer;
  position: relative;
  &:hover {
    .showHover {
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      flex-direction: column;
    }
`
export const ButtonWrapper = styled.div`
  position: ${({ position }) => position || 'absolute'};
  display: none;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1;
  width: 160px;
  height: 190px;
`

export const Thumbnail = styled.div`
  width: 100%;
  height: 190px;
  background: ${({ img }) => `url(${img})`};
  background-size: cover;
  background-repeat: no-repeat;
}`

export const CardFooter = styled.div`
  border-radius: 0px 0px 6px 6px;
  border: 1px solid #b6b6cc;
  border-top: none;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 10px;
`

export const PlaylistId = styled.div`
  font-size: 7px;
  overflow: hidden;
  color: #a5acb4;
  display: flex;
  align-items: center;
  span:first-child {
    font-size: 11px;
    margin-right: 2px;
    color: ${darkGrey};
  }
`
export const ShareIcon = styled.div`
  display: inline-flex;
  align-items: center;
`
export const IconText = styled.span`
  font-size: 7px;
  color: #a5acb4;
  margin-left: 5px;
`
export const TestStatus = styled.span`
  background: ${({ status }) => testStatusBackgroundColor[status]};
  padding: 2px 7px;
  border-radius: 5px;
  font-size: 6px;
  color: ${({ status }) => testStatusTextColor[status]};
  text-transform: uppercase;
  font-weight: bold;
  height: 14px;
  justify-content: center;
  align-items: center;
`
