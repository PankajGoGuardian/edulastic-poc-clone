import styled from 'styled-components'
import { Button } from 'antd'

import {
  white,
  themeColor,
  sectionBorder,
  smallDesktopWidth,
} from '@edulastic/colors'

export const AddQuestionWrapper = styled.div`
  position: fixed;
  width: 300px;
  bottom: 0px;
  padding-bottom: 15px;

  @media (max-width: ${smallDesktopWidth}) {
    width: 270px;
  }
`

export const ContentWrapper = styled.div`
  padding: 15px;
  background: ${white};
  border-radius: 10px;
  box-sizing: border-box;
  width: 100%;
  border: 1px solid ${sectionBorder};
`

export const QuestionTypes = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  &:last-child {
    margin-top: 12px;
  }
`

export const AddQuestionIcon = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 36px;
  height: 36px;
  border-radius: 5px;
  background: ${themeColor};
  cursor: pointer;
  &:hover {
    svg {
      fill: ${white};
    }
  }
  svg {
    fill: ${white};
    width: 21px;
    height: 19px;
    height: unset;
  }

  @media (max-width: ${smallDesktopWidth}) {
    width: 35px;
    height: 35px;
  }
`

export const AddButton = styled(Button)`
  border-radius: 5px;
  border: 1px solid ${themeColor};
  width: 48%;
  height: 32px;
  color: ${themeColor};
  font-size: 11px;
  text-transform: uppercase;
  font-weight: 600;
`
