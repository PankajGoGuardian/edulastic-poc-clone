import { premiumBg } from '@edulastic/colors'
import { Row, Typography } from 'antd'
import styled from 'styled-components'
import { DollarSymbolWrapper } from '../../common/AddOnTag'

export const HeadingWrapper = styled(Typography.Text)`
  font-size: 16px;
  color: black;
`

export const DescriptionWrapper = styled.div`
  padding-top: 4px;
`

export const StyledCardWrapper = styled.div`
  border: 1px solid #d8d8d8;
  border-radius: 8px;
  padding: 16px 8px;
  height: 108px;
`

export const StyledIconWrapper = styled.div`
  position: absolute;
  top: 6px;
  right: 22px;
  text-align: center;
`

export const SectionWrapper = styled(Row)`
  padding: 16px 0px;
  cursor: pointer;
`

export const AddOnIconWrapper = styled(DollarSymbolWrapper)`
  background: ${premiumBg};
  padding-left: 4px;
  width: max-content;
`

export const AddOnTextWrapper = styled.span`
  color: white;
  font-weight: bolder;
  font-size: 11px;
  padding-right: 12px;
`
