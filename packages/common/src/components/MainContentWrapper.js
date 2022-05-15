import styled from 'styled-components'
import {
  mediumDesktopExactWidth,
  extraDesktopWidthMax,
  mainBgColor,
  mobileWidthLarge,
  smallDesktopWidth,
} from '@edulastic/colors'

const MainContentWrapper = styled.div`
  overflow: auto;
  background: ${mainBgColor};
  padding: ${(props) => props.padding || '30px'};
  width: ${(props) => props.width || '100%'};
  height: ${(props) =>
    `calc(100vh - ${
      props.theme.isProxyUser
        ? props.theme.HeaderHeight?.xs +
          props.theme?.BannerHeight +
          (props.isInModal ? 50 : 0)
        : props.theme.HeaderHeight?.xs + (props.isInModal ? 50 : 0)
    }px)`};

  @media (min-width: ${mediumDesktopExactWidth}) {
    height: ${(props) =>
      `calc(100vh - ${
        props.theme.isProxyUser
          ? props.theme.HeaderHeight?.md +
            props.theme?.BannerHeight +
            (props.isInModal ? 50 : 0)
          : props.theme.HeaderHeight?.md + (props.isInModal ? 50 : 0)
      }px)`};
  }
  @media (min-width: ${extraDesktopWidthMax}) {
    height: ${(props) =>
      `calc(100vh - ${
        props.theme.isProxyUser
          ? props.theme.HeaderHeight?.xl +
            props.theme?.BannerHeight +
            (props.isInModal ? 50 : 0)
          : props.theme.HeaderHeight?.xl + (props.isInModal ? 50 : 0)
      }px)`};
  }
  @media (max-width: ${smallDesktopWidth}) {
    height: ${(props) =>
      `calc(100vh - ${
        props.theme.isProxyUser
          ? props.theme.HeaderHeight?.sd +
            props.theme.BannerHeight +
            (props.isInModal ? 50 : 0)
          : props.theme.HeaderHeight?.sd + (props.isInModal ? 50 : 0)
      }px)`};
  }
  @media (max-width: ${mobileWidthLarge}) {
    padding: 20px;
    height: ${(props) =>
      `calc(100vh - ${
        props.theme.HeaderHeight?.xs + (props.isInModal ? 50 : 0)
      }px)`};
  }
`

export default MainContentWrapper
