import styled from 'styled-components'

export const MultiChoiceContent = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  font-weight: ${(props) =>
    props.theme.widgets.multipleChoice.multiChoiceContentFontWeight};
  font-size: ${(props) =>
    props.fontSize ||
    props.theme.widgets.multipleChoice.multiChoiceContentFontSize};
  margin-left: ${({ uiStyleType, label }) =>
    uiStyleType === 'radioBelow'
      ? '0px'
      : uiStyleType === 'block' && label
      ? '52px'
      : '8px'};
  position: relative;
`

export const MultipleChoiceLabelContainer = styled.div`
  display: block;
`

MultiChoiceContent.displayName = 'MultiChoiceContent'
