import { Table, Button, Modal } from 'antd'
import { white, themeColor, mediumDesktopExactWidth } from '@edulastic/colors'
import { IconInfoBlack } from '@edulastic/icons'
import styled from 'styled-components'

export const Container = styled.div`
  margin: 20px;
  background: ${white};
`

export const Title = styled.h1`
  font-size: 20px;
  color: ${white};
  font-weight: bold;
`

export const ApplyButton = styled(Button)`
  background: ${white};
  color: ${themeColor};
  padding: 0px 30px;
  margin-left: 15px;
  display: flex;
  align-items: center;
  height: 36px;
  font-weight: 600;
  &:hover,
  &:focus {
    background: ${white};
    color: ${themeColor};
  }

  @media (min-width: ${mediumDesktopExactWidth}) {
    height: 45px;
  }
`

export const StyledTable = styled(Table)`
  margin-top: 20px;
`

export const InputsWrapper = styled.div`
  margin-top: ${({ mt }) => mt || '20px'};
  .ant-radio-wrapper {
    display: block;
  }
`

export const OptionTitle = styled.h3`
  font-weight: bold;
`

export const SecondHeader = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px;
  .ant-btn {
    background: transparent;
    height: 24px;
    margin-left: 17px;
  }
`
export const StyledModal = styled(Modal)`
  .ant-modal-header {
    padding: 8px 30px 8px 24px;
    border-bottom: none;
    .question-bank-icon {
      width: 16px;
      height: 19px;
    }
  }
  .ant-modal-close-x {
    display: none;
  }
  .ant-modal-footer {
    border-top: none;
  }
  .ant-modal-body {
    padding-top: 0px;
  }
`
export const StyledIconInfoBlack = styled(IconInfoBlack)`
  margin-bottom: -4px;
`
export const StyledQuestionTypeChangeInfo = styled.div`
  margin-top: 25px;
  font-size: 12px;
  color: black;
`
