import styled from 'styled-components'
import { Icon } from 'antd'
import { Paper, WithMathFormula } from '@edulastic/common'
import { white, black, red, blue, boxShadowDefault } from '@edulastic/colors'

export const EmptyWrapper = styled.div``

export const QuestionTitleWrapper = styled.div`
  display: flex;
`

export const PaginatedPassageContentWrapper = styled.div`
  ul.ant-pagination {
    justify-content: center;
    display: flex;
    margin-top: 16px;
  }
`

export const PassageTitleWrapper = styled.div`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-bottom: 15px;
`

export const ColorPickerContainer = styled.div`
  z-index: 900;
  padding: 8px 16px;
  background: ${white};
  box-shadow: 0 -2px 8px #00000090;
  border-radius: 4px;
  user-select: none;
  transition: opacity 0.3s;

  &::after {
    position: absolute;
    content: '';
    border: 10px solid;
    border-top-color: white;
    border-right-color: transparent;
    border-bottom-color: transparent;
    border-left-color: transparent;
    bottom: 40px;
    left: 50%;
    transform: translateX(-50%) rotate(180deg);
  }
`

export const Overlay = styled.div`
  position: fixed;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  z-index: 2;
`

export const BackSlashIcon = styled(Icon)`
  font-size: 30px;
  transform: translate(-10%, -10%) rotate(-45deg);
  color: ${red};
`

export const ColorButton = styled.div`
  height: 25px;
  width: 25px;
  margin-right: 5px;
  border-radius: 4px;
  border: 1px solid;
  cursor: pointer;

  &:hover {
    border-color: ${blue};
  }

  ${({ color, active }) => `
    background: ${color || white};
    border-color: ${active ? blue : color || black};
  `}
`

export const Heading = WithMathFormula(styled.div`
  font-size: ${(props) => props.theme.widgets.passage.headingFontSize};
  font-weight: ${(props) => props.theme.widgets.passage.headingFontWeight};
  margin-bottom: 15px;
`)

export const InstructorStimulus = WithMathFormula(styled.div`
  background: ${(props) =>
    props.theme.widgets.passage.instructorStimulusBgColor};
  padding: 10px;
  border-radius: 10px;
`)

// Do not change id here
export const PassageWrapper = styled(Paper).attrs(() => ({
  id: 'passage-wrapper',
  className: 'passage-wrapper',
}))`
  border-radius: ${({ flowLayout }) => (flowLayout ? 0 : 10)}px;
  background: ${(props) =>
    props.flowLayout ? 'transparent' : props?.isDefaultTheme && white};
  box-shadow: ${({ flowLayout }) =>
    flowLayout ? 'unset' : `0 3px 10px 0 ${boxShadowDefault}`};
  position: relative;
  text-align: justify;
  word-break: break-word;
`
