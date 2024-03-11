import {
  desktopWidth,
  extraDesktopWidthMax,
  greyThemeDark1,
  greyThemeLight,
  greyThemeLighter,
  mediumDesktopExactWidth,
  textColor,
  themeColor,
} from '@edulastic/colors'
import { Card, FlexContainer } from '@edulastic/common'
import { Affix, Input, Pagination, Modal } from 'antd'
import styled from 'styled-components'

export const ScrollBox = styled.div`
  padding-right: 30px;
  & > div {
    padding: 20px 0px 5px;
  }
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

export const CardBox = styled.div`
  width: ${({ isPlaylist }) => (isPlaylist ? '242px' : '255px')};
  @media (min-width: ${extraDesktopWidthMax}) {
    width: 264px;
  }
`

export const Container = styled.div`
  padding: 0px 0px 0px 20px;
  left: 0;
  right: 0;
  height: 100%;
  overflow: auto;

  .ant-input-suffix {
    font-size: 15px;
    svg {
      fill: ${themeColor};
    }
  }

  .scrollbar-container {
    height: ${(props) => `calc(100vh - ${props.theme.HeaderHeight.xs + 60}px)`};

    ::-webkit-scrollbar {
      display: none;
    }

    @media (min-width: ${mediumDesktopExactWidth}) {
      height: ${(props) =>
        `calc(100vh - ${props.theme.HeaderHeight.md + 60}px)`};
    }
    @media (min-width: ${extraDesktopWidthMax}) {
      height: ${(props) =>
        `calc(100vh - ${props.theme.HeaderHeight.xl + 60}px)`};
    }
  }

  @media (max-width: ${desktopWidth}) {
    padding: 20px;
  }
`

export const ScrollbarWrapper = styled.div`
  display: ${({ isShowFilter }) => (isShowFilter ? 'none' : 'block')};
`

export const Filter = styled.div`
  width: ${(props) => (props.isShowFilter ? '20px' : '250px')};
  z-index: 0;

  @media (max-width: ${desktopWidth}) {
    display: none;
  }
`

export const CardContainer = styled(Card)`
  box-shadow: none;
  border-radius: 0px;
  .ant-card-body {
    padding: 0px;
  }
`

export const MobileFilter = styled.div`
  height: 50px;
  margin-bottom: 15px;
  display: none;

  @media (max-width: ${desktopWidth}) {
    display: flex;
    .ant-input-search {
      margin-right: 10px;
    }
  }
`

export const Main = styled.div`
  flex: 1;
  background: white;
  width: ${(props) =>
    props.isShowFilter ? 'calc(100% - 20px)' : 'calc(100% - 250px)'};
  overflow: hidden;
  height: ${(props) => `calc(100vh - ${props.theme.HeaderHeight.xs}px)`};

  @media (min-width: ${mediumDesktopExactWidth}) {
    height: ${(props) => `calc(100vh - ${props.theme.HeaderHeight.md}px)`};
  }
  @media (min-width: ${extraDesktopWidthMax}) {
    height: ${(props) => `calc(100vh - ${props.theme.HeaderHeight.xl}px)`};
  }
  @media (max-width: ${desktopWidth}) {
    width: 100%;
  }
`

export const FilterButton = styled.div`
  flex: 1;
  height: 50px;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.07);
  border-radius: 3px;

  .ant-btn {
    height: 50px;
    border-radius: 3px;
    width: 100%;

    span {
      font-size: 11px;
      font-weight: 600;
      color: ${textColor};
    }
  }
`

export const SearchModalContainer = styled.div`
  width: 100%;
`

export const MobileFilterModal = styled(Modal)`
  display: block;
  @media (min-width: ${desktopWidth}) {
    display: block;
  }
`

export const AffixWrapper = styled(Affix)`
  position: fixed;
  width: 250px;
  top: ${(props) =>
    props.theme.HeaderHeight.xs +
    (props.isBannerShown ? props.theme.BannerHeight : 0)}px;
  padding: 0px 0px 20px;

  @media (min-width: ${mediumDesktopExactWidth}) {
    top: ${(props) =>
      props.theme.HeaderHeight.md +
      (props.isBannerShown ? props.theme.BannerHeight : 0)}px;
  }
  @media (min-width: ${extraDesktopWidthMax}) {
    top: ${(props) =>
      props.theme.HeaderHeight.xl +
      (props.isBannerShown ? props.theme.BannerHeight : 0)}px;
  }
`

export const PaginationWrapper = styled(Pagination)`
  padding: ${(props) => (props.type === 'tile' ? '20px 0' : '24px 32px')};
  padding-right: 55px;
  text-align: right;
`

export const StyleChangeWrapper = styled.div`
  margin-right: 15px;
  width: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  svg {
    cursor: pointer;
  }
`

export const StyledCountText = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-right: 10px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
`

export const ItemsMenu = styled(FlexContainer)`
  align-items: center;
  justify-content: space-between;
  padding: 22px 30px;

  @media screen and (max-width: ${desktopWidth}) {
    padding: 15px;
  }
`

export const PaginationInfo = styled.div`
  font-weight: 600;
  font-size: 13px;
  text-transform: uppercase;
  white-space: nowrap;
  span:first-child {
    background: ${greyThemeLight};
    padding: 2px 25px;
    border-radius: 15px;
    color: ${greyThemeDark1};
    margin-right: 5px;
  }
`

export const FiltersWrapper = styled.div`
  display: flex;
  justify-self: center;
  margin-right: auto;
  margin-left: 10px;
  justify-content: flex-start;
  flex-wrap: wrap;
  .ant-tag {
    color: #686f75;
    background: #bac3ca;
    padding: 2px 10px;
    border: none;
    font-weight: bold;
    border-radius: 6px;
    margin-bottom: 5px;
  }
`

export const NoDataMessageContainer = styled.div`
  max-width: ${({ maxWidth }) => maxWidth || '210px'};
  text-align: center;
  font-size: 20px;
`

export const LoaderOverlay = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1002;
  background: rgba(0, 0, 0, 0.2);
`
