import { title } from '@edulastic/colors'
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
