import styled from 'styled-components'
import { FlexView } from '../../../styled/FlexView'

export const ImageFlexView = styled(FlexView)`
  flex-direction: column;
  align-items: ${({ alignItems }) => (!alignItems ? 'center' : alignItems)};
  background: ${(props) =>
    props.theme.widgets.clozeImageDropDown.imageFlexViewBgColor};
  border-radius: 0px 0px 10px 0px;
  overflow: auto;
  position: relative;
`
