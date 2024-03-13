import { premiumBg } from '@edulastic/colors'
import { Row, Typography } from 'antd'
import styled from 'styled-components'

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
  background: ${({ background }) => background || premiumBg};
  position: absolute;
  top: 0px;
  right: 16px;
  width: 32px;
  text-align: center;
  border-radius: 0px 8px;
  line-height: 24px;
  height: 24px;
`

export const SectionWrapper = styled(Row)`
  padding: 16px 0px;
  cursor: pointer;
`
