import { greyThemeLight, lightGrey, greyThemeLighter } from '@edulastic/colors'
import styled from 'styled-components'
import { Popover, Row, Typography, Col } from 'antd'

export const StyledPopoverContainer = styled(Popover)`
  border: 1px solid ${greyThemeLight};
  background-color: ${greyThemeLighter};
  border-radius: 2px;
  padding: 4px 12px;
  font-size: 18px;
  line-height: 38px;
  cursor: pointer;
`

export const StyledDropdownContainer = styled.span`
  padding: 0px 12px;
`

export const StyledInfoContainer = styled(Row)`
  background: ${lightGrey};
  padding: 4px 6px;
`

export const IconContainer = styled.div`
  border-radius: 50%;
  padding: 10px 12px;
  background: ${lightGrey};
  height: 40px;
  width: 40px;
  border: 1px solid #eeeeee;
`

export const StyledInfoTextContainer = styled(Typography.Text)`
  font-size: 12px;
  font-weight: 600;
  color: black;
`

export const StyledQuestionTypeContainer = styled(Col)`
  height: 40px;
  margin-bottom: 12px;
  cursor: pointer;
`

export const StyledPopoverContentContainer = styled.div`
  width: 416px;
  margin: -12px -16px;
`
