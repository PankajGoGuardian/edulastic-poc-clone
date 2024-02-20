import styled from 'styled-components'
import { themeColor } from '@edulastic/colors'
import { Icon as AntIcon } from 'antd'
import IconPearAssessmentFormerlyEdulastic from '@edulastic/icons/src/IconPearAssessmentFormerlyEdulastic'

export const EduLogo = styled(IconPearAssessmentFormerlyEdulastic)`
  position: fixed;
  top: 20px;
  left: 0px;
  min-width: 200px;
`

export const StyledSignOut = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
`

export const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
  margin: 0px 4px;
  color: white;
`

export const UserName = styled.div`
  font-size: 13px;
  color: white;
`

export const IconDropdown = styled(AntIcon)`
  color: white;
  position: fixed;
  top: 20px;
  right: 5px;
`

export const StyledLogo = styled.img`
  min-height: 75px;
`

export const StyledText = styled.div`
  width: ${({ width }) => width || '100%'};
  color: white;
  font-size: ${(props) => props.fontSize || '18px'};
  font-weight: 600;
  text-align: center;
  margin: ${({ margin }) => margin || '0px'};
`

export const HighlightedText = styled.span`
  display: inline-block;
  color: white;
  font-weight: 800;
  font-size: 22px;
`

export const Button = styled.button`
  color: ${themeColor};
  font-weight: 600;
  font-size: 16px;
  background: white;
  outline: none;
  margin-top: 50px;
  border: none;
  width: 70%;
  padding: 5px;
  text-align: center;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background: #f8f8f8;
  }
`

export const BaseText = styled.p`
  position: fixed;
  bottom: 2%;
  color: white;
`
