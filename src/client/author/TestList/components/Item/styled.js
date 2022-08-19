import {
  cardTitleColor,
  darkGrey,
  extraDesktopWidthMax,
  lightGrey,
  red,
  themeColor,
  titleColor,
  white,
  blue1,
  greyLight1,
} from '@edulastic/colors'
import { Card, MathFormulaDisplay } from '@edulastic/common'
import { Rate, Icon } from 'antd/lib/index'
import styled, { css } from 'styled-components'

export const Container = styled(Card)`
  border: ${(props) => (props.isPlaylist ? 'none' : '1px solid #dfdfdf')};
  box-shadow: none;
  cursor: pointer;
  border-radius: ${(props) => (props.isPlaylist ? '4px' : '10px')};
  &.ant-card {
    width: ${(props) => (props.isTestRecommendation ? '240px' : null)};
    height: ${(props) => (props.isTestRecommendation ? '190px' : null)};
    overflow: ${(props) => (props.isTestRecommendation ? 'hidden' : null)};
    transform: ${(props) => (props.isTestCard ? `scale(1)` : null)};
    transition: 0.2s;
    .ant-card-body {
      padding: 16px 12px;
      border: ${(props) => (props.isPlaylist ? '1px solid #dfdfdf' : 'none')};
      border-radius: ${(props) => (props.isPlaylist ? '10px' : '0px')};
      min-height: ${(props) => (props.isTestRecommendation ? '90px' : '185px')};
      height: ${(props) => (props.isPlaylist ? '240px' : null)};
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
    }
    &:hover {
      box-shadow: ${(props) =>
        props.isTestCard ? `0 0 3px 2px ${themeColor}` : null};
      transform: ${(props) => (props.isTestCard ? `scale(1.03)` : null)};
      border: none;
      overflow: hidden;
    }
  }

  .ant-card-head {
    padding: ${(props) => (props.isPlaylist ? '15px 0px 8px' : '0px')};
    border: 0;
    overflow: hidden;
    position: relative;
    .ant-card-head-title {
      border-radius: ${(props) =>
        props.isPlaylist ? '5px' : '5px 5px 0px 0px'};
      &:before {
        content: '';
        position: absolute;
        top: 8px;
        bottom: 24px;
        left: ${({ isPlaylist }) => (isPlaylist ? '8px' : '24px')};
        right: ${({ isPlaylist }) => (isPlaylist ? '8px' : '24px')};
        border-radius: 4px;
        opacity: 0.3;
        background: ${({ isPlaylist, src }) =>
          isPlaylist
            ? `url(${src})` ||
              `url(https://cdn2.edulastic.com/default/default-test-1.jpg)`
            : ''};
      }
    }
  }

  .ant-card-head-title {
    padding: 0;
  }
`

export const FullSizeThumbnailCard = styled(Card)`
  height: 100%;
  box-shadow: none;
  cursor: pointer;
  padding: ${({ isPlaylist }) => (isPlaylist ? '15px 0px 0px' : '0px')};
  border: ${({ isPlaylist }) => (isPlaylist ? 'none' : '1px solid #dfdfdf')};

  & .ant-card-cover {
    height: 300px;
  }

  & .ant-card-actions {
    border: 1px solid #dfdfdf;
    border-top: 0px;
    background: inherit;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    padding: 0px 12px;

    > li {
      margin: 10px 0;
      border-right: none;
    }
    .playlist-status {
      height: 20px;
      float: right;
      display: flex;
      align-items: center;
    }
  }
`

export const CardCover = styled.div`
  height: 100%;
  background-size: cover;
  background-position: left top;
  background-repeat: no-repeat;
  background-image: ${({ uri }) =>
    uri
      ? `url(${uri})`
      : `url(https://cdn2.edulastic.com/default/default-test-1.jpg)`};
  border-top-right-radius: 8px;
  border-top-left-radius: 8px;

  &:hover {
    .showHover {
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      flex-direction: column;
    }
  }
`

export const Inner = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 30px;
`

export const CardDescription = styled.div`
  font-size: 13px;
  height: 50px;
  overflow: hidden;
`

export const TagsWrapper = styled.div`
  overflow: hidden;
  display: flex;
  white-space: nowrap;
  text-overflow: ellipsis;
  justify-content: flex-start;
  height: ${(props) =>
    props.isPlaylist ? '47.52px' : props.testNameHeight > 22 ? '23px' : '45px'};
  margin-top: 5px;
`

export const Footer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  height: 30px;
  overflow: hidden;
`

export const Author = styled.div`
  font-size: 10px;
  font-weight: 600;
  color: ${darkGrey};
  display: ${(props) => (props.isPlaylist ? 'inline-flex' : 'block')};
  flex-direction: ${(props) => (props.isPlaylist ? 'column' : '')};
  flex-basis: 50%;
  max-width: ${(props) => (props.isPlaylist ? '110px' : '50%')};
  svg {
    width: 13px;
    height: 13px;
    fill: ${darkGrey};
    vertical-align: bottom;
    margin-left: 0px;
    margin-right: 5px;
    &:hover {
      fill: ${darkGrey};
    }
  }

  @media (min-width: ${extraDesktopWidthMax}) {
    font-size: ${(props) => (props.isPlaylist ? '11px' : '12px')};
    svg {
      width: 15px;
      height: 15px;
    }
  }
`

export const PlaylistId = styled(Author)`
  max-width: 50px;
  overflow: hidden;
  color: ${cardTitleColor};
  display: flex;
  align-items: center;
  span:first-child {
    font-size: 16px;
    margin-right: 5px;
  }
  @media (min-width: ${extraDesktopWidthMax}) {
    font-size: 10px;
  }
`

export const StatusRow = styled.div`
  height: 20px;
  overflow: hidden;
  flex-basis: 50%;
  span {
    height: 20px;
    float: right;
    display: flex;
    align-items: center;
  }
`

export const AuthorName = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: ${cardTitleColor};
`

export const LikeIcon = styled.div`
  max-width: 60px;
  display: inline-flex;
  align-items: center;
  margin-left: 15px;
`

export const AuthorWrapper = styled.span`
  display: flex;
`

export const ShareIcon = styled.div`
  max-width: 60px;
  display: inline-flex;
  align-items: center;
  float: right;
`

export const EllipsisWrapper = styled.div`
  max-height: 15px;
  min-height: 15px;
  padding-right: 15px;
  position: relative;
  overflow: hidden;
  text-align: ${(props) => (props.view === 'list' ? 'justify' : 'center')};

  /* ellipsis start */
  display: -webkit-box;
  text-overflow: ellipsis;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  cursor: pointer;
  /* ellipsis end*/

  &:before {
    position: absolute;
    right: 0;
    bottom: 0;
    background-color: white;
    color: black;
  }
  &:after {
    content: '';
    position: absolute;
    right: 0;
    width: 1rem;
    height: 1rem;
    margin-top: 0.2rem;
    background: white;
  }
`

export const IconText = styled.span`
  font-size: 10px;
  color: ${cardTitleColor};

  @media (min-width: ${extraDesktopWidthMax}) {
    font-size: 12px;
  }
`
export const CardIdWrapper = styled.div`
  color: ${darkGrey};
  font-size: 11px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  max-width: 60px;
  margin-left: 15px;
  svg {
    fill: ${darkGrey};
    width: 11px;
    height: 11px;
    &:hover {
      fill: ${darkGrey};
    }
  }

  @media (min-width: ${extraDesktopWidthMax}) {
    svg {
      width: 13px;
      height: 13px;
    }
  }
`
export const CardId = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
`
export const ViewButton = styled.div`
  margin-top: 8px !important;
  width: 120px;
  font-size: 12px;
  color: ${themeColor};
  background: white;
  padding: 8px;
  margin: 0px;
  border: 1px solid ${themeColor};
  line-height: 2.2em;
  text-transform: uppercase;
  border-radius: 4px;
  font-weight: 600;
  text-align: center;
  color: ${({ isTestAdded, remove }) =>
    isTestAdded && remove ? red : themeColor};
  cursor: pointer;
  &:hover {
    background: ${lightGrey};
  }
`

export const ButtonWrapper = styled.div`
  position: ${({ position }) => position || 'absolute'};
  height: 100%;
  left: 0px;
  right: 0px;
  top: 0px;
  bottom: 0px;
  display: none;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1;
`

export const PremiumLabel = styled.div`
  position: absolute;
  right: 10px;
  bottom: 10px;
  font-size: 10px;
  height: 20px;
  background: #feb63a;
  color: white;
  font-weight: bold;
  padding: 3px 15px;
  border-radius: 5px;
`

export const Header = styled.div`
  height: ${({ isPlaylist, isTestRecommendation }) =>
    isPlaylist ? '99px' : isTestRecommendation ? '115px' : '135px'};
  // padding: 10px 15px;
  position: relative;
  background: url(${({ src }) => src || greyLight1});
  background-repeat: no-repeat;
  background-size: 100% 100%;
  align-items: center;
  &:hover {
    .showHover {
      display: flex;
      justify-content: space-around;
      align-items: center;
    }
  }

  @media (min-width: ${extraDesktopWidthMax}) {
    height: ${({ isPlaylist, isTestRecommendation }) =>
      isPlaylist ? '100px' : isTestRecommendation ? '115px' : '135px'};
  }
`
Header.displayName = 'CardHeader'

export const HeaderThumbnail = styled.img`
  height: 100%;
  padding: 0px;
  bottom: 0px;
  position: absolute;
  left: 0;
  right: 0px;
  object-fit: ${({ isTestRecommendation }) =>
    isTestRecommendation ? 'fit' : 'contain'};
  width: ${({ isTestRecommendation }) =>
    isTestRecommendation ? '100%' : 'auto'};
`

const playlistStars = css`
  bottom: 12px;
  left: 15px;
`

const testItemStars = css`
  top: 5px;
  left: 10px;
`

export const Stars = styled(Rate)`
  font-size: 13px;
  position: absolute;
  right: auto;
  bottom: auto;
  z-index: 1;
  ${({ isPlaylist }) => (isPlaylist ? playlistStars : testItemStars)}
`

// Also Used in List view
export const StyledLink = styled.a`
  display: -webkit-box;
  font-size: 14px;
  height: 44px;
  font-weight: bold;
  width: 100%;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-decoration: none;
  color: ${themeColor};
  cursor: pointer;

  :hover {
    color: ${themeColor};
  }

  @media (min-width: ${extraDesktopWidthMax}) {
    font-size: 16px;
    height: 50px;
  }
`

export const StyledDesc = styled.p`
  height: 35px;
  overflow: hidden;
  text-align: center;
  padding-top: 10px;
  margin-bottom: 20px;
`

export const PlaylistDesc = styled(MathFormulaDisplay)`
  height: 50px;
  overflow: hidden;
  text-align: center;
  font-size: 11px;
`

export const TestInfo = styled.div`
  margin: 0px;
  text-align: ${(props) => (props.isPlaylist ? 'center' : 'left')};
`

export const MidRow = styled.div`
  border-top: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
  padding: 10px 12px;
  margin: 10px -12px 8px;
  color: ${titleColor};
  min-height: 45px;
  font-size: 11px;
  display: flex;
  text-align: center;
  font-weight: 600;
  label {
    color: #a5acb4;
    font-size: 9px;
  }

  @media (min-width: ${extraDesktopWidthMax}) {
    font-size: 13px;
    label {
      font-size: 10px;
    }
  }
`
export const Collection = styled.div`
  width: ${({ isDynamic }) => (isDynamic ? '50%' : 'calc(100% - 70px)')};
  padding: 0px 5px;
`

export const Qcount = styled.div`
  flex-basis: 70px;
  padding: 0px 5px;
`

export const DraftIconWrapper = styled.div`
  max-width: 60px;
  display: inline-flex;
  align-items: center;
  margin-left: 15px;
`

export const ThinLine = styled.div`
  border-top: 1px solid #f3f3f3;
`

export const CollectionNameWrapper = styled.div`
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`

export const DynamicIconWrapper = styled.div`
  padding: 0px 10px;
  margin-top: auto;
`

export const PlaylistCardHeaderRow = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const AlignmentInfo = styled.h5`
  font-size: 11px;
  color: ${({ dark }) => (dark ? '#969CA8' : white)};
  text-transform: uppercase;
  font-weight: bold;
  margin: 4px 0px;
  display: inline-block;
  width: 100%;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`

export const PlaylistSkinType = styled.h4`
  font-size: 16px;
  font-weight: bold;
  color: ${white};
  line-height: 1rem;
  margin: 0px;
`

export const Grade = styled.div`
  width: 62px;
  height: 20px;
  background: ${white};
  color: ${blue1};
  border-radius: 5px;
  font-size: 8px;
  text-transform: uppercase;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const StyledIcon = styled(Icon)`
  position: absolute;
  bottom: 10px;
  left: 10px;
  font-size: 18px;
  & > svg {
    fill: ${white};
  }
`
