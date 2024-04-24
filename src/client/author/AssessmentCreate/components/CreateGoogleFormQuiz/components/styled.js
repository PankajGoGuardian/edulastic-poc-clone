import { red } from '@edulastic/colors'
import { Button, Col, Progress, Skeleton, Typography } from 'antd'
import styled from 'styled-components'

export const HeadingWrapper = styled(Typography.Paragraph)`
  font-size: 16px;
  color: black;
`
export const StyledSkelton = styled(Skeleton)`
  width: 320px;
`

export const StyledProgress = styled(Progress)`
  padding: 8px 0px;
`

export const FormIconWrapper = styled(Col)`
  line-height: 16px;
`
export const FormNameWrapper = styled.div`
  font-weight: 600;
  font-size: 14px;
`

export const StyledCancelButton = styled(Button)`
  color: ${red} !important;
  border: none !important;
  font-size: 14px;
  font-weight: 600;
`
export const StyledList = styled.ul`
  font-weight: 600;
  padding: 16px 24px 6px 24px;

  li {
    margin: 8px;
  }
`

export const StyledListItem = styled.li`
  &::marker {
    color: ${({ color }) => color || 'unset'};
  }
`

export const MessageWrapper = styled.div`
  padding: 8px 0px;
  font-weight: 600px;
`
