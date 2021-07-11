import React, { useEffect } from 'react'
import styled from 'styled-components'
import { Dropdown, Menu, Icon, Tag } from 'antd'
import {
  IconHistoryPin,
  IconBoard,
  IconPlaylist2,
  IconTestBank,
} from '@edulastic/icons'
import { connect } from 'react-redux'
import { getCurrentItemsSelector, slice } from './ducks'
import moment from 'moment'
import { withRouter } from 'react-router-dom'

const typesMapping = {
  link: { icon: <Icon type="link" /> },
  test: { icon: <IconTestBank /> },
  playlist: { icon: <IconPlaylist2 /> },
  testItem: { icon: <Icon type="file-text" />, text: 'test item' },
}

function ItemRow(x) {
  return (
    <Menu.Item
      onItemHover={() => {}}
      onClick={() => {
        x.history.push(x.url)
      }}
    >
      <StyledMenuItemText>
        <div>{typesMapping[x.contentType]?.icon}</div>
        <div>
          <StyledParagraph>
            {x.contentType === 'link' ? x?.url?.replace('/', '') : x.title}
          </StyledParagraph>
          <SubInfoText>
            {' '}
            <p style={{ whiteSpace: 'nowrap' }}>
              {moment(new Date(x.pinnedTime)).fromNow()}
            </p>
            <StyledParagraphType>
              {typesMapping[x.contentType]?.text ||
                x.contentType?.toUpperCase()}
            </StyledParagraphType>
            <StyledParagraphPin style={{ alignSelf: 'flex-end' }}>
              {x.showRowPin ? (
                <IconHistoryPin
                  style={{ fontSize: '15px', cursor: 'pointer' }}
                  onClick={(e) => {
                    e.stopPropagation()
                    x.onPinClick()
                  }}
                />
              ) : (
                <Icon
                  style={{ fontSize: '15px', cursor: 'pointer' }}
                  type="close-circle"
                  onClick={(e) => {
                    e.stopPropagation()
                    x.onDelete()
                  }}
                />
              )}
            </StyledParagraphPin>
          </SubInfoText>
        </div>
      </StyledMenuItemText>
    </Menu.Item>
  )
}

const ItemsHistoryCard = ({
  addAutoPin,
  addPin,
  loadPins,
  pinnedItems,
  autoPinnedItems,
  data,
  autoPinItem,
  pinsKeyed,
  removePin,
  history,
  subscription = {},
  isPremiumTrialUsed,
  user,
  showPinIcon,
  style,
}) => {
  useEffect(() => {
    loadPins()
  }, [])
  const currentUrl = window.location.href.replace(window.location.origin, '')
  useEffect(() => {
    if (autoPinItem && data?.title && data?.contentId) {
      addAutoPin({ ...data, pinnedTime: +new Date(), url: currentUrl })
    }
  }, [autoPinItem, data?.title, data?.contentId])

  const isPinShown =
    (user?.features?.premium && subscription?._id) || isPremiumTrialUsed

  if (!data) {
    data = {
      contentType: 'link',
      contentId: currentUrl,
      url: currentUrl,
      pinnedTime: +new Date(),
    }
  }
  const alreadyPresent = data?.contentId && data?.contentId in pinsKeyed

  const announcements = (
    <>
      <span>Announcements :</span>
      <a
        href="https://edulastic.com/blog/april-2021-updates/"
        rel="noreferrer"
        target="_blank"
      >
        {' '}
        April 2021 New Edulastic Features
      </a>
    </>
  )

  const text = (
    <StyledMenu isPinShown={isPinShown}>
      {autoPinnedItems.length > 0 ? (
        <HeaderText>
          Five recent tests ,questions, playlists and announcements{' '}
        </HeaderText>
      ) : null}
      {autoPinnedItems.map((x) => (
        <ItemRow
          onPinClick={() => {
            addPin(x)
          }}
          showRowPin
          key={x.contentId}
          history={history}
          {...x}
        />
      ))}
      <StyledAnnouncment style={{ fontSize: '12px', paddingTop: '10px' }}>
        {announcements}
      </StyledAnnouncment>
      {console.log(pinnedItems, autoPinnedItems, 'yesh')}
      {pinnedItems.length > 0 ? (
        <HeaderText>Pages pinned to board</HeaderText>
      ) : null}
      {pinnedItems.map((x) => (
        <ItemRow
          key={x.contentId}
          history={history}
          onDelete={() => {
            removePin(x.contentId)
          }}
          {...x}
        />
      ))}
    </StyledMenu>
  )

  const boardText = (
    <StyledMenu isPinShown={isPinShown}>
      <Menu.Item>
        <StyledAnnouncment style={{ fontSize: '12px' }}>
          {announcements}
        </StyledAnnouncment>
        <TextUpgrade onClick={() => history.push('/author/subscription')}>
          Upgrade to access more of pin to board feature{' '}
        </TextUpgrade>
      </Menu.Item>
    </StyledMenu>
  )
  return (
    <StyledDiv style={style}>
      <StyledDropdown
        overlayStyle={{ zIndex: 2000 }}
        overlay={isPinShown ? text : boardText}
        placement="bottomCenter"
        trigger={['click']}
        onVisibleChange={(visible) => {
          if (visible) {
          }
        }}
      >
        <IconBoard
          style={{
            fontSize: '20px',
            paddingRight: '5px',
            paddingTop: '3px',
            fill: '#2f4151',
          }}
        />
      </StyledDropdown>
      {isPinShown && showPinIcon ? (
        <IconHistoryPin
          theme={alreadyPresent ? 'filled' : ''}
          onClick={() => {
            if (alreadyPresent) {
              console.log('removin pins')
              removePin(data?.contentId)
            } else {
              addPin({
                ...data,
                url: window.location.href.replace(window.location.origin, ''),
                pinnedTime: +new Date(),
              })
            }
          }}
          style={{
            fontSize: '24px',
            cursor: 'pointer',
          }}
        />
      ) : null}

      {/* <Icon style={{fontSize:'24px'}} type="folder-open" /> */}
    </StyledDiv>
  )
}

const StyledDiv = styled.div`
  display: flex;
  align-self: center;
`
const StyledSpan = styled.span`
  display: inline-block;
  font-size: 13px;
`

const StyledDropdown = styled(Dropdown)``

const StyledMenu = styled(Menu)`
  width: ${(props) => (props.isPinShown ? '400px' : '350px')};
  max-height: 450px;
  border-radius: 10px;
  box-shadow: 0px 0px 20px #a0a0a0;
  padding-bottom: 10px;
  overflow-x: hidden;
  position: relative;
  top: 20px;
  padding-top: ${(props) => (props.isPinShown ? ' ' : '10px')};
  &::-webkit-scrollbar {
    width: 6px;
  }
  ::-webkit-scrollbar-track {
    background: #fff;
  }
  ::-webkit-scrollbar-thumb {
    background: #f1f1f1;
    border-radius: 5px;
  }
  & > li {
    margin: auto;
    width: ${(props) => (props.isPinShown ? '95%' : '100%')};
    border-radius: 5px;
    margin-top: 10px;
    &:hover {
      background-color: #fff;
    }
  }
  .anticon.anticon-pushpin {
    transition: all 0.3s;
    transform-origin: center center;
    &:active {
      transform: scale(3);
    }
  }
`

const HeaderText = styled.h4`
  font-weight: bold;
  color: #1ab394;
  padding-left: 25px;
  margin-top: 10px;
`

const TextUpgrade = styled.h4`
  font-weight: bold;
  color: #1ab394;
  padding-top: 10px;
`
const StyledMenuItemText = styled.div`
  transition: all 0.6s;
  cursor: pointer;
  display: flex;
  &:hover {
    background-color: rgba(0, 0, 0, 0.2);
  }
  & > div:nth-child(1) {
    padding-top: 4px;
  }
  & > div:nth-child(2) {
    margin-left: 5px;
    span {
      font-weight: 550;
      color: #2f4151;
    }
    p {
      line-height: 1.5;
      font-size: 12px;
      text-transform: lowercase;
    }
  }
`
const StyledParagraph = styled.p`
  white-space: nowrap;
  width: 350px;
  overflow: hidden;
  text-overflow: ellipsis;
`

const StyledParagraphPin = styled.p`
  align-self: flex-end;
  text-align: end;
  position: relative;
  top: -3px;
`

const StyledParagraphType = styled.p`
  padding-left: 50px !important;
  text-transform: uppercase !important;
`

const StyledAnnouncment = styled.p`
  padding-left: 25px;
  color: #2f4151;
  & > span {
    font-weight: bold;
  }
`
const SubInfoText = styled.div`
  display: flex;
  justify-content: space-between;
  p {
    flex: 1;
  }
`
export default connect(
  (state) => ({
    pinnedItems: getCurrentItemsSelector(state),
    pinsKeyed: state?.pinned?.pinsKeyed,
    autoPinnedItems: state.pinned?.autoPins,
    user: state.user.user,
    subscription: state?.subscription?.subscriptionData?.subscription,
    isPremiumTrialUsed:
      state?.subscription?.subscriptionData?.isPremiumTrialUsed,
  }),
  {
    addPin: slice.actions.addPin,
    addAutoPin: slice.actions.addAutoPins,
    loadPins: slice.actions.loadItems,
    removePin: slice.actions.removePin,
  }
)(withRouter(ItemsHistoryCard))
