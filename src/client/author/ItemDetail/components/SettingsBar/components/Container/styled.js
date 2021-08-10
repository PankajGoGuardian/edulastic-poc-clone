import styled from 'styled-components'
import { title, cardBg, mobileWidth } from '@edulastic/colors'
import { Radio } from 'antd'

export const Content = styled.div`
  width: 25vw;
  background: ${cardBg};
  position: fixed;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 1031;
  padding: 30px;
  box-shadow: -3px 3px 6px 0 rgba(0, 0, 0, 0.16);
  overflow-y: auto;

  @media (max-width: ${mobileWidth}) {
    width: 100%;
  }
`

export const SettingsButtonWrapper = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
`

export const Heading = styled.div`
  color: ${title};
  margin-bottom: 30px;
  font-size: 20px;
  font-weight: 700;
`

export const Items = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`

export const Checkboxes = styled.div`
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  .ant-checkbox-wrapper {
    margin-left: 0px;
    color: rgba(67, 75, 93, 0.9);
    font-weight: bold;
    font-size: 13px;
  }
`

export const FlexRadioGroup = styled(Radio.Group)`
  display: flex;
  flex-direction: column;
  width: 100%;

  .ant-radio-wrapper {
    display: flex;
    span:nth-child(2) {
      label {
        white-space: normal;
      }
    }
  }
`
