import styled from 'styled-components'
import {
  mobileWidth,
  mainBgColor,
  mediumDesktopExactWidth,
  extraDesktopWidthMax,
} from '@edulastic/colors'

export const Container = styled.div`
  padding: 20px 30px;
  background: ${mainBgColor};
  height: ${(props) => `calc(100vh - ${props.theme.HeaderHeight.xs}px)`};

  @media (min-width: ${mediumDesktopExactWidth}) {
    height: ${(props) => `calc(100vh - ${props.theme.HeaderHeight.md}px)`};
  }
  @media (min-width: ${extraDesktopWidthMax}) {
    height: ${(props) => `calc(100vh - ${props.theme.HeaderHeight.xl}px)`};
  }
  @media (max-width: ${mobileWidth}) {
    height: initial;
    padding: 10px 25px;
  }
`

export default Container
