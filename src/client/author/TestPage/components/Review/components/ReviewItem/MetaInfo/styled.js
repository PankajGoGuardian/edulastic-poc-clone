import styled from 'styled-components'
import { Tag } from 'antd'

import { greenDark, greyDarken, themeLightGrayBgColor } from '@edulastic/colors'

export const FirstText = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: ${greenDark};
`

export const SecondText = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: #444444;
`

export const CategoryTitle = styled.span`
  font-size: 13px;
  color: #444444;
`

export const TypeContainer = styled.div`
  margin-top: 16px;
  margin-bottom: 15px;
`

export const MetaTag = styled(Tag)`
  height: 20px;
  background: ${themeLightGrayBgColor};
  border: none;
  color: ${greyDarken};
  text-transform: uppercase;
  font-weight: 700;
  font-size: 8px;
  line-height: 1.5;
  margin-right: 3px;
  padding: 4px 10px;
  &:first-child {
    margin-left: ${(props) => (props.marginLeft ? props.marginLeft : '55px')};
  }
`

export const ExtraInfo = styled.span`
  font-weight: 800;
  color: #bbbfc4;
`

export const DokStyled = styled.div`
  font-size: 10px;
  font-weight: 600;
  color: #bbbfc4;
  margin-right: 15px;
`
