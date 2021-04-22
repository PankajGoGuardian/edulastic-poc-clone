import { title, white } from '@edulastic/colors'
import { Col } from 'antd'
import styled from 'styled-components'

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

export const ModalTitle = styled.div`
  display: flex;
  justify-content: space-between;
  .expire-on {
    font-size: 14px;
    font-weight: 500;
    padding-right: 10px;
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
  height: 200px;
  margin-right: 7px;
  margin-bottom: 7px;
  padding: 10px;
  border: 1px solid #dddddd;
  border-radius: 4px 4px 0px 0px;
`
