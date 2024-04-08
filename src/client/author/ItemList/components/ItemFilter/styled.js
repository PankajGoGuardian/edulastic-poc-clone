import {
  boxShadowDefault,
  desktopWidth,
  dropZoneTitleColor,
  extraDesktopWidthMax,
  greenDark,
  greyThemeLight,
  greyThemeLighter,
  lightGreySecondary,
  secondaryTextColor,
  textColor,
  themeColor,
} from '@edulastic/colors'
import { TextField } from '@edulastic/common'
import { Affix, Icon, Input, Row } from 'antd'
import Modal from 'react-responsive-modal'
import styled from 'styled-components'

export const Container = styled.div`
  display: ${({ show }) => (show ? 'block' : 'none')};
  background: ${lightGreySecondary};
  width: 300px;
  height: calc(100vh - 110px);
  position: fixed;
  left: 50%;
  top: 110px;
  z-index: 1;
  transform: translateX(-50%);

  @media (min-width: ${desktopWidth}) {
    width: 260px;
    height: 100%;
    overflow: auto;
    position: unset;
    transform: unset;
    background: unset;
  }
  @media (min-width: ${extraDesktopWidthMax}) {
    width: 370px;
  }
`

export const AffixContainer = styled(Affix)``

export const CloseIcon = styled(Icon)`
  font-size: 24px;
  width: 100%;
  padding: 15px 25px 0px;
  text-align: right;
  display: block;
  cursor: pointer;

  @media (min-width: ${desktopWidth}) {
    display: none;
  }
`

export const Backdrop = styled.div`
  position: fixed;
  background: rgba(0, 0, 0, 0.6);
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  display: block;
  z-index: 1;

  @media (min-width: ${desktopWidth}) {
    display: none;
  }
`

export const FixedFilters = styled.div`
  width: 100%;
  position: relative;
  top: auto;
  padding: 0px;

  @media (min-width: ${desktopWidth}) {
    padding: 20px 30px 0px;
  }
  @media (min-width: ${extraDesktopWidthMax}) {
    padding: 20px 50px 0px;
  }
`

export const SearchWrapper = styled.div`
  display: flex;
  padding: 25px 25px 0px 19px;

  @media (min-width: ${desktopWidth}) {
    padding: 0px;
  }
`

export const HeaderRow = styled(Row)`
  width: 100%;
`

export const SearchInput = styled(Input.Search)`
  .ant-input {
    background: ${greyThemeLighter};
    border: 1px solid ${greyThemeLight};
    border-radius: 2px;
    height: 40px;
    font-size: ${(props) => props.theme.smallLinkFontSize};

    @media (min-width: ${extraDesktopWidthMax}) {
      font-size: ${(props) => props.theme.smallFontSize};
    }
  }
  svg {
    fill: ${themeColor};
  }
`

export const SearchField = styled.div`
  box-shadow: ${boxShadowDefault};
  border-radius: 0;
`

export const TextFieldStyled = styled(TextField)`
  padding: 16px;
  padding-right: 68px;
  outline: none;
  border-radius: 0;
`

export const TextFieldSearch = styled(TextField)`
  height: 40px;
  padding: 10px 15px;
  font-size: 12px;
  letter-spacing: 0;
  border: none;
  color: ${dropZoneTitleColor};
  font-style: normal;
  box-shadow: 0 2px 4px 0 #c9d0db;

  span {
    right: 8px;
  }

  .ant-input-search-icon {
    color: ${themeColor};
    font-size: 15px;
    &:hover {
      color: ${themeColor};
    }
  }
`

export const SearchIcon = styled(Icon)`
  color: ${themeColor};
  font-size: 15px;
`

export const FilterButton = styled.div`
  display: block;
  flex: 1;
  height: 40px;
  box-shadow: ${boxShadowDefault};
  border-radius: 10px;
  margin-left: 10px;

  .ant-btn {
    height: 40px;
    border-radius: 10px;
    width: 100%;

    span {
      font-size: 11px;
      font-weight: 600;
      color: ${textColor};
    }
  }

  @media (min-width: ${desktopWidth}) {
    display: none;
  }
`

export const MainFilter = styled.div`
  margin-top: 19px;
  z-index: 0;
  position: relative;
  display: block;
  padding: 0px 25px 0px 19px;

  .scrollbar-container {
    ::-webkit-scrollbar {
      display: none;
    }
  }

  .ant-menu {
    margin-top: 16px;

    &-item {
      font-size: 11px;
      border-left: 4px solid transparent;
      border-radius: 0 10px 10px 0;
      padding: 0 18px;
      text-transform: uppercase;

      &-selected {
        border-left: 4px solid ${greenDark};
      }
      .anticon {
        font-size: 21px;
      }
    }
  }

  @media (min-width: ${desktopWidth}) {
    padding: 0px;
  }
`

export const MainFilterHeader = styled.div`
  display: flex;
`

export const Title = styled.span`
  font-size: 14px;
  letter-spacing: 0.3px;
  color: ${secondaryTextColor};
  font-weight: 600;
  text-transform: uppercase;
  flex: 1;
`

export const Clear = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: #3F85E5;
  border: 1px solid #3F85E5;
  padding: 2px 10px;
  border-radius: 3px;
  background: transparent;
  cursor: pointer;
  text-transform: uppercase;
  margin: 3px 0 0;
`

export const StyledModal = styled(Modal)`
  width: 100%;
  height: 100%;

  svg {
    fill: red;
  }
`

export const StyledModalContainer = styled.div`
  width: calc(100vw - 80px);
`

export const StyledModalTitle = styled.div`
  font-size: 22px;
  color: ${themeColor};
  font-weight: 600;
`
