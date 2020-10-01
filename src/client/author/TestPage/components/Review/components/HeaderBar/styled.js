import styled from 'styled-components'
import { Checkbox, Button } from 'antd'

import { FlexContainer } from '@edulastic/common'
import {
  secondaryTextColor,
  themeColor,
  mobileWidthMax,
  desktopWidth,
} from '@edulastic/colors'

export const Item = styled(FlexContainer)`
  cursor: pointer;
  margin-right: 20px;
  color: ${themeColor};
  position: relative;
`

export const Container = styled(FlexContainer)`
  justify-content: space-between;
  margin: 0px;
  width: ${(props) => props.hasStickyHeader && '100%'};

  @media (max-width: ${desktopWidth}) {
    margin-top: 15px;
    justify-content: space-between;
    .fixed-second-header {
      margin-top: 0px;
    }
  }
`

export const SelectAllCheckbox = styled(Checkbox)`
  font-size: 12px;
  font-weight: 600;
  color: ${secondaryTextColor};
  text-transform: uppercase;
  white-space: nowrap;

  .ant-checkbox {
    margin-right: 10px;
    & + span {
      padding: 0px;
    }
  }

  .ant-checkbox-inner {
    width: 18px;
    height: 18px;
  }
`

export const ActionButton = styled(Button)`
  padding: 0;
  border: 1px solid ${themeColor};
  border-radius: 4px;
  margin-left: 10px;

  @media screen and (max-width: ${mobileWidthMax}) {
    width: 40px;
    min-height: 40px;
    margin-left: 5px;
    button {
      flex-direction: column;
      margin: 0 auto;
    }
  }
`

export const MobileButtomContainer = styled.div``
